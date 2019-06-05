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
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;

namespace LinkForwarder.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly ITokenGenerator _tokenGenerator;
        private readonly AppSettings _appSettings;
        private readonly ILinkForwarderService _linkForwarderService;

        public HomeController(
            IOptions<AppSettings> settings,
            ILogger<HomeController> logger,
            ITokenGenerator tokenGenerator,
            ILinkForwarderService linkForwarderService)
        {
            _appSettings = settings.Value;
            _logger = logger;
            _tokenGenerator = tokenGenerator;
            _linkForwarderService = linkForwarderService;
        }

        public async Task<IActionResult> Index()
        {
            var countResponse = await _linkForwarderService.CountLinksAsync();
            if (countResponse.IsSuccess)
            {
                var obj = new
                {
                    Server = Environment.MachineName,
                    Product = $"Link Forwarder Build {Utils.AppVersion}",
                    LinkCount = countResponse.Item
                };
                return Json(obj);
            }

            return new StatusCodeResult(StatusCodes.Status500InternalServerError);
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
                    var response = await _linkForwarderService.GetLinkAsync(validatedToken);
                    if (response.IsSuccess)
                    {
                        var link = response.Item;
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

                        if (Uri.TryCreate(link.OriginUrl, UriKind.Absolute, out Uri testUri))
                        {
                            if (string.Compare(testUri.Authority, HttpContext.Request.Host.ToString(), StringComparison.OrdinalIgnoreCase) == 0
                                && string.Compare(testUri.Scheme, HttpContext.Request.Scheme, StringComparison.OrdinalIgnoreCase) == 0)
                            {
                                _logger.LogWarning($"Self reference redirection is blocked. link: {JsonConvert.SerializeObject(link)}");
                                return Forbid();
                            }
                        }

                        // cache valid link entity only.
                        cache.Set(token, link, TimeSpan.FromHours(1));
                    }
                    else
                    {
                        return new StatusCodeResult(StatusCodes.Status500InternalServerError);
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
                    await _linkForwarderService.TrackSucessRedirectionAsync(ip, ua, linkEntry.Id);
                });

                return Redirect(linkEntry.OriginUrl);
            }
            catch (Exception e)
            {
                _logger.LogError(e, e.Message);
                return new StatusCodeResult(StatusCodes.Status500InternalServerError);
            }
        }
    }
}
