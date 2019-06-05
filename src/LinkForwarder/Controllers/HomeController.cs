using System;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;
using Dapper;
using Microsoft.AspNetCore.Mvc;
using LinkForwarder.Models;
using LinkForwarder.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace LinkForwarder.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly IConfiguration _configuration;
        private readonly ITokenGenerator _tokenGenerator;
        private readonly AppSettings _appSettings;

        private IDbConnection DbConnection => new SqlConnection(_configuration.GetConnectionString("LinkForwarderDatabase"));

        public HomeController(
            IOptions<AppSettings> settings,
            IConfiguration configuration,
            ILogger<HomeController> logger,
            ITokenGenerator tokenGenerator)
        {
            _appSettings = settings.Value;
            _configuration = configuration;
            _logger = logger;
            _tokenGenerator = tokenGenerator;
        }

        public async Task<IActionResult> Index()
        {
            try
            {
                using (var conn = DbConnection)
                {
                    var linkCount = await conn.ExecuteScalarAsync<int>("SELECT Count(l.Id) FROM Link l");
                    var obj = new
                    {
                        Server = Environment.MachineName,
                        Product = $"Link Forwarder Build {Utils.AppVersion}",
                        LinkCount = linkCount
                    };

                    return Json(obj);
                }
            }
            catch (Exception e)
            {
                _logger.LogError(e, e.Message);
                return new StatusCodeResult(StatusCodes.Status500InternalServerError);
            }
        }

        [Route("fw/{token}")]
        public async Task<IActionResult> Forward(string token, [FromServices] IMemoryCache cache)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(token))
                {
                    return BadRequest();
                }

                bool isValid = _tokenGenerator.TryParseToken(token, out var validatedToken);
                if (!isValid)
                {
                    return BadRequest();
                }

                if (!cache.TryGetValue(token, out Link linkEntry))
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
                        var link = await conn.QueryFirstOrDefaultAsync<Link>(sql, new { fwToken = validatedToken });
                        if (null == link)
                        {
                            if (string.IsNullOrWhiteSpace(_appSettings.DefaultRedirectionUrl)) return NotFound();

                            if (_appSettings.DefaultRedirectionUrl.IsValidUrl()
                                && !Url.IsLocalUrl(_appSettings.DefaultRedirectionUrl))
                            {
                                return Redirect(_appSettings.DefaultRedirectionUrl);
                            }

                            throw new UriFormatException("DefaultRedirectionUrl is not a valid URL.");
                        }

                        if (!link.OriginUrl.IsValidUrl())
                        {
                            throw new UriFormatException(
                                $"OriginUrl '{link.OriginUrl}' is not a valid URL, link ID: {link.Id}.");
                        }

                        if (!link.IsEnabled)
                        {
                            return Forbid();
                        }

                        // cache valid link entity only.
                        cache.Set(token, link, TimeSpan.FromHours(1));
                    }
                }

                if (null == linkEntry)
                {
                    linkEntry = cache.Get<Link>(token);
                }

                var ip = HttpContext.Connection.RemoteIpAddress.ToString();
                var ua = Request.Headers["User-Agent"];
                _ = Task.Run(async () =>
                {
                    await TrackSucessRedirection(ip, ua, linkEntry.Id);
                });

                return Redirect(linkEntry.OriginUrl);
            }
            catch (Exception e)
            {
                _logger.LogError(e, e.Message);
                return new StatusCodeResult(StatusCodes.Status500InternalServerError);
            }
        }

        private async Task TrackSucessRedirection(string ipAddress, string userAgent, int linkId)
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
                }
            }
            catch (Exception e)
            {
                _logger.LogError(e, e.Message);
                throw;
            }
        }
    }
}
