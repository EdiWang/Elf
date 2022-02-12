using Elf.MultiTenancy;
using Elf.Services;
using Elf.Services.Models;
using Elf.Services.TokenGenerator;
using Elf.Web.Filters;
using Elf.Web.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Primitives;
using Microsoft.FeatureManagement;
using System.Text.Json;

namespace Elf.Web.Controllers;

[ApiController]
public class ForwardController : ControllerBase
{
    private readonly ILogger<ForwardController> _logger;
    private readonly ITokenGenerator _tokenGenerator;
    private readonly ILinkVerifier _linkVerifier;
    private readonly ILinkForwarderService _linkForwarderService;
    private readonly IDistributedCache _cache;
    private readonly IFeatureManager _featureManager;

    private StringValues UserAgent => Request.Headers["User-Agent"];
    private readonly Tenant _tenant;

    public ForwardController(
        ITenantAccessor<Tenant> tenantAccessor,
        ILogger<ForwardController> logger,
        ILinkForwarderService linkForwarderService,
        ITokenGenerator tokenGenerator,
        IDistributedCache cache,
        ILinkVerifier linkVerifier,
        IFeatureManager featureManager)
    {
        _logger = logger;
        _linkForwarderService = linkForwarderService;
        _tokenGenerator = tokenGenerator;
        _cache = cache;
        _linkVerifier = linkVerifier;
        _featureManager = featureManager;

        _tenant = tenantAccessor.Tenant;
    }

    [AddForwarderHeader]
    [Route("/aka/{akaName:regex(^(?!-)([[a-zA-Z0-9-]]+)$)}")]
    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public async Task<IActionResult> Aka(string akaName)
    {
        if (string.IsNullOrWhiteSpace(akaName)) return BadRequest();

        var ip = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "N/A";
        if (string.IsNullOrWhiteSpace(UserAgent)) return BadRequest();

        var token = await _linkForwarderService.GetTokenByAkaNameAsync(_tenant.Id, akaName);

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
        var isValid = _tokenGenerator.TryParseToken(token, out var validatedToken);
        if (!isValid) return BadRequest();

        var linkEntry = await _cache.GetLink(token);
        if (null == linkEntry)
        {
            var flag = await _featureManager.IsEnabledAsync(nameof(FeatureFlags.AllowSelfRedirection));
            var link = await _linkForwarderService.GetLinkAsync(_tenant.Id, validatedToken);
            if (link is null)
            {
                if (string.IsNullOrWhiteSpace(_tenant.Items["DefaultRedirectionUrl"])) return NotFound();

                var result = _linkVerifier.Verify(_tenant.Items["DefaultRedirectionUrl"], Url, Request, flag);
                if (result == LinkVerifyResult.Valid) return Redirect(_tenant.Items["DefaultRedirectionUrl"]);

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

        var honorDNTFlag = await _featureManager.IsEnabledAsync(nameof(FeatureFlags.HonorDNT));
        if (!honorDNTFlag) return Redirect(linkEntry.OriginUrl);

        // Check if browser sends "Do Not Track"
        var dntFlag = Request.Headers["DNT"];
        var dnt = !string.IsNullOrWhiteSpace(dntFlag) && dntFlag == "1";
        if (dnt) return Redirect(linkEntry.OriginUrl);

        try
        {
            var req = new LinkTrackingRequest(ip, UserAgent, linkEntry.Id);
            await _linkForwarderService.TrackSucessRedirectionAsync(req);
        }
        catch (Exception e)
        {
            // Eat exception, pretend everything is fine
            // Do not block workflow here
            _logger.LogError(e.Message, e);
        }

        return Redirect(linkEntry.OriginUrl);
    }
}