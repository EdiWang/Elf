using System;
using System.Collections.Generic;
using System.Data;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Dapper;
using Microsoft.AspNetCore.Mvc;
using LinkForwarder.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace LinkForwarder.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        private readonly IDbConnection _dbConnection;

        public HomeController(IDbConnection dbConnection, ILogger<HomeController> logger)
        {
            _dbConnection = dbConnection;
            _logger = logger;
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

                // TODO: Validate token format (including length)

                using (_dbConnection)
                {
                    var sql = @"SELECT TOP 1 
                                l.Id,
                                l.OriginUrl,
                                l.FwToken,
                                l.Note,
                                l.IsEnabled,
                                l.UpdateTimeUtc
                                FROM Link l
                                WHERE l.FwToken = @fwToken";
                    var link = await _dbConnection.QueryFirstOrDefaultAsync<Link>(sql, new { fwToken = token });
                    if (null == link)
                    {
                        // TODO: Forward unknown link to configured default redirection url
                    }

                    // TODO: record user info

                    // TODO: validate OriginUrl format and secure
                    return Redirect(link.OriginUrl);
                }
            }
            catch (Exception e)
            {
                _logger.LogError(e, e.Message);
                return new StatusCodeResult(StatusCodes.Status500InternalServerError);
            }
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
