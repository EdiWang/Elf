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
        private readonly ILinkForwarderService _linkForwarderService;

        public AdminController(
            IOptions<AppSettings> settings,
            ILogger<AdminController> logger,
            ILinkForwarderService linkForwarderService)
        {
            _appSettings = settings.Value;
            _logger = logger;
            _linkForwarderService = linkForwarderService;

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
    }
}
