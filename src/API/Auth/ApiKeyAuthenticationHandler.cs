using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Options;
using System.Security.Claims;
using System.Text.Encodings.Web;
using System.Text.Json;

namespace Elf.Api.Auth;

// Credits: https://josefottosson.se/asp-net-core-protect-your-api-with-api-keys/
public class ApiKeyAuthenticationHandler(IOptionsMonitor<ApiKeyAuthenticationOptions> options,
        ILoggerFactory logger,
        UrlEncoder encoder,
        IGetApiKeyQuery getApiKeyQuery,
        IConfiguration configuration)
    : AuthenticationHandler<ApiKeyAuthenticationOptions>(options, logger, encoder)
{
    private const string ProblemDetailsContentType = "application/problem+json";
    private const string ApiKeyHeaderName = "X-Api-Key";
    private readonly IGetApiKeyQuery _getApiKeyQuery = getApiKeyQuery ?? throw new ArgumentNullException(nameof(getApiKeyQuery));
    private readonly bool _isEnabled = bool.Parse(configuration["EnableApiKeyAuthentication"]!);
    private string _reason;

    protected override async Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        if (!_isEnabled) return AuthenticateResult.NoResult();
        if (!Request.Headers.TryGetValue(ApiKeyHeaderName, out var apiKeyHeaderValues))
        {
            return AuthenticateResult.NoResult();
        }

        var providedApiKey = apiKeyHeaderValues.FirstOrDefault();
        if (apiKeyHeaderValues.Count == 0 || string.IsNullOrWhiteSpace(providedApiKey))
        {
            return AuthenticateResult.NoResult();
        }

        if (providedApiKey == Guid.Empty.ToString())
        {
            _reason = "Default API key is not secure, please change a new key.";
            return await Task.FromResult(AuthenticateResult.Fail(_reason));
        }

        var existingApiKey = await _getApiKeyQuery.Execute(providedApiKey);
        if (null == existingApiKey)
        {
            _reason = "Invalid API Key.";
            return await Task.FromResult(AuthenticateResult.Fail(_reason));
        }

        var claims = new List<Claim>
        {
            new (ClaimTypes.Name, existingApiKey.Owner)
        };

        claims.AddRange(existingApiKey.Roles.Select(role => new Claim(ClaimTypes.Role, role)));

        var identity = new ClaimsIdentity(claims, Options.AuthenticationType);
        var identities = new List<ClaimsIdentity> { identity };
        var principal = new ClaimsPrincipal(identities);
        var ticket = new AuthenticationTicket(principal, ApiKeyAuthenticationOptions.Scheme);

        return await Task.FromResult(AuthenticateResult.Success(ticket));
    }

    protected override async Task HandleChallengeAsync(AuthenticationProperties properties)
    {
        Response.StatusCode = 401;
        Response.ContentType = ProblemDetailsContentType;
        var problemDetails = new UnauthorizedProblemDetails(_reason);

        await Response.WriteAsync(JsonSerializer.Serialize(problemDetails));
    }

    protected override async Task HandleForbiddenAsync(AuthenticationProperties properties)
    {
        Response.StatusCode = 403;
        Response.ContentType = ProblemDetailsContentType;
        var problemDetails = new ForbiddenProblemDetails();

        await Response.WriteAsync(JsonSerializer.Serialize(problemDetails));
    }
}

internal class UnauthorizedProblemDetails
{
    public string Error { get; set; } = "Invalid API Key";

    public UnauthorizedProblemDetails(string reason)
    {
        if (!string.IsNullOrWhiteSpace(reason))
        {
            Error = reason;
        }
    }
}

internal class ForbiddenProblemDetails
{
    public string Error => "Invalid API Key Permission";
}