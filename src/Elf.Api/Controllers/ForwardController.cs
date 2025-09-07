using Elf.Api.Data;
using Elf.Api.Features;
using Elf.Api.Filters;
using Elf.Api.Services;
using Elf.Shared;
using Elf.Shared.Models;
using Elf.TokenGenerator;
using LiteBus.Commands.Abstractions;
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
        IQueryMediator queryMediator,
        IIPLocationService ipLocationService,
        CannonService cannonService) : ControllerBase
{
    private StringValues UserAgent => Request.Headers.UserAgent;

    [AddElfHeader]
    [HttpGet("/aka/{akaName:regex(^(?!-)([[a-zA-Z0-9-]]+)$)}")]
    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public async Task<IActionResult> Aka(string akaName)
    {
        var validationResult = ValidateRequest(akaName);
        if (validationResult != null) return validationResult;

        var token = await queryMediator.QueryAsync(new GetTokenByAkaNameQuery(akaName));
        if (token is null) return NotFound();

        var ip = ClientIPHelper.GetClientIP(HttpContext) ?? "N/A";
        return await PerformTokenRedirectionAsync(token, ip);
    }

    [AddElfHeader]
    [HttpGet("/fw/{token}")]
    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public async Task<IActionResult> Forward(string token)
    {
        var validationResult = ValidateRequest(token);
        if (validationResult != null) return validationResult;

        var ip = ClientIPHelper.GetClientIP(HttpContext) ?? "N/A";
        return await PerformTokenRedirectionAsync(token, ip);
    }

    private BadRequestObjectResult ValidateRequest(string identifier)
    {
        if (string.IsNullOrWhiteSpace(identifier))
            return BadRequest("Invalid identifier");

        if (string.IsNullOrWhiteSpace(UserAgent))
            return BadRequest("User agent is required");

        return null;
    }

    private async Task<IActionResult> PerformTokenRedirectionAsync(string token, string ip)
    {
        if (!tokenGenerator.TryParseToken(token, out var validatedToken))
        {
            return BadRequest("Invalid token format");
        }

        var linkEntry = await GetOrCacheLinkAsync(token, validatedToken);
        if (linkEntry is null)
        {
            return await HandleNotFoundLinkAsync();
        }

        await TrackLinkRequestIfEnabledAsync(ip, linkEntry.Id);
        return Redirect(linkEntry.OriginUrl);
    }

    private async Task<LinkEntity> GetOrCacheLinkAsync(string token, string validatedToken)
    {
        var linkEntry = await cache.GetLink(token);
        if (linkEntry != null) return linkEntry;

        var link = await queryMediator.QueryAsync(new GetLinkByTokenQuery(validatedToken));
        if (link is null) return null;

        if (!link.IsEnabled)
        {
            logger.LogWarning("Attempted to access disabled link with token: {Token}", token);
            return null;
        }

        var allowSelfRedirection = await featureManager.IsEnabledAsync(nameof(FeatureFlags.AllowSelfRedirection));
        var verificationResult = linkVerifier.Verify(link.OriginUrl, Url, Request, allowSelfRedirection);

        switch (verificationResult)
        {
            case LinkVerifyResult.Valid:
                await CacheLinkAsync(token, link);
                return link;

            case LinkVerifyResult.InvalidFormat:
                logger.LogError("Invalid URL format for link ID {LinkId}: {OriginUrl}", link.Id, link.OriginUrl);
                throw new UriFormatException($"OriginUrl '{link.OriginUrl}' is not a valid URL, link ID: {link.Id}");

            case LinkVerifyResult.InvalidLocal:
                logger.LogWarning("Local redirection blocked for link: {Link}", JsonSerializer.Serialize(link));
                return null;

            case LinkVerifyResult.InvalidSelfReference:
                logger.LogWarning("Self reference redirection blocked for link: {Link}", JsonSerializer.Serialize(link));
                return null;

            default:
                logger.LogError("Unexpected link verification result: {Result} for link ID: {LinkId}", verificationResult, link.Id);
                throw new ArgumentOutOfRangeException(nameof(verificationResult), verificationResult, "Unexpected verification result");
        }
    }

    private async Task CacheLinkAsync(string token, LinkEntity link)
    {
        var cacheExpiration = link.TTL.HasValue
            ? TimeSpan.FromSeconds(link.TTL.Value)
            : (TimeSpan?)null;

        await cache.SetLink(token, link, cacheExpiration);
    }

    private async Task<IActionResult> HandleNotFoundLinkAsync()
    {
        var defaultRedirectionUrl = configuration["DefaultRedirectionUrl"];
        if (string.IsNullOrWhiteSpace(defaultRedirectionUrl))
        {
            return NotFound();
        }

        var allowSelfRedirection = await featureManager.IsEnabledAsync(nameof(FeatureFlags.AllowSelfRedirection));
        var verificationResult = linkVerifier.Verify(defaultRedirectionUrl, Url, Request, allowSelfRedirection);

        return verificationResult == LinkVerifyResult.Valid
            ? Redirect(defaultRedirectionUrl)
            : throw new UriFormatException("DefaultRedirectionUrl is not a valid URL.");
    }

    private async Task TrackLinkRequestIfEnabledAsync(string ip, int linkId)
    {
        if (!await featureManager.IsEnabledAsync(nameof(FeatureFlags.EnableTracking)))
        {
            return;
        }

        Response.Headers.Append("X-Elf-Tracking-For", ip);
        var userAgent = UserAgent;

        cannonService.Fire(async (ICommandMediator commandMediator) =>
        {
            try
            {
                var location = await ipLocationService.GetLocationAsync(ip, userAgent);
                var request = new LinkTrackingRequest(ip, userAgent, linkId);
                await commandMediator.SendAsync(new TrackSucessRedirectionCommand(request, location));
            }
            catch (Exception ex)
            {
                logger.LogWarning(ex, "Failed to track link request for IP: {IP}, LinkId: {LinkId}", ip, linkId);

                // Send tracking without location data if location service fails
                var request = new LinkTrackingRequest(ip, userAgent, linkId);
                await commandMediator.SendAsync(new TrackSucessRedirectionCommand(request, null));
            }
        });
    }
}