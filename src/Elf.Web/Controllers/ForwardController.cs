using System;
using System.Text.Json;
using System.Threading.Tasks;
using Elf.Services;
using Elf.Services.Entities;
using Elf.Services.Models;
using Elf.Services.TokenGenerator;
using Elf.Web.Filters;
using Elf.Web.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Primitives;
using Microsoft.FeatureManagement;

namespace Elf.Web.Controllers
{
    [ApiController]
    public class ForwardController : ControllerBase
    {
        private readonly AppSettings _appSettings;
        private readonly ILogger<ForwardController> _logger;
        private readonly ITokenGenerator _tokenGenerator;
        private readonly ILinkVerifier _linkVerifier;
        private readonly ILinkForwarderService _linkForwarderService;
        private readonly IMemoryCache _cache;
        private readonly IFeatureManager _featureManager;

        private StringValues UserAgent => Request.Headers["User-Agent"];

        public ForwardController(
            IOptions<AppSettings> settings,
            ILogger<ForwardController> logger,
            ILinkForwarderService linkForwarderService,
            ITokenGenerator tokenGenerator,
            IMemoryCache cache,
            ILinkVerifier linkVerifier,
            IFeatureManager featureManager)
        {
            _appSettings = settings.Value;
            _logger = logger;
            _linkForwarderService = linkForwarderService;
            _tokenGenerator = tokenGenerator;
            _cache = cache;
            _linkVerifier = linkVerifier;
            _featureManager = featureManager;
        }

        [AddForwarderHeader]
        [Route("/aka/{akaName:regex(^(?!-)([[a-zA-Z0-9-]]+)$)}")]
        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public async Task<IActionResult> Aka(string akaName)
        {
            if (string.IsNullOrWhiteSpace(akaName)) return BadRequest();

            var ip = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "N/A";
            if (string.IsNullOrWhiteSpace(UserAgent)) return BadRequest();

            var token = await _linkForwarderService.GetTokenByAkaNameAsync(akaName);

            // can not redirect to default url because it will confuse user that the aka points to that default url.
            if (token is null) return NotFound();

            // Do not use RedirectToAction() because another 302 will happen.
            return await PerformTokenRedirection(token, ip);
        }

        [AddForwarderHeader]
        [Route("/fw/{token}")]
        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public async Task<IActionResult> Forward(string token)
        {
            if (string.IsNullOrWhiteSpace(token)) return BadRequest();

            var ip = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "N/A";
            if (string.IsNullOrWhiteSpace(UserAgent)) return BadRequest();

            return await PerformTokenRedirection(token, ip);
        }

        private async Task<IActionResult> PerformTokenRedirection(string token, string ip)
        {
            bool isValid = _tokenGenerator.TryParseToken(token, out var validatedToken);
            if (!isValid) return BadRequest();

            if (!_cache.TryGetValue(token, out Link linkEntry))
            {
                var flag = await _featureManager.IsEnabledAsync(nameof(FeatureFlags.AllowSelfRedirection));
                var link = await _linkForwarderService.GetLinkAsync(validatedToken);
                if (link is null)
                {
                    if (string.IsNullOrWhiteSpace(_appSettings.DefaultRedirectionUrl)) return NotFound();

                    var result = _linkVerifier.Verify(_appSettings.DefaultRedirectionUrl, Url, Request, flag);
                    if (result == LinkVerifyResult.Valid) return Redirect(_appSettings.DefaultRedirectionUrl);

                    throw new UriFormatException("DefaultRedirectionUrl is not a valid URL.");
                }

                if (!link.IsEnabled) return BadRequest("This link is disabled.");

                var verifyOriginUrl = _linkVerifier.Verify(link.OriginUrl, Url, Request, flag);
                switch (verifyOriginUrl)
                {
                    case LinkVerifyResult.Valid:
                        // cache valid link entity only.
                        if (link.TTL is not null)
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

            linkEntry ??= _cache.Get<Link>(token);

            var honorDNTFlag = await _featureManager.IsEnabledAsync(nameof(FeatureFlags.HonorDNT));
            if (!honorDNTFlag) return Redirect(linkEntry.OriginUrl);

            // Check if browser sends "Do Not Track"
            var dntFlag = Request.Headers["DNT"];
            bool dnt = !string.IsNullOrWhiteSpace(dntFlag) && dntFlag == 1.ToString();
            if (dnt) return Redirect(linkEntry.OriginUrl);

            var req = new LinkTrackingRequest(ip, UserAgent, linkEntry.Id);
            await _linkForwarderService.TrackSucessRedirectionAsync(req);

            return Redirect(linkEntry.OriginUrl);
        }
    }
}