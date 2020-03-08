using System;
using System.Text.Json;
using System.Threading.Tasks;
using Elf.Services;
using Elf.Services.Entities;
using Elf.Services.Models;
using Elf.Services.TokenGenerator;
using Elf.Web.Filters;
using Elf.Web.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Primitives;

namespace Elf.Web.Controllers
{
    public class ForwardController : Controller
    {
        private readonly AppSettings _appSettings;
        private readonly ILogger<ForwardController> _logger;
        private readonly ITokenGenerator _tokenGenerator;
        private readonly ILinkVerifier _linkVerifier;
        private readonly ILinkForwarderService _linkForwarderService;
        private readonly IMemoryCache _cache;

        public ForwardController(
            IOptions<AppSettings> settings,
            ILogger<ForwardController> logger,
            ILinkForwarderService linkForwarderService,
            ITokenGenerator tokenGenerator,
            IMemoryCache cache,
            ILinkVerifier linkVerifier)
        {
            _appSettings = settings.Value;
            _logger = logger;
            _linkForwarderService = linkForwarderService;
            _tokenGenerator = tokenGenerator;
            _cache = cache;
            _linkVerifier = linkVerifier;
        }

        [AddForwarderHeader]
        [Route("/aka/{akaName:regex(^(?!-)([[a-zA-Z0-9-]]+)$)}")]
        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public async Task<IActionResult> Aka(string akaName)
        {
            bool ValidateAkaName(string name)
            {
                return !string.IsNullOrWhiteSpace(name);
            }

            try
            {
                if (!ValidateAkaName(akaName))
                {
                    return BadRequest();
                }

                var ip = HttpContext.Connection.RemoteIpAddress.ToString();
                var ua = Request.Headers["User-Agent"];
                if (string.IsNullOrWhiteSpace(ua))
                {
                    _logger.LogWarning($"'{ip}' requested akaName '{akaName}' without User Agent. Request is blocked.");
                    return BadRequest();
                }

                var tokenResponse = await _linkForwarderService.GetTokenByAkaNameAsync(akaName);
                if (tokenResponse.IsSuccess)
                {
                    if (tokenResponse.Item == null)
                    {
                        // can not redirect to default url because it will confuse user that the aka points to that default url.
                        return NotFound();
                    }

                    // Do not use RedirectToAction() because another 302 will happen.
                    return await PerformTokenRedirection(tokenResponse.Item, ip, ua);
                }
                return new StatusCodeResult(StatusCodes.Status500InternalServerError);
            }
            catch (Exception e)
            {
                _logger.LogError(e, e.Message);
                return new StatusCodeResult(StatusCodes.Status500InternalServerError);
            }
        }

        [AddForwarderHeader]
        [Route("/fw/{token}")]
        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public async Task<IActionResult> Forward(string token)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(token))
                {
                    return BadRequest();
                }

                var ip = HttpContext.Connection.RemoteIpAddress.ToString();
                var ua = Request.Headers["User-Agent"];
                if (string.IsNullOrWhiteSpace(ua))
                {
                    _logger.LogWarning($"'{ip}' requested token '{token}' without User Agent. Request is blocked.");
                    return BadRequest();
                }

                return await PerformTokenRedirection(token, ip, ua);
            }
            catch (Exception e)
            {
                _logger.LogError(e, e.Message);
                return new StatusCodeResult(StatusCodes.Status500InternalServerError);
            }
        }

        private async Task<IActionResult> PerformTokenRedirection(string token, string ip, StringValues ua)
        {
            bool isValid = _tokenGenerator.TryParseToken(token, out var validatedToken);
            if (!isValid)
            {
                _logger.LogWarning($"'{ip}' requested invalid token '{token}'. Request is blocked.");
                return BadRequest();
            }

            if (!_cache.TryGetValue(token, out Link linkEntry))
            {
                var response = await _linkForwarderService.GetLinkAsync(validatedToken);
                if (response.IsSuccess)
                {
                    var link = response.Item;
                    if (null == link)
                    {
                        if (string.IsNullOrWhiteSpace(_appSettings.DefaultRedirectionUrl)) return NotFound();

                        var verifyDefaultRedirectionUrl =
                            _linkVerifier.Verify(_appSettings.DefaultRedirectionUrl, Url, Request);
                        if (verifyDefaultRedirectionUrl == LinkVerifyResult.Valid)
                        {
                            return Redirect(_appSettings.DefaultRedirectionUrl);
                        }

                        throw new UriFormatException("DefaultRedirectionUrl is not a valid URL.");
                    }

                    if (!link.IsEnabled)
                    {
                        return BadRequest("This link is disabled.");
                    }

                    var verifyOriginUrl = _linkVerifier.Verify(link.OriginUrl, Url, Request);
                    switch (verifyOriginUrl)
                    {
                        case LinkVerifyResult.Valid:
                            // cache valid link entity only.
                            if (null != link.TTL)
                            {
                                _cache.Set(token, link, TimeSpan.FromSeconds(link.TTL.GetValueOrDefault()));
                            }
                            break;
                        case LinkVerifyResult.InvalidFormat:
                            throw new UriFormatException(
                                $"OriginUrl '{link.OriginUrl}' is not a valid URL, link ID: {link.Id}.");
                        case LinkVerifyResult.InvalidLocal:
                            _logger.LogWarning($"Local redirection is blocked. link: {JsonSerializer.Serialize(link)}");
                            return BadRequest("Local redirection is blocked");
                        case LinkVerifyResult.InvalidSelfReference:
                            _logger.LogWarning(
                                $"Self reference redirection is blocked. link: {JsonSerializer.Serialize(link)}");
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
                linkEntry = _cache.Get<Link>(token);
            }

            if (_appSettings.HonorDNT)
            {
                // Check if browser sends "Do Not Track"
                var dntFlag = Request.Headers["DNT"];
                bool dnt = !string.IsNullOrWhiteSpace(dntFlag) && dntFlag == 1.ToString();

                if (!dnt)
                {
                    _ = Task.Run(async () =>
                    {
                        await _linkForwarderService.TrackSucessRedirectionAsync(
                            new LinkTrackingRequest(ip, ua, linkEntry.Id));
                    });
                }
            }

            return Redirect(linkEntry.OriginUrl);
        }
    }
}