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
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;

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
        private readonly IMemoryCache _memoryCache;
        private readonly ILinkForwarderService _linkForwarderService;

        private IDbConnection DbConnection => new SqlConnection(_configuration.GetConnectionString(Constants.DbName));

        public AdminController(
            IOptions<AppSettings> settings,
            ILogger<AdminController> logger,
            IConfiguration configuration,
            ITokenGenerator tokenGenerator,
            IMemoryCache memoryCache,
            ILinkForwarderService linkForwarderService)
        {
            _appSettings = settings.Value;
            _logger = logger;
            _configuration = configuration;
            _tokenGenerator = tokenGenerator;
            _memoryCache = memoryCache;
            _linkForwarderService = linkForwarderService;
        }

        [Route("")]
        public IActionResult Index()
        {
            // TODO: make dashboard
            return View();
        }

        [Route("recent-requests")]
        public async Task<IActionResult> RecentRequests()
        {
            var response = await _linkForwarderService.GetRecentRequestsAsync(20);
            return Json(response);
        }

        [Route("manage")]
        public async Task<IActionResult> Manage()
        {
            var response = await _linkForwarderService.GetPagedLinksAsync(0, 0, 0);
            if (response.IsSuccess)
            {
                return View(response.Item);
            }
            ViewBag.ErrorMessage = response.Message;
            Response.StatusCode = StatusCodes.Status500InternalServerError;
            return View("AdminError");
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
                    return View(model);
                }

                if (Url.IsLocalUrl(model.OriginUrl))
                {
                    ModelState.AddModelError(nameof(model.OriginUrl), "Can not use local URL.");
                    return View(model);
                }

                if (Uri.TryCreate(model.OriginUrl, UriKind.Absolute, out Uri testUri))
                {
                    if (string.Compare(testUri.Authority, HttpContext.Request.Host.ToString(), StringComparison.OrdinalIgnoreCase) == 0
                        && string.Compare(testUri.Scheme, HttpContext.Request.Scheme, StringComparison.OrdinalIgnoreCase) == 0)
                    {
                        ModelState.AddModelError(nameof(model.OriginUrl), "Can not use url pointing to this site.");
                        return View(model);
                    }
                }

                string token;
                using (var conn = DbConnection)
                {
                    const string sqlLinkExist = "SELECT TOP 1 FwToken FROM Link l WHERE l.OriginUrl = @originUrl";
                    var tempToken = await conn.ExecuteScalarAsync<string>(sqlLinkExist, new { originUrl = model.OriginUrl });
                    if (null != tempToken)
                    {
                        if (_tokenGenerator.TryParseToken(tempToken, out var tk))
                        {
                            _logger.LogInformation($"Link already exists for token '{tk}'");
                            return RedirectToAction("ShowLink", new { token = tk });
                        }

                        string message = $"Invalid token '{tempToken}' found for existing url '{model.OriginUrl}'";
                        _logger.LogError(message);
                        ModelState.AddModelError(string.Empty, message);
                        return View(model);
                    }

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

                return RedirectToAction("ShowLink", new { token });
            }
            return View(model);
        }

        [Route("show-link/{token}")]
        public async Task<IActionResult> ShowLink(string token)
        {
            var response = await _linkForwarderService.IsLinkExistsAsync(token);
            if (response.IsSuccess)
            {
                if (response.Item)
                {
                    return View(new ShowLinkViewModel { Token = token });
                }
                return NotFound();
            }

            ViewBag.ErrorMessage = response.Message;
            Response.StatusCode = StatusCodes.Status500InternalServerError;
            return View("AdminError");
        }
    }
}
