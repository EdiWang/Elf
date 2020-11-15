using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Elf.Services;
using Elf.Services.Entities;
using Elf.Services.Models;
using Elf.Web.Authentication;
using Elf.Web.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Elf.Web.Controllers
{
    [Authorize]
    [Route("admin")]
    public class AdminController : Controller
    {
        private readonly AppSettings _appSettings;
        private readonly AuthenticationSettings _authenticationSettings;
        private readonly ILogger<AdminController> _logger;
        private readonly ILinkForwarderService _linkForwarderService;
        private readonly ILinkVerifier _linkVerifier;
        private readonly IMemoryCache _cache;

        public AdminController(
            IOptions<AppSettings> settings,
            ILogger<AdminController> logger,
            ILinkForwarderService linkForwarderService,
            ILinkVerifier linkVerifier,
            IMemoryCache cache)
        {
            _appSettings = settings.Value;
            _logger = logger;
            _linkForwarderService = linkForwarderService;
            _linkVerifier = linkVerifier;
            _cache = cache;
            _authenticationSettings = AppDomain.CurrentDomain.GetData(nameof(AuthenticationSettings)) as AuthenticationSettings;
        }

        #region Authentication

        [HttpGet("signin")]
        [AllowAnonymous]
        public async Task<IActionResult> SignIn()
        {
            switch (_authenticationSettings.Provider)
            {
                case AuthenticationProvider.AzureAD:
                    {
                        var redirectUrl = Url.Action("Index", "Admin");
                        return Challenge(
                            new AuthenticationProperties { RedirectUri = redirectUrl },
                            OpenIdConnectDefaults.AuthenticationScheme);
                    }
                case AuthenticationProvider.Local:
                    await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
                    break;
                case AuthenticationProvider.None:
                    Response.StatusCode = StatusCodes.Status501NotImplemented;
                    return Content("No AuthenticationProvider is set, please check system settings.");
            }

            return View();
        }

        [HttpPost("signin")]
        [ValidateAntiForgeryToken]
        [AllowAnonymous]
        public async Task<IActionResult> SignIn(SignInViewModel model)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    if (model.Username == _authenticationSettings.Local.Username &&
                        model.Password == _authenticationSettings.Local.Password)
                    {
                        var claims = new List<Claim>
                        {
                            new(ClaimTypes.Name, model.Username),
                            new(ClaimTypes.Role, "Administrator")
                        };
                        var ci = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
                        var p = new ClaimsPrincipal(ci);
                        await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, p);
                        _logger.LogInformation($@"Authentication success for local account ""{model.Username}""");

                        return RedirectToAction("Index");
                    }
                    ModelState.AddModelError(string.Empty, "Invalid Login Attempt.");
                    return View(model);
                }

                _logger.LogWarning($@"Authentication failed for local account ""{model.Username}""");

                Response.StatusCode = StatusCodes.Status400BadRequest;
                ModelState.AddModelError(string.Empty, "Bad Request.");
                return View(model);
            }
            catch (Exception e)
            {
                _logger.LogWarning($@"Authentication failed for local account ""{model.Username}""");

                ModelState.AddModelError(string.Empty, e.Message);
                return View(model);
            }
        }

        [HttpGet("signout")]
        public async Task<IActionResult> SignOut(int nounce = 1055)
        {
            switch (_authenticationSettings.Provider)
            {
                case AuthenticationProvider.AzureAD:
                    {
                        var callbackUrl = Url.Action(nameof(SignedOut), "Admin", values: null, protocol: Request.Scheme);
                        return SignOut(
                            new AuthenticationProperties { RedirectUri = callbackUrl },
                            CookieAuthenticationDefaults.AuthenticationScheme,
                            OpenIdConnectDefaults.AuthenticationScheme);
                    }
                case AuthenticationProvider.Local:
                    await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
                    break;
                default:
                    throw new ArgumentOutOfRangeException();
            }

            return Redirect("/");
        }

        [HttpGet("signedout")]
        [AllowAnonymous]
        public IActionResult SignedOut()
        {
            return Redirect("/");
        }

        [AllowAnonymous]
        [HttpGet("accessdenied")]
        public IActionResult AccessDenied()
        {
            return StatusCode(StatusCodes.Status403Forbidden);
        }

        #endregion

        [Route("")]
        public IActionResult Index()
        {
            return View();
        }

        [Route("report")]
        public IActionResult Report()
        {
            return View();
        }

        [HttpPost]
        [Route("list")]
        public async Task<IActionResult> List(DataTableRequest model)
        {
            var searchBy = model.Search?.Value;
            var take = model.Length;
            var offset = model.Start;

            var links = await _linkForwarderService.GetPagedLinksAsync(offset, take, searchBy);
            var jqdtResponse = new JqDataTableResponse<Link>
            {
                Draw = model.Draw,
                RecordsFiltered = links.TotalRows,
                RecordsTotal = links.TotalRows,
                Data = links.Links
            };
            return Json(jqdtResponse);
        }

        [HttpPost]
        [Route("create")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(LinkEditModel model)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var verifyResult = _linkVerifier.Verify(model.OriginUrl, Url, Request, _appSettings.AllowSelfRedirection);
            switch (verifyResult)
            {
                case LinkVerifyResult.InvalidFormat:
                    return BadRequest("Not a valid URL.");
                case LinkVerifyResult.InvalidLocal:
                    return BadRequest("Can not use local URL.");
                case LinkVerifyResult.InvalidSelfReference:
                    return BadRequest("Can not use url pointing to this site.");
            }

            var createLinkRequest = new CreateLinkRequest
            {
                OriginUrl = model.OriginUrl,
                Note = model.Note,
                AkaName = string.IsNullOrWhiteSpace(model.AkaName) ? null : model.AkaName,
                IsEnabled = model.IsEnabled,
                TTL = model.TTL
            };

            var response = await _linkForwarderService.CreateLinkAsync(createLinkRequest);
            return Json(response);
        }

        [Route("get-edit-model/{id}")]
        public async Task<IActionResult> GetEditModel(int id)
        {
            var link = await _linkForwarderService.GetLinkAsync(id);
            if (link is null) return NotFound();

            var model = new LinkEditModel
            {
                Id = link.Id,
                Note = link.Note,
                AkaName = link.AkaName,
                OriginUrl = link.OriginUrl,
                IsEnabled = link.IsEnabled,
                TTL = link.TTL ?? 0
            };

            return Json(model);
        }

        [HttpPost("edit")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(LinkEditModel model)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var verifyResult = _linkVerifier.Verify(model.OriginUrl, Url, Request, _appSettings.AllowSelfRedirection);
            switch (verifyResult)
            {
                case LinkVerifyResult.InvalidFormat:
                    return BadRequest("Not a valid URL.");
                case LinkVerifyResult.InvalidLocal:
                    return BadRequest("Can not use local URL.");
                case LinkVerifyResult.InvalidSelfReference:
                    return BadRequest("Can not use url pointing to this site.");
            }

            var editRequest = new EditLinkRequest(model.Id)
            {
                NewUrl = model.OriginUrl,
                Note = model.Note,
                AkaName = string.IsNullOrWhiteSpace(model.AkaName) ? null : model.AkaName,
                IsEnabled = model.IsEnabled,
                TTL = model.TTL
            };

            var token = await _linkForwarderService.EditLinkAsync(editRequest);
            if (token is not null) _cache.Remove(token);
            return Json(token);
        }

        [Route("delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteLink(int linkId)
        {
            var link = await _linkForwarderService.GetLinkAsync(linkId);
            if (link is null) return BadRequest();

            await _linkForwarderService.DeleteLink(linkId);

            _cache.Remove(link);
            return Content(linkId.ToString());
        }
    }
}
