using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Dapper;
using Elf.Services.Entities;
using Elf.Services.Models;
using Elf.Services.TokenGenerator;
using LinqToDB;
using Microsoft.Extensions.Logging;
using UAParser;

namespace Elf.Services
{
    public class LinkForwarderService : ILinkForwarderService
    {
        private readonly ILogger<LinkForwarderService> _logger;
        private readonly ITokenGenerator _tokenGenerator;
        private readonly IDbConnection _conn;
        private readonly AppDataConnection _connection;

        public LinkForwarderService(
            ILogger<LinkForwarderService> logger,
            ITokenGenerator tokenGenerator,
            IDbConnection conn,
            AppDataConnection connection)
        {
            _logger = logger;
            _tokenGenerator = tokenGenerator;
            _conn = conn;
            _connection = connection;
        }

        public Task<bool> IsLinkExistsAsync(string token)
        {
            if (string.IsNullOrWhiteSpace(token)) return Task.FromResult(false);
            return _connection.Link.AnyAsync(p => p.FwToken == token);
        }

        public async Task<(IReadOnlyList<Link> Links, int TotalRows)> GetPagedLinksAsync(
            int offset, int pageSize, string noteKeyword = null)
        {
            if (pageSize < 1)
            {
                throw new ArgumentOutOfRangeException(nameof(pageSize),
                    $"{nameof(pageSize)} can not be less than 1, current value: {pageSize}.");
            }
            if (offset < 0)
            {
                throw new ArgumentOutOfRangeException(nameof(offset),
                    $"{nameof(offset)} can not be less than 0, current value: {offset}.");
            }

            var links = from l in _connection.Link
                        select l;

            if (noteKeyword is not null)
            {
                links = from l in _connection.Link
                        where l.Note.Contains(noteKeyword) || l.FwToken.Contains(noteKeyword)
                        select l;
            }

            var totalRows = await links.CountAsync();
            var data = await links.OrderByDescending(p => p.UpdateTimeUtc)
                                  .Skip(offset)
                                  .Take(pageSize)
                                  .ToListAsync();

            return (data, totalRows);
        }

        public async Task<string> CreateLinkAsync(CreateLinkRequest createLinkRequest)
        {
            var l = await _connection.Link.FirstOrDefaultAsync(p => p.OriginUrl == createLinkRequest.OriginUrl);
            var tempToken = l?.FwToken;
            if (tempToken is not null)
            {
                if (_tokenGenerator.TryParseToken(tempToken, out var tk))
                {
                    _logger.LogInformation($"Link already exists for token '{tk}'");
                    return tk;
                }

                string message = $"Invalid token '{tempToken}' found for existing url '{createLinkRequest.OriginUrl}'";
                _logger.LogError(message);
            }

            string token;
            do
            {
                token = _tokenGenerator.GenerateToken();
            } while (await _connection.Link.AnyAsync(p => p.FwToken == token));

            _logger.LogInformation($"Generated Token '{token}' for url '{createLinkRequest.OriginUrl}'");

            var link = new Link
            {
                FwToken = token,
                IsEnabled = createLinkRequest.IsEnabled,
                Note = createLinkRequest.Note,
                AkaName = createLinkRequest.AkaName,
                OriginUrl = createLinkRequest.OriginUrl,
                UpdateTimeUtc = DateTime.UtcNow,
                TTL = createLinkRequest.TTL
            };

            await _connection.InsertAsync(link);
            return link.FwToken;
        }

        public async Task<string> EditLinkAsync(EditLinkRequest editLinkRequest)
        {
            var link = await _connection.Link.FirstOrDefaultAsync(p => p.Id == editLinkRequest.Id);
            if (link is null) return null;

            link.OriginUrl = editLinkRequest.NewUrl;
            link.Note = editLinkRequest.Note;
            link.AkaName = editLinkRequest.AkaName;
            link.IsEnabled = editLinkRequest.IsEnabled;
            link.TTL = editLinkRequest.TTL;

            await _connection.UpdateAsync(link);
            return link.FwToken;
        }

        public Task<int> CountLinksAsync()
        {
            return _connection.Link.CountAsync();
        }

        public Task<Link> GetLinkAsync(int id)
        {
            return _connection.Link.FirstOrDefaultAsync(p => p.Id == id);
        }

        public Task<Link> GetLinkAsync(string token)
        {
            return _connection.Link.FirstOrDefaultAsync(p => p.FwToken == token);
        }

        public async Task<string> GetTokenByAkaNameAsync(string akaName)
        {
            var link = await _connection.Link.FirstOrDefaultAsync(p => p.AkaName == akaName);
            return link?.FwToken;
        }

        public Task DeleteLink(int linkId)
        {
            return _connection.Link.Where(p => p.Id == linkId).DeleteAsync();
        }

        public async Task<IReadOnlyList<LinkTrackingDateCount>> GetLinkTrackingDateCount(int daysFromNow)
        {
            const string sql = @"SELECT 
                                 COUNT(lt.Id) AS RequestCount, 
                                 CAST(lt.RequestTimeUtc AS DATE) TrackingDateUtc
                                 FROM LinkTracking lt
                                 WHERE lt.RequestTimeUtc < GETUTCDATE() 
                                 AND lt.RequestTimeUtc > DATEADD(DAY, -@daysFromNow, CAST(GETUTCDATE() AS DATE))
                                 GROUP BY CAST(lt.RequestTimeUtc AS DATE)";

            var list = await _conn.QueryAsync<LinkTrackingDateCount>(sql, new { daysFromNow });
            return list.AsList();
        }

        public async Task<IReadOnlyList<ClientTypeCount>> GetClientTypeCounts(int daysFromNow, int topTypes)
        {
            var uaParser = Parser.GetDefault();

            string GetClientTypeName(string userAgent)
            {
                if (string.IsNullOrWhiteSpace(userAgent)) return "N/A";

                ClientInfo c = uaParser.Parse(userAgent);
                return $"{c.OS.Family}-{c.UA.Family}";
            }

            var utc = DateTime.UtcNow;
            var uac = await _connection.LinkTracking
                                        .Where(p =>
                                           p.RequestTimeUtc < utc &&
                                           p.RequestTimeUtc > utc.AddDays(-1 * daysFromNow))
                                        .GroupBy(p => p.UserAgent)
                                        .Select(p => new UserAgentCount
                                        {
                                            RequestCount = p.Count(),
                                            UserAgent = p.Key
                                        }).ToListAsync();

            if (uac is not null && uac.Any())
            {
                var q = from d in uac
                        group d by GetClientTypeName(d.UserAgent)
                        into g
                        select new ClientTypeCount
                        {
                            ClientTypeName = g.Key,
                            Count = g.Sum(gp => gp.RequestCount)
                        };

                if (topTypes > 0) q = q.OrderByDescending(p => p.Count).Take(topTypes);
                return q.AsList();
            }
            return new List<ClientTypeCount>();
        }

        public async Task<IReadOnlyList<MostRequestedLinkCount>> GetMostRequestedLinkCount(int daysFromNow)
        {
            const string sql = @"SELECT l.FwToken, l.Note, COUNT(lt.Id) AS RequestCount
                                 FROM Link l INNER JOIN LinkTracking lt ON l.Id = lt.LinkId
                                 WHERE lt.RequestTimeUtc < GETUTCDATE() 
                                 AND lt.RequestTimeUtc > DATEADD(DAY, -@daysFromNow, CAST(GETUTCDATE() AS DATE))
                                 GROUP BY l.FwToken, l.Note";

            var list = await _conn.QueryAsync<MostRequestedLinkCount>(sql, new { daysFromNow });
            return list.AsList();
        }

        public Task TrackSucessRedirectionAsync(LinkTrackingRequest request)
        {
            var lt = new LinkTracking
            {
                IpAddress = request.IpAddress,
                LinkId = request.LinkId,
                RequestTimeUtc = DateTime.UtcNow,
                UserAgent = request.UserAgent
            };

            return _connection.InsertAsync(lt);
        }

        public Task ClearTrackingDataAsync()
        {
            return _connection.LinkTracking.DeleteAsync();
        }

        //public async Task<IReadOnlyList<LinkTracking>> GetTrackingRecords(int linkId, int top = 100)
        //{
        //    const string sql = @"SELECT TOP (@top)
        //                         lt.Id, lt.LinkId, lt.UserAgent, lt.IpAddress, lt.RequestTimeUtc 
        //                         FROM LinkTracking lt WHERE lt.linkId = @linkId
        //                         ORDER BY lt.RequestTimeUtc DESC";
        //    var list = await _conn.QueryAsync<LinkTracking>(sql, new { top, linkId });
        //    return list.AsList();
        //}

        public async Task<IReadOnlyList<RequestTrack>> GetRecentRequests(int top)
        {
            var result = await (from l in _connection.Link
                                join lt in _connection.LinkTracking on l.Id equals lt.LinkId
                                orderby lt.RequestTimeUtc descending
                                select new RequestTrack
                                {
                                    FwToken = l.FwToken,
                                    Note = l.Note,
                                    RequestTimeUtc = lt.RequestTimeUtc,
                                    IpAddress = lt.IpAddress,
                                    UserAgent = lt.UserAgent
                                }).Take(top).ToListAsync();

            return result;
        }
    }
}
