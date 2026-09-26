using Elf.App.Auth;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using System.Security.Claims;

namespace Elf.App.Tests;

public class ElfAdminAuthenticationRegistrationTests
{
    [Fact]
    public async Task AddElfAdminAuthentication_WhenProviderIsLocal_RegistersCookieSchemesAndLocalServices()
    {
        using var serviceProvider = BuildServiceProvider(new Dictionary<string, string>
        {
            ["Authentication:Provider"] = "Local"
        });

        var authenticationOptions = serviceProvider.GetRequiredService<IOptions<AuthenticationOptions>>().Value;
        Assert.Equal(CookieAuthenticationDefaults.AuthenticationScheme, authenticationOptions.DefaultScheme);

        var schemeProvider = serviceProvider.GetRequiredService<IAuthenticationSchemeProvider>();
        Assert.NotNull(await schemeProvider.GetSchemeAsync(CookieAuthenticationDefaults.AuthenticationScheme));
        Assert.NotNull(await schemeProvider.GetSchemeAsync(ElfAuthSchemes.LocalAccountSetup));
        Assert.NotNull(await schemeProvider.GetSchemeAsync(ElfAuthSchemes.LocalAccountTwoFactor));

        Assert.IsType<LocalAccountPasswordService>(serviceProvider.GetRequiredService<ILocalAccountPasswordService>());
        Assert.IsType<LocalAccountTotpService>(serviceProvider.GetRequiredService<ILocalAccountTotpService>());
    }

    [Fact]
    public async Task AdminPolicy_WhenProviderIsLocal_RequiresAdministratorRole()
    {
        using var serviceProvider = BuildServiceProvider(new Dictionary<string, string>
        {
            ["Authentication:Provider"] = "Local"
        });
        var authorizationService = serviceProvider.GetRequiredService<IAuthorizationService>();

        var nonAdmin = CreatePrincipal("owner", roles: []);
        var admin = CreatePrincipal("owner", roles: ["Administrator"]);

        Assert.False((await authorizationService.AuthorizeAsync(
            nonAdmin,
            null,
            ElfAuthorizationPolicies.Admin)).Succeeded);
        Assert.True((await authorizationService.AuthorizeAsync(
            admin,
            null,
            ElfAuthorizationPolicies.Admin)).Succeeded);
    }

    [Fact]
    public void AddElfAdminAuthentication_WhenProviderIsOpenIdConnect_RegistersSecureOidcCodeFlow()
    {
        using var serviceProvider = BuildServiceProvider(new Dictionary<string, string>
        {
            ["Authentication:Provider"] = "OpenIdConnect",
            ["Authentication:OpenIdConnect:Authority"] = "https://identity.example.com/",
            ["Authentication:OpenIdConnect:ClientId"] = "elf-admin",
            ["Authentication:OpenIdConnect:ClientSecret"] = "test-client-secret",
            ["Authentication:OpenIdConnect:CallbackPath"] = "/signin-oidc",
            ["Authentication:OpenIdConnect:SignedOutCallbackPath"] = "/signout-callback-oidc",
            ["Authentication:OpenIdConnect:NameClaimType"] = "preferred_username",
            ["Authentication:OpenIdConnect:Scopes:0"] = "openid",
            ["Authentication:OpenIdConnect:Scopes:1"] = "profile",
            ["Authentication:OpenIdConnect:Scopes:2"] = "email"
        });
        var authenticationOptions = serviceProvider.GetRequiredService<IOptions<AuthenticationOptions>>().Value;
        Assert.Equal(CookieAuthenticationDefaults.AuthenticationScheme, authenticationOptions.DefaultScheme);
        Assert.Equal(ElfAuthSchemes.OpenIdConnect, authenticationOptions.DefaultChallengeScheme);

        var oidcOptions = serviceProvider
            .GetRequiredService<IOptionsMonitor<OpenIdConnectOptions>>()
            .Get(ElfAuthSchemes.OpenIdConnect);

        Assert.Equal("https://identity.example.com/", oidcOptions.Authority);
        Assert.Equal("elf-admin", oidcOptions.ClientId);
        Assert.Equal("/signin-oidc", oidcOptions.CallbackPath);
        Assert.Equal("/signout-callback-oidc", oidcOptions.SignedOutCallbackPath);
        Assert.Equal(OpenIdConnectResponseType.Code, oidcOptions.ResponseType);
        Assert.True(oidcOptions.UsePkce);
        Assert.True(oidcOptions.RequireHttpsMetadata);
        Assert.True(oidcOptions.GetClaimsFromUserInfoEndpoint);
        Assert.False(oidcOptions.SaveTokens);
        Assert.False(oidcOptions.MapInboundClaims);
        Assert.Equal("preferred_username", oidcOptions.TokenValidationParameters.NameClaimType);
        Assert.Equal(["openid", "profile", "email"], oidcOptions.Scope);
    }

    [Fact]
    public async Task AdminPolicy_WhenProviderIsOpenIdConnect_RequiresExactAllowedSubject()
    {
        using var serviceProvider = BuildServiceProvider(new Dictionary<string, string>
        {
            ["Authentication:Provider"] = "OpenIdConnect",
            ["Authentication:OpenIdConnect:Authority"] = "https://identity.example.com/",
            ["Authentication:OpenIdConnect:ClientId"] = "elf-admin",
            ["Authentication:OpenIdConnect:ClientSecret"] = "test-client-secret",
            ["Authentication:OpenIdConnect:AllowedSubjects:0"] = "admin-subject"
        });
        var authorizationService = serviceProvider.GetRequiredService<IAuthorizationService>();

        var allowedUser = CreatePrincipal("admin@example.com", subject: "admin-subject");
        var otherUser = CreatePrincipal("admin@example.com", subject: "other-subject");
        var caseVariant = CreatePrincipal("admin@example.com", subject: "ADMIN-SUBJECT");

        Assert.True((await authorizationService.AuthorizeAsync(
            allowedUser,
            null,
            ElfAuthorizationPolicies.Admin)).Succeeded);
        Assert.False((await authorizationService.AuthorizeAsync(
            otherUser,
            null,
            ElfAuthorizationPolicies.Admin)).Succeeded);
        Assert.False((await authorizationService.AuthorizeAsync(
            caseVariant,
            null,
            ElfAuthorizationPolicies.Admin)).Succeeded);
    }

    [Fact]
    public async Task AdminPolicy_WhenProviderIsOpenIdConnectAndAllowedSubjectsEmpty_DeniesAuthenticatedUsers()
    {
        using var serviceProvider = BuildServiceProvider(new Dictionary<string, string>
        {
            ["Authentication:Provider"] = "OpenIdConnect",
            ["Authentication:OpenIdConnect:Authority"] = "https://identity.example.com/",
            ["Authentication:OpenIdConnect:ClientId"] = "elf-admin",
            ["Authentication:OpenIdConnect:ClientSecret"] = "test-client-secret"
        });
        var authorizationService = serviceProvider.GetRequiredService<IAuthorizationService>();

        var user = CreatePrincipal("user@example.com", subject: "user-subject");

        Assert.False((await authorizationService.AuthorizeAsync(
            user,
            null,
            ElfAuthorizationPolicies.Admin)).Succeeded);
    }

    [Fact]
    public async Task AdminPolicy_WhenProviderIsExternal_AllowsAnonymousRequestsForUpstreamProtection()
    {
        using var serviceProvider = BuildServiceProvider(new Dictionary<string, string>
        {
            ["Authentication:Provider"] = "External"
        });
        var authorizationService = serviceProvider.GetRequiredService<IAuthorizationService>();
        var anonymousUser = new ClaimsPrincipal(new ClaimsIdentity());

        var result = await authorizationService.AuthorizeAsync(
            anonymousUser,
            null,
            ElfAuthorizationPolicies.Admin);

        Assert.True(result.Succeeded);
    }

    [Fact]
    public void AddElfAdminAuthentication_WhenProviderIsUnsupported_Throws()
    {
        var services = new ServiceCollection();
        var configuration = BuildConfiguration(new Dictionary<string, string>
        {
            ["Authentication:Provider"] = "999"
        });

        Assert.Throws<NotSupportedException>(() =>
            services.AddElfAdminAuthentication(configuration));
    }

    private static ServiceProvider BuildServiceProvider(Dictionary<string, string> settings)
    {
        var services = new ServiceCollection();
        services.AddLogging();
        services.AddOptions();
        services.AddElfAdminAuthentication(BuildConfiguration(settings));

        return services.BuildServiceProvider();
    }

    private static IConfiguration BuildConfiguration(Dictionary<string, string> settings) =>
        new ConfigurationBuilder()
            .AddInMemoryCollection(settings)
            .Build();

    private static ClaimsPrincipal CreatePrincipal(
        string userName,
        string[] roles = null,
        string subject = null)
    {
        var claims = new List<Claim>
        {
            new(ClaimTypes.Name, userName),
            new(ClaimTypes.Email, userName),
            new(ClaimTypes.Upn, userName),
            new("preferred_username", userName)
        };

        if (subject is not null)
        {
            claims.Add(new Claim("sub", subject));
        }

        if (roles is not null)
        {
            claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));
        }

        return new ClaimsPrincipal(new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme));
    }
}
