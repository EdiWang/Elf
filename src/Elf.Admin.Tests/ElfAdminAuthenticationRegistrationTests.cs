using Elf.Admin.Auth;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using System.Security.Claims;

namespace Elf.Admin.Tests;

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
    public async Task AdminPolicy_WhenProviderIsEntraIdAndAllowedUsersConfigured_RequiresAllowedUser()
    {
        using var serviceProvider = BuildServiceProvider(new Dictionary<string, string>
        {
            ["Authentication:Provider"] = "EntraID",
            ["Authentication:EntraID:Instance"] = "https://login.microsoftonline.com/",
            ["Authentication:EntraID:TenantId"] = "00000000-0000-0000-0000-000000000000",
            ["Authentication:EntraID:ClientId"] = "11111111-1111-1111-1111-111111111111",
            ["Authentication:EntraID:CallbackPath"] = "/signin-oidc",
            ["Authentication:EntraID:AllowedUsers:0"] = "admin@example.com"
        });
        var authenticationOptions = serviceProvider.GetRequiredService<IOptions<AuthenticationOptions>>().Value;
        Assert.Equal(CookieAuthenticationDefaults.AuthenticationScheme, authenticationOptions.DefaultScheme);
        Assert.Equal(OpenIdConnectDefaults.AuthenticationScheme, authenticationOptions.DefaultChallengeScheme);

        var authorizationService = serviceProvider.GetRequiredService<IAuthorizationService>();

        var allowedUser = CreatePrincipal("admin@example.com");
        var otherUser = CreatePrincipal("user@example.com");

        Assert.True((await authorizationService.AuthorizeAsync(
            allowedUser,
            null,
            ElfAuthorizationPolicies.Admin)).Succeeded);
        Assert.False((await authorizationService.AuthorizeAsync(
            otherUser,
            null,
            ElfAuthorizationPolicies.Admin)).Succeeded);
    }

    [Fact]
    public async Task AdminPolicy_WhenProviderIsEntraIdAndAllowedUsersEmpty_AllowsAuthenticatedUsers()
    {
        using var serviceProvider = BuildServiceProvider(new Dictionary<string, string>
        {
            ["Authentication:Provider"] = "EntraID",
            ["Authentication:EntraID:Instance"] = "https://login.microsoftonline.com/",
            ["Authentication:EntraID:TenantId"] = "00000000-0000-0000-0000-000000000000",
            ["Authentication:EntraID:ClientId"] = "11111111-1111-1111-1111-111111111111",
            ["Authentication:EntraID:CallbackPath"] = "/signin-oidc"
        });
        var authorizationService = serviceProvider.GetRequiredService<IAuthorizationService>();

        var user = CreatePrincipal("user@example.com");

        Assert.True((await authorizationService.AuthorizeAsync(
            user,
            null,
            ElfAuthorizationPolicies.Admin)).Succeeded);
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

    private static ClaimsPrincipal CreatePrincipal(string userName, string[] roles = null)
    {
        var claims = new List<Claim>
        {
            new(ClaimTypes.Name, userName),
            new(ClaimTypes.Email, userName),
            new(ClaimTypes.Upn, userName),
            new("preferred_username", userName)
        };

        if (roles is not null)
        {
            claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));
        }

        return new ClaimsPrincipal(new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme));
    }
}
