using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using Dapper;
using Edi.Practice.RequestResponseModel;
using LinkForwarder.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace LinkForwarder.Services
{
    public class LinkForwarderService : ILinkForwarderService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<LinkForwarderService> _logger;
        private readonly ITokenGenerator _tokenGenerator;

        private IDbConnection DbConnection => new SqlConnection(_configuration.GetConnectionString(Constants.DbName));

        public LinkForwarderService(
            IConfiguration configuration,
            ILogger<LinkForwarderService> logger,
            ITokenGenerator tokenGenerator)
        {
            _configuration = configuration;
            _logger = logger;
            _tokenGenerator = tokenGenerator;
        }

        public async Task<Response<IReadOnlyList<RecentRequest>>> GetRecentRequestsAsync(int top)
        {
            try
            {
                using (var conn = DbConnection)
                {
                    const string sql = @"SELECT TOP (@top)
                                         l.FwToken, l.OriginUrl, lt.IpAddress, lt.UserAgent, lt.RequestTimeUtc 
                                         FROM LinkTracking lt
                                         INNER JOIN Link l on lt.LinkId = l.Id ORDER BY lt.RequestTimeUtc DESC";
                    var list = await conn.QueryAsync<RecentRequest>(sql, new { top });
                    return new SuccessResponse<IReadOnlyList<RecentRequest>>(list.ToList());
                }
            }
            catch (Exception e)
            {
                _logger.LogError(e, e.Message);
                return new FailedResponse<IReadOnlyList<RecentRequest>>(e.Message);
            }
        }

        public async Task<Response<bool>> IsLinkExistsAsync(string token)
        {
            try
            {
                using (var conn = DbConnection)
                {
                    const string sql = @"SELECT TOP 1 1 FROM Link l
                                            WHERE l.FwToken = @token";
                    var exist = await conn.ExecuteScalarAsync<int>(sql, new { token }) == 1;
                    return new SuccessResponse<bool>(exist);
                }
            }
            catch (Exception e)
            {
                _logger.LogError(e, e.Message);
                return new FailedResponse<bool>(e.Message);
            }
        }

        public async Task<Response<IReadOnlyList<Link>>> GetPagedLinksAsync(int pageIndex, int pageSize)
        {
            if (pageSize < 1)
            {
                throw new ArgumentOutOfRangeException(nameof(pageSize),
                    $"{nameof(pageSize)} can not be less than 1, current value: {pageSize}.");
            }
            if (pageIndex < 1)
            {
                throw new ArgumentOutOfRangeException(nameof(pageIndex),
                    $"{nameof(pageIndex)} can not be less than 1, current value: {pageIndex}.");
            }

            try
            {
                using (var conn = DbConnection)
                {
                    const string sql = @"SELECT 
                                         l.Id,
                                         l.OriginUrl,
                                         l.FwToken,
                                         l.Note,
                                         l.IsEnabled,
                                         l.UpdateTimeUtc
                                         FROM Link l 
                                         ORDER BY UpdateTimeUtc DESC 
                                         OFFSET (@pageIndex - 1) * @pageSize ROWS 
                                         FETCH NEXT @pageSize ROWS ONLY";

                    var list = await conn.QueryAsync<Link>(sql, new { pageIndex, pageSize });
                    return new SuccessResponse<IReadOnlyList<Link>>(list.ToList());
                }
            }
            catch (Exception e)
            {
                _logger.LogError(e, e.Message);
                return new FailedResponse<IReadOnlyList<Link>>(e.Message);
            }
        }

        public async Task<Response<string>> CreateLinkAsync(string originUrl, string note, bool isEnabled)
        {
            try
            {
                using (var conn = DbConnection)
                {
                    const string sqlLinkExist = "SELECT TOP 1 FwToken FROM Link l WHERE l.OriginUrl = @originUrl";
                    var tempToken = await conn.ExecuteScalarAsync<string>(sqlLinkExist, new { originUrl });
                    if (null != tempToken)
                    {
                        if (_tokenGenerator.TryParseToken(tempToken, out var tk))
                        {
                            _logger.LogInformation($"Link already exists for token '{tk}'");
                            return new SuccessResponse<string>(tk);
                        }

                        string message = $"Invalid token '{tempToken}' found for existing url '{originUrl}'";
                        _logger.LogError(message);
                    }

                    const string sqlTokenExist = "SELECT TOP 1 1 FROM Link l WHERE l.FwToken = @token";
                    string token;
                    do
                    {
                        token = _tokenGenerator.GenerateToken();
                    } while (await conn.ExecuteScalarAsync<int>(sqlTokenExist, new { token }) == 1);

                    _logger.LogInformation($"Generated Token '{token}' for url '{originUrl}'");

                    var link = new Link
                    {
                        FwToken = token,
                        IsEnabled = isEnabled,
                        Note = note,
                        OriginUrl = originUrl,
                        UpdateTimeUtc = DateTime.UtcNow
                    };
                    const string sqlInsertLk = @"INSERT INTO Link (OriginUrl, FwToken, Note, IsEnabled, UpdateTimeUtc) 
                                                 VALUES (@OriginUrl, @FwToken, @Note, @IsEnabled, @UpdateTimeUtc)";
                    await conn.ExecuteAsync(sqlInsertLk, link);
                    return new SuccessResponse<string>(link.FwToken);
                }
            }
            catch (Exception e)
            {
                _logger.LogError(e, e.Message);
                return new FailedResponse<string>(e.Message);
            }
        }

        public async Task<Response<string>> EditLinkAsync(int linkId, string newUrl, string note, bool isEnabled)
        {
            try
            {
                using (var conn = DbConnection)
                {
                    const string sqlFindLink = @"SELECT TOP 1 
                                                 l.Id,
                                                 l.OriginUrl,
                                                 l.FwToken,
                                                 l.Note,
                                                 l.IsEnabled,
                                                 l.UpdateTimeUtc
                                                 FROM Link l WHERE l.Id = @id";
                    var link = await conn.QueryFirstOrDefaultAsync<Link>(sqlFindLink, new { id = linkId });
                    if (null == link)
                    {
                        return new FailedResponse<string>($"Link with id '{linkId}' does not exist.");
                    }

                    link.OriginUrl = newUrl;
                    link.Note = note;
                    link.IsEnabled = isEnabled;

                    const string sqlUpdate = @"UPDATE Link SET 
                                               OriginUrl = @OriginUrl,
                                               Note = @Note,
                                               IsEnabled = @IsEnabled
                                               WHERE Id = @Id";
                    await conn.ExecuteAsync(sqlUpdate, link);
                    return new SuccessResponse<string>(link.FwToken);
                }
            }
            catch (Exception e)
            {
                _logger.LogError(e, e.Message);
                return new FailedResponse<string>(e.Message);
            }
        }

        public async Task<Response<int>> CountLinksAsync()
        {
            try
            {
                using (var conn = DbConnection)
                {
                    var linkCount = await conn.ExecuteScalarAsync<int>("SELECT Count(l.Id) FROM Link l");
                    return new SuccessResponse<int>(linkCount);
                }
            }
            catch (Exception e)
            {
                _logger.LogError(e, e.Message);
                return new FailedResponse<int>(e.Message);
            }
        }

        public async Task<Response<Link>> GetLinkAsync(int id)
        {
            try
            {
                using (var conn = DbConnection)
                {
                    const string sql = @"SELECT TOP 1 
                                         l.Id,
                                         l.OriginUrl,
                                         l.FwToken,
                                         l.Note,
                                         l.IsEnabled,
                                         l.UpdateTimeUtc
                                         FROM Link l
                                         WHERE l.Id = @id";
                    var link = await conn.QueryFirstOrDefaultAsync<Link>(sql, new { id });
                    return new SuccessResponse<Link>(link);
                }
            }
            catch (Exception e)
            {
                _logger.LogError(e, e.Message);
                return new FailedResponse<Link>(e.Message);
            }
        }

        public async Task<Response<Link>> GetLinkAsync(string token)
        {
            try
            {
                using (var conn = DbConnection)
                {
                    const string sql = @"SELECT TOP 1 
                                         l.Id,
                                         l.OriginUrl,
                                         l.FwToken,
                                         l.Note,
                                         l.IsEnabled,
                                         l.UpdateTimeUtc
                                         FROM Link l
                                         WHERE l.FwToken = @fwToken";
                    var link = await conn.QueryFirstOrDefaultAsync<Link>(sql, new { fwToken = token });
                    return new SuccessResponse<Link>(link);
                }
            }
            catch (Exception e)
            {
                _logger.LogError(e, e.Message);
                return new FailedResponse<Link>(e.Message);
            }
        }

        public async Task<Response> DeleteLink(int linkId)
        {
            try
            {
                using (var conn = DbConnection)
                {
                    const string sql = "DELETE FROM Link WHERE Id = @linkId";
                    await conn.ExecuteAsync(sql, new { linkId });
                    return new SuccessResponse();
                }
            }
            catch (Exception e)
            {
                _logger.LogError(e, e.Message);
                return new FailedResponse(e.Message);
            }
        }

        public async Task<Response> TrackSucessRedirectionAsync(string ipAddress, string userAgent, int linkId)
        {
            try
            {
                using (var conn = DbConnection)
                {
                    var lt = new LinkTracking
                    {
                        Id = Guid.NewGuid(),
                        IpAddress = ipAddress,
                        LinkId = linkId,
                        RequestTimeUtc = DateTime.UtcNow,
                        UserAgent = userAgent
                    };

                    const string sqlInsertLt = @"INSERT INTO LinkTracking (Id, IpAddress, LinkId, RequestTimeUtc, UserAgent) 
                                                 VALUES (@Id, @IpAddress, @LinkId, @RequestTimeUtc, @UserAgent)";
                    await conn.ExecuteAsync(sqlInsertLt, lt);
                    return new SuccessResponse();
                }
            }
            catch (Exception e)
            {
                _logger.LogError(e, e.Message);
                return new FailedResponse(e.Message);
            }
        }

        public async Task<Response<IReadOnlyList<LinkTracking>>> GetTrackingRecords(int linkId, int top = 100)
        {
            try
            {
                using (var conn = DbConnection)
                {
                    const string sql = @"SELECT TOP (@top)
                                         lt.Id, lt.LinkId, lt.UserAgent, lt.IpAddress, lt.RequestTimeUtc 
                                         FROM LinkTracking lt WHERE lt.linkId = @linkId
                                         ORDER BY lt.RequestTimeUtc DESC";
                    var list = await conn.QueryAsync<LinkTracking>(sql, new { top, linkId });
                    return new SuccessResponse<IReadOnlyList<LinkTracking>>(list.ToList());
                }
            }
            catch (Exception e)
            {
                _logger.LogError(e, e.Message);
                return new FailedResponse<IReadOnlyList<LinkTracking>>(e.Message);
            }
        }

        public async Task<Response<int>> GetClickCount(int linkId)
        {
            try
            {
                using (var conn = DbConnection)
                {
                    const string sql = "SELECT COUNT(lt.Id) FROM LinkTracking lt WHERE lt.LinkId = @linkId";
                    var count = await conn.ExecuteScalarAsync<int>(sql, new { linkId });
                    return new SuccessResponse<int>(count);
                }
            }
            catch (Exception e)
            {
                _logger.LogError(e, e.Message);
                return new FailedResponse<int>(e.Message);
            }
        }
    }
}
