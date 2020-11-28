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

            const string sql = @"SELECT
                                 l.Id,
                                 l.OriginUrl,
                                 l.FwToken,
                                 l.Note,
                                 l.AkaName,
                                 l.IsEnabled,
                                 l.UpdateTimeUtc,
                                 l.TTL
                                 FROM Link l
                                 WHERE @noteKeyword IS NULL 
                                 OR l.Note LIKE '%' + @noteKeyword + '%' 
                                 OR l.FwToken LIKE '%' + @noteKeyword + '%'
                                 ORDER BY UpdateTimeUtc DESC 
                                 OFFSET @offset ROWS 
                                 FETCH NEXT @pageSize ROWS ONLY";

            var links = await _conn.QueryAsync<Link>(sql, new { offset, pageSize, noteKeyword });

            const string sqlTotalRows = @"SELECT COUNT(l.Id)
                                          FROM Link l
                                          WHERE @noteKeyword IS NULL OR l.Note LIKE '%' + @noteKeyword + '%'";

            var totalRows = await _conn.ExecuteScalarAsync<int>(sqlTotalRows, new { noteKeyword });
            return (links.AsList(), totalRows);
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
            const string sqlFindLink = @"SELECT TOP 1 
                                         l.Id,
                                         l.OriginUrl,
                                         l.FwToken,
                                         l.Note,
                                         l.AkaName,
                                         l.IsEnabled,
                                         l.UpdateTimeUtc,
                                         l.TTL
                                         FROM Link l WHERE l.Id = @id";
            var link = await _conn.QueryFirstOrDefaultAsync<Link>(sqlFindLink, new { id = editLinkRequest.Id });
            if (link is null) return null;

            link.OriginUrl = editLinkRequest.NewUrl;
            link.Note = editLinkRequest.Note;
            link.AkaName = editLinkRequest.AkaName;
            link.IsEnabled = editLinkRequest.IsEnabled;
            link.TTL = editLinkRequest.TTL;

            const string sqlUpdate = @"UPDATE Link SET 
                                       OriginUrl = @OriginUrl,
                                       Note = @Note,
                                       AkaName = @AkaName,
                                       IsEnabled = @IsEnabled,
                                       TTL = @TTL
                                       WHERE Id = @Id";
            await _conn.ExecuteAsync(sqlUpdate, link);
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

            const string sql = @"SELECT lt.UserAgent, COUNT(lt.Id) AS RequestCount
                                 FROM LinkTracking lt
                                 WHERE lt.RequestTimeUtc < GETUTCDATE() 
                                 AND lt.RequestTimeUtc > DATEADD(DAY, -@daysFromNow, CAST(GETUTCDATE() AS DATE))
                                 GROUP BY lt.UserAgent";

            var rawData = await _conn.QueryAsync<UserAgentCount>(sql, new { daysFromNow });
            var userAgentCounts = rawData as UserAgentCount[] ?? rawData.ToArray();
            if (userAgentCounts.Any())
            {
                var q =
                    from d in userAgentCounts
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
            const string sql = @"SELECT TOP (@top)
                                 l.FwToken, l.Note, lt.RequestTimeUtc, lt.IpAddress, lt.UserAgent
                                 FROM LinkTracking lt INNER JOIN Link l ON lt.LinkId = l.Id
                                 ORDER BY lt.RequestTimeUtc DESC";

            var list = await _conn.QueryAsync<RequestTrack>(sql, new { top });
            return list.AsList();
        }
    }
}
