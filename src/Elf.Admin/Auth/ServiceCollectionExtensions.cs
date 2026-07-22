using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using Microsoft.IdentityModel.Tokens;

namespace Elf.Admin.Auth;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddElfAdminAuthentication(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        var section = configuration.GetSection("Authentication");
        var authentication = section.Get<AuthenticationSettings>() ?? new AuthenticationSettings();

        services.Configure<AuthenticationSettings>(section);
        services.AddSingleton<ILocalAccountPasswordService, LocalAccountPasswordService>();
        services.AddSingleton<ILocalAccountTotpService, LocalAccountTotpService>();
        services.AddScoped<ILocalAccountStore, LocalAccountStore>();

        switch (authentication.Provider)
        {
            case AuthenticationProvider.Local:
                services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
                    .AddCookie(CookieAuthenticationDefaults.AuthenticationScheme, options =>
                    {
                        options.AccessDeniedPath = "/auth/accessdenied";
                        options.LoginPath = "/auth/signin";
                        options.LogoutPath = "/auth/signout";
                    });
                break;
            case AuthenticationProvider.EntraID:
                services.AddAuthentication(options =>
                    {
                        options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                        options.DefaultChallengeScheme = OpenIdConnectDefaults.AuthenticationScheme;
                    })
                    .AddCookie(CookieAuthenticationDefaults.AuthenticationScheme)
                    .AddOpenIdConnect(OpenIdConnectDefaults.AuthenticationScheme, options =>
                    {
                        var entraId = authentication.EntraID;
                        options.Authority = BuildEntraAuthority(entraId);
                        options.ClientId = entraId.ClientId;
                        options.ClientSecret = entraId.ClientSecret;
                        options.CallbackPath = string.IsNullOrWhiteSpace(entraId.CallbackPath)
                            ? "/signin-oidc"
                            : entraId.CallbackPath;
                        options.ResponseType = OpenIdConnectResponseType.Code;
                        options.SaveTokens = false;
                        options.MapInboundClaims = false;
                        options.TokenValidationParameters = new TokenValidationParameters
                        {
                            NameClaimType = "preferred_username"
                        };
                    });
                break;
            case AuthenticationProvider.External:
                services.AddAuthentication();
                break;
            default:
                throw new NotSupportedException($"Authentication provider '{authentication.Provider}' is not supported.");
        }

        services.AddAuthentication()
            .AddCookie(ElfAuthSchemes.LocalAccountSetup, options =>
            {
                options.Cookie.Name = ".Elf.LocalAccount.Setup";
                options.LoginPath = "/auth/signin";
                options.ExpireTimeSpan = TimeSpan.FromMinutes(10);
                options.SlidingExpiration = false;
            })
            .AddCookie(ElfAuthSchemes.LocalAccountTwoFactor, options =>
            {
                options.Cookie.Name = ".Elf.LocalAccount.TwoFactor";
                options.LoginPath = "/auth/signin";
                options.ExpireTimeSpan = TimeSpan.FromMinutes(10);
                options.SlidingExpiration = false;
            });

        services.AddAuthorization(options =>
        {
            var adminPolicy = BuildAdminPolicy(authentication);
            options.DefaultPolicy = adminPolicy;
            options.AddPolicy(ElfAuthorizationPolicies.Admin, adminPolicy);
        });

        return services;
    }

    private static AuthorizationPolicy BuildAdminPolicy(AuthenticationSettings authentication)
    {
        var builder = new AuthorizationPolicyBuilder()
            .RequireAuthenticatedUser();

        if (authentication.Provider == AuthenticationProvider.Local)
        {
            builder.RequireRole("Administrator");
        }

        if (authentication.Provider == AuthenticationProvider.EntraID)
        {
            var allowedUsers = authentication.EntraID.AllowedUsers
                .Where(user => !string.IsNullOrWhiteSpace(user))
                .Select(user => user.Trim())
                .ToArray();

            builder.RequireAssertion(context =>
                ElfAuthorizationPolicies.IsAllowedEntraUser(context.User, allowedUsers));
        }

        return builder.Build();
    }

    private static string BuildEntraAuthority(EntraIdAuthenticationSettings settings)
    {
        var instance = string.IsNullOrWhiteSpace(settings.Instance)
            ? "https://login.microsoftonline.com/"
            : settings.Instance.Trim();

        if (!instance.EndsWith('/'))
        {
            instance += "/";
        }

        var tenantId = string.IsNullOrWhiteSpace(settings.TenantId)
            ? "common"
            : settings.TenantId.Trim();

        return $"{instance}{tenantId}/v2.0";
    }
}
