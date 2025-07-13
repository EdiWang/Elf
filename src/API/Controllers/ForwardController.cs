using Elf.Api.Features;
using Elf.Api.Filters;
using Elf.Api.TokenGenerator;
using LiteBus.Queries.Abstractions;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Primitives;
using Microsoft.FeatureManagement;
using System.Text.Json;

namespace Elf.Api.Controllers;

[ApiController]
[EnableRateLimiting("fixed-ip")]
public class ForwardController(
        ILogger<ForwardController> logger,
        IConfiguration configuration,
        ITokenGenerator tokenGenerator,
        IDistributedCache cache,
        ILinkVerifier linkVerifier,
        IFeatureManager featureManager,
        IMediator mediator,
        IQueryMediator queryMediator,
        IIPLocationService ipLocationService,
        CannonService cannonService) : ControllerBase
{
    private StringValues UserAgent => Request.Headers["User-Agent"];

    [AddForwarderHeader]
    [HttpGet("/aka/{akaName:regex(^(?!-)([[a-zA-Z0-9-]]+)$)}")]
    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public async Task<IActionResult> Aka(string akaName)
    {
        if (string.IsNullOrWhiteSpace(akaName)) return BadRequest();

        var ip = Utils.GetClientIP(HttpContext) ?? "N/A";
        if (string.IsNullOrWhiteSpace(UserAgent)) return BadRequest();

        var token = await queryMediator.QueryAsync(new GetTokenByAkaNameQuery(akaName));

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
        var isValid = tokenGenerator.TryParseToken(token, out var validatedToken);
        if (!isValid) return BadRequest();

        var linkEntry = await cache.GetLink(token);
        if (null == linkEntry)
        {
            var flag = await featureManager.IsEnabledAsync(nameof(FeatureFlags.AllowSelfRedirection));
            var link = await mediator.Send(new GetLinkByTokenQuery(validatedToken));

            if (link is null) return TryDefaultRedirect(flag);
            if (!link.IsEnabled) return BadRequest("This link is disabled.");

            var verifyOriginUrl = linkVerifier.Verify(link.OriginUrl, Url, Request, flag);
            switch (verifyOriginUrl)
            {
                case LinkVerifyResult.Valid:
                    // cache valid link entity only.
                    if (link.TTL is not null)
                    {
                        await cache.SetLink(token, link, TimeSpan.FromSeconds(link.TTL.GetValueOrDefault()));
                    }
                    else
                    {
                        await cache.SetLink(token, link);
                    }
                    break;
                case LinkVerifyResult.InvalidFormat:
                    throw new UriFormatException(
                        $"OriginUrl '{link.OriginUrl}' is not a valid URL, link ID: {link.Id}.");
                case LinkVerifyResult.InvalidLocal:
                    logger.LogWarning($"Local redirection is blocked. link: {JsonSerializer.Serialize(link)}");
                    return BadRequest("Local redirection is blocked");
                case LinkVerifyResult.InvalidSelfReference:
                    logger.LogWarning(
                        $"Self reference redirection is blocked. link: {JsonSerializer.Serialize(link)}");
                    return BadRequest("Self reference redirection is blocked");
                default:
                    throw new ArgumentOutOfRangeException();
            }
        }

        linkEntry ??= await cache.GetLink(token);

        if (await featureManager.IsEnabledAsync(nameof(FeatureFlags.EnableTracking)))
        {
            TrackLinkRequest(ip, linkEntry.Id);
        }

        return Redirect(linkEntry.OriginUrl);
    }

    private IActionResult TryDefaultRedirect(bool flag)
    {
        var dru = configuration["DefaultRedirectionUrl"];
        if (string.IsNullOrWhiteSpace(dru)) return NotFound();

        var result = linkVerifier.Verify(dru, Url, Request, flag);
        if (result == LinkVerifyResult.Valid) return Redirect(dru);

        throw new UriFormatException("DefaultRedirectionUrl is not a valid URL.");
    }

    private void TrackLinkRequest(string ip, int id)
    {
        Response.Headers.Append("X-Elf-Tracking-For", ip);
        var ua = UserAgent;

        cannonService.Fire(async (IMediator mediator2) =>
        {
            IPLocation location;
            try
            {
                location = await ipLocationService.GetLocationAsync(ip, ua);
            }
            catch (Exception)
            {
                location = null;
            }

            var req = new LinkTrackingRequest(ip, ua, id);
            await mediator2.Send(new TrackSucessRedirectionCommand(req, location));
        });
    }
}