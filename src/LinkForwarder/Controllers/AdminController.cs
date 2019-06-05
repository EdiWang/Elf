using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using Dapper;
using LinkForwarder.Models;
using LinkForwarder.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace LinkForwarder.Controllers
{
    [Authorize]
    [Route("admin")]
    public class AdminController : Controller
    {
        private readonly ILogger<AdminController> _logger;
        private readonly IConfiguration _configuration;
        private readonly ITokenGenerator _tokenGenerator;
        private readonly AppSettings _appSettings;

        private IDbConnection DbConnection => new SqlConnection(_configuration.GetConnectionString("LinkForwarderDatabase"));

        public AdminController(
            IOptions<AppSettings> settings,
            ILogger<AdminController> logger,
            IConfiguration configuration,
            ITokenGenerator tokenGenerator)
        {
            _appSettings = settings.Value;
            _logger = logger;
            _configuration = configuration;
            _tokenGenerator = tokenGenerator;
        }

        [Route("")]
        public IActionResult Index()
        {
            try
            {
                // TODO: make dashboard
                return View();
            }
            catch (Exception e)
            {
                _logger.LogError(e, e.Message);
                ViewBag.ErrorMessage = e.Message;
                return View("AdminError");
            }
        }

        [Route("manage")]
        public async Task<IActionResult> Manage()
        {
            try
            {
                using (var conn = DbConnection)
                {
                    // TODO: Paging
                    const string sql = @"SELECT 
                                         l.Id,
                                         l.OriginUrl,
                                         l.FwToken,
                                         l.Note,
                                         l.IsEnabled,
                                         l.UpdateTimeUtc
                                         FROM Link l 
                                         ORDER BY UpdateTimeUtc DESC";

                    var links = await conn.QueryAsync<Link>(sql);
                    return View(links);
                }
            }
            catch (Exception e)
            {
                _logger.LogError(e, e.Message);
                ViewBag.ErrorMessage = e.Message;
                return View("AdminError");
            }
        }
    }
}
