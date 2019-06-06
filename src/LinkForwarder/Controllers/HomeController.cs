using System;
using System.Threading.Tasks;
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
        private readonly ILinkVerifier _linkVerifier;

        public HomeController(
            IOptions<AppSettings> settings,
            ILogger<HomeController> logger,
            ITokenGenerator tokenGenerator,
            ILinkForwarderService linkForwarderService,
            ILinkVerifier linkVerifier)
        {
            _appSettings = settings.Value;
            _logger = logger;
            _tokenGenerator = tokenGenerator;
            _linkForwarderService = linkForwarderService;
            _linkVerifier = linkVerifier;
        }

        public IActionResult Index()
        {
            return View();
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

                            var verifyDefaultRedirectionUrl = _linkVerifier.Verify(_appSettings.DefaultRedirectionUrl, Url, Request);
                            if (verifyDefaultRedirectionUrl == LinkVerifyResult.Valid)
                            {
                                return Redirect(_appSettings.DefaultRedirectionUrl);
                            }

                            throw new UriFormatException("DefaultRedirectionUrl is not a valid URL.");
                        }

                        if (!link.IsEnabled)
                        {
                            return Forbid();
                        }

                        var verifyOriginUrl = _linkVerifier.Verify(link.OriginUrl, Url, Request);
                        switch (verifyOriginUrl)
                        {
                            case LinkVerifyResult.Valid:
                                // cache valid link entity only.
                                cache.Set(token, link, TimeSpan.FromHours(1));
                                break;
                            case LinkVerifyResult.InvalidFormat:
                                throw new UriFormatException(
                                    $"OriginUrl '{link.OriginUrl}' is not a valid URL, link ID: {link.Id}.");
                            case LinkVerifyResult.InvalidLocal:
                                _logger.LogWarning($"Local redirection is blocked. link: {JsonConvert.SerializeObject(link)}");
                                return BadRequest("Local redirection is blocked");
                            case LinkVerifyResult.InvalidSelfReference:
                                _logger.LogWarning($"Self reference redirection is blocked. link: {JsonConvert.SerializeObject(link)}");
                                return BadRequest("Self reference redirection is blocked");
                            default:
                                throw new ArgumentOutOfRangeException();
                        }
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
