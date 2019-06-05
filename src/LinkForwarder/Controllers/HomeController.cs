using System;
using System.Collections.Generic;
using System.Data;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Dapper;
using Microsoft.AspNetCore.Mvc;
using LinkForwarder.Models;
using LinkForwarder.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace LinkForwarder.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        private readonly IDbConnection _dbConnection;

        private readonly ITokenGenerator _tokenGenerator;

        private AppSettings _appSettings;

        public HomeController(
            IOptions<AppSettings> settings,
            IDbConnection dbConnection, 
            ILogger<HomeController> logger, 
            ITokenGenerator tokenGenerator)
        {
            _appSettings = settings.Value;
            _dbConnection = dbConnection;
            _logger = logger;
            _tokenGenerator = tokenGenerator;
        }

        public async Task<IActionResult> Index()
        {
            try
            {
                using (_dbConnection)
                {
                    var linkCount = await _dbConnection.ExecuteScalarAsync<int>("SELECT Count(l.Id) FROM Link l");
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

        // TODO: Cache
        [Route("fw/{token}")]
        public async Task<IActionResult> Forward(string token)
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

                using (_dbConnection)
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
                    var link = await _dbConnection.QueryFirstOrDefaultAsync<Link>(sql, new { fwToken = validatedToken });
                    if (null == link)
                    {
                        return !string.IsNullOrWhiteSpace(_appSettings.DefaultRedirectionUrl) ? 
                                VerifyAndRedirect(_appSettings.DefaultRedirectionUrl) : 
                                NotFound();
                    }

                    // TODO: record user info

                    return VerifyAndRedirect(link.OriginUrl);
                }
            }
            catch (Exception e)
            {
                _logger.LogError(e, e.Message);
                return new StatusCodeResult(StatusCodes.Status500InternalServerError);
            }
        }

        private IActionResult VerifyAndRedirect(string url)
        {
            // TODO: validate URL format and secure
            return Redirect(url);
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
