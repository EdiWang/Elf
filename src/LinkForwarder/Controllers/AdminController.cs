using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using LinkForwarder.Authentication;
using LinkForwarder.Models;
using LinkForwarder.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace LinkForwarder.Controllers
{
    [Authorize]
    [Route("admin")]
    public class AdminController : Controller
    {
        private readonly AuthenticationSettings _authenticationSettings;

        private readonly ILogger<AdminController> _logger;
        private readonly AppSettings _appSettings;
        private readonly IMemoryCache _memoryCache;
        private readonly ILinkForwarderService _linkForwarderService;
        private readonly ILinkVerifier _linkVerifier;

        public AdminController(
            IOptions<AppSettings> settings,
            ILogger<AdminController> logger,
            IMemoryCache memoryCache,
            ILinkForwarderService linkForwarderService,
            ILinkVerifier linkVerifier)
        {
            _appSettings = settings.Value;
            _logger = logger;
            _memoryCache = memoryCache;
            _linkForwarderService = linkForwarderService;
            _linkVerifier = linkVerifier;

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
                        var redirectUrl = Url.Action(nameof(HomeController.Index), "Home");
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
                            new Claim(ClaimTypes.Name, model.Username),
                            new Claim(ClaimTypes.Role, "Administrator")
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
        public async Task<IActionResult> SignOut()
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
            }

            return RedirectToAction("Index", "Home");
        }

        [HttpGet("signedout")]
        [AllowAnonymous]
        public IActionResult SignedOut()
        {
            return RedirectToAction(nameof(HomeController.Index), "Home");
        }

        [AllowAnonymous]
        [HttpGet("accessdenied")]
        public IActionResult AccessDenied()
        {
            HttpContext.Response.StatusCode = StatusCodes.Status403Forbidden;
            return View();
        }

        #endregion

        [Route("")]
        public async Task<IActionResult> Index()
        {
            var countResponse = await _linkForwarderService.CountLinksAsync();
            ViewBag.LinkCount = countResponse.Item;

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
                var verifyResult = _linkVerifier.Verify(model.OriginUrl, Url, Request);
                switch (verifyResult)
                {
                    case LinkVerifyResult.InvalidFormat:
                        ModelState.AddModelError(nameof(model.OriginUrl), "Not a valid URL.");
                        return View(model);
                    case LinkVerifyResult.InvalidLocal:
                        ModelState.AddModelError(nameof(model.OriginUrl), "Can not use local URL.");
                        return View(model);
                    case LinkVerifyResult.InvalidSelfReference:
                        ModelState.AddModelError(nameof(model.OriginUrl), "Can not use url pointing to this site.");
                        return View(model);
                }

                var response = await _linkForwarderService.CreateLinkAsync(model.OriginUrl, model.Note, model.IsEnabled);
                if (response.IsSuccess)
                {
                    return RedirectToAction("ShowLink", new { token = response.Item });
                }

                ViewBag.ErrorMessage = response.Message;
                Response.StatusCode = StatusCodes.Status500InternalServerError;
                return View("AdminError");
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

        [Route("delete")]
        public async Task<IActionResult> DeleteLink(int linkId)
        {
            var response = await _linkForwarderService.DeleteLink(linkId);
            return Json(response);
        }
    }
}
