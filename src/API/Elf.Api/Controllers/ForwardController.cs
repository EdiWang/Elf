using Elf.Api.Features;
using Elf.Api.Filters;
using Elf.Api.TokenGenerator;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Primitives;
using Microsoft.FeatureManagement;
using System.Text.Json;

namespace Elf.Api.Controllers;

[ApiController]
[EnableRateLimiting("fixed-ip")]
public class ForwardController : ControllerBase
{
    private readonly ILogger<ForwardController> _logger;
    private readonly IConfiguration _configuration;
    private readonly ITokenGenerator _tokenGenerator;
    private readonly ILinkVerifier _linkVerifier;
    private readonly IDistributedCache _cache;
    private readonly IFeatureManager _featureManager;
    private readonly IMediator _mediator;
    private readonly IIPLocationService _ipLocationService;
    private readonly CannonService _cannonService;

    private StringValues UserAgent => Request.Headers["User-Agent"];

    public ForwardController(
        ILogger<ForwardController> logger,
        IConfiguration configuration,
        ITokenGenerator tokenGenerator,
        IDistributedCache cache,
        ILinkVerifier linkVerifier,
        IFeatureManager featureManager,
        IMediator mediator,
        IIPLocationService ipLocationService,
        CannonService cannonService)
    {
        _logger = logger;
        _configuration = configuration;
        _tokenGenerator = tokenGenerator;
        _cache = cache;
        _linkVerifier = linkVerifier;
        _featureManager = featureManager;
        _mediator = mediator;
        _ipLocationService = ipLocationService;
        _cannonService = cannonService;
    }

    [AddForwarderHeader]
    [HttpGet("/aka/{akaName:regex(^(?!-)([[a-zA-Z0-9-]]+)$)}")]
    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public async Task<IActionResult> Aka(string akaName)
    {
        if (string.IsNullOrWhiteSpace(akaName)) return BadRequest();

        var ip = Utils.GetClientIP(HttpContext) ?? "N/A";
        if (string.IsNullOrWhiteSpace(UserAgent)) return BadRequest();

        var token = await _mediator.Send(new GetTokenByAkaNameQuery(akaName));

        // can not redirect to default url because it will confuse user that the aka points to that default url.
        if (token is null) return NotFound();

        // Do not use RedirectToAction() because another 302 will happen.
        return await PerformTokenRedirection(token, ip);
    }

    [AddForwarderHeader]
    [HttpGet("/fw/{token}")]
    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public async Task<IActionResult> Forward(string token)
    {
        if (string.IsNullOrWhiteSpace(token)) return BadRequest();

        var ip = Utils.GetClientIP(HttpContext) ?? "N/A";
        if (string.IsNullOrWhiteSpace(UserAgent)) return BadRequest();

        return await PerformTokenRedirection(token, ip);
    }

    private async Task<IActionResult> PerformTokenRedirection(string token, string ip)
    {
        var isValid = _tokenGenerator.TryParseToken(token, out var validatedToken);
        if (!isValid) return BadRequest();

        var linkEntry = await _cache.GetLink(token);
        if (null == linkEntry)
        {
            var flag = await _featureManager.IsEnabledAsync(nameof(FeatureFlags.AllowSelfRedirection));
            var link = await _mediator.Send(new GetLinkByTokenQuery(validatedToken));
            if (link is null)
            {
                var dru = _configuration["DefaultRedirectionUrl"];
                if (string.IsNullOrWhiteSpace(dru)) return NotFound();

                var result = _linkVerifier.Verify(dru, Url, Request, flag);
                if (result == LinkVerifyResult.Valid) return Redirect(dru);

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
                        await _cache.SetLink(token, link, TimeSpan.FromSeconds(link.TTL.GetValueOrDefault()));
                    }
                    else
                    {
                        await _cache.SetLink(token, link);
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

        linkEntry ??= await _cache.GetLink(token);

        if (await _featureManager.IsEnabledAsync(nameof(FeatureFlags.EnableTracking)))
        {
            Response.Headers.Add("X-Elf-Tracking-For", ip);
            var ua = UserAgent;

            _cannonService.Fire(async (IMediator mediator) =>
            {
                IPLocation location;
                try
                {
                    location = await _ipLocationService.GetLocationAsync(ip, ua);
                }
                catch (Exception)
                {
                    location = null;
                }

                var req = new LinkTrackingRequest(ip, ua, linkEntry.Id);
                await mediator.Send(new TrackSucessRedirectionCommand(req, location));
            });
        }

        return Redirect(linkEntry.OriginUrl);
    }
}