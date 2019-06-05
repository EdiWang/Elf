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

        [Route("create-link")]
        public IActionResult CreateLink()
        {
            return View();
        }

        [HttpPost]
        [Route("create-link")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> CreateLink(LinkEditModel model)
        {
            if (ModelState.IsValid)
            {
                if (!model.OriginUrl.IsValidUrl())
                {
                    ModelState.AddModelError(nameof(model.OriginUrl), "Not a valid URL.");
                }

                if (Url.IsLocalUrl(model.OriginUrl))
                {
                    ModelState.AddModelError(nameof(model.OriginUrl), "Can not use local URL.");
                }

                string token;
                using (var conn = DbConnection)
                {
                    const string sqlTokenExist = "SELECT TOP 1 1 FROM Link l WHERE l.FwToken = @token";
                    do
                    {
                        token = _tokenGenerator.GenerateToken();
                    } while (await conn.ExecuteScalarAsync<int>(sqlTokenExist, new { token }) == 1);

                    _logger.LogInformation($"Generated Token '{token}' for url '{model.OriginUrl}'");

                    var link = new Link
                    {
                        FwToken = token,
                        IsEnabled = model.IsEnabled,
                        Note = model.Note,
                        OriginUrl = model.OriginUrl,
                        UpdateTimeUtc = DateTime.UtcNow
                    };
                    const string sqlInsertLk = @"INSERT INTO Link (OriginUrl, FwToken, Note, IsEnabled, UpdateTimeUtc) 
                                                 VALUES (@OriginUrl, @FwToken, @Note, @IsEnabled, @UpdateTimeUtc)";
                    await conn.ExecuteAsync(sqlInsertLk, link);
                }

                return RedirectToAction("ShowLink", routeValues: token);
            }
            return View(model);
        }

        [Route("show-link")]
        public async Task<IActionResult> ShowLink(string token)
        {
            // TODO: Verify link against db first.
            return View(token);
        }
    }
}
