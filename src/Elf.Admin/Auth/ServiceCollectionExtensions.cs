using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using Microsoft.Extensions.Options;

namespace Elf.Admin.Auth;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddElfAdminAuthentication(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        var section = configuration.GetSection("Authentication");
        var authentication = section.Get<AuthenticationSettings>() ?? new AuthenticationSettings();
        var oidc = authentication.OpenIdConnect ?? new OpenIdConnectAuthenticationSettings();

        services.AddSingleton<IValidateOptions<AuthenticationSettings>, AuthenticationSettingsValidator>();
        services.AddOptions<AuthenticationSettings>()
            .Bind(section)
            .ValidateOnStart();
        services.AddSingleton<ILocalAccountPasswordService, LocalAccountPasswordService>();
        services.AddSingleton<ILocalAccountTotpService, LocalAccountTotpService>();
        services.AddScoped<ILocalAccountStore, LocalAccountStore>();

        switch (authentication.Provider)
        {
            case AuthenticationProvider.Local:
                services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
                    .AddCookie(CookieAuthenticationDefaults.AuthenticationScheme, ConfigureApplicationCookie);
                break;
            case AuthenticationProvider.OpenIdConnect:
                services.AddAuthentication(options =>
                    {
                        options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                        options.DefaultChallengeScheme = ElfAuthSchemes.OpenIdConnect;
                    })
                    .AddCookie(CookieAuthenticationDefaults.AuthenticationScheme, ConfigureApplicationCookie)
                    .AddOpenIdConnect(ElfAuthSchemes.OpenIdConnect, options =>
                    {
                        options.Authority = oidc.Authority;
                        options.ClientId = oidc.ClientId;
                        options.ClientSecret = oidc.ClientSecret;
                        options.CallbackPath = oidc.CallbackPath;
                        options.SignedOutCallbackPath = oidc.SignedOutCallbackPath;
                        options.SignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                        options.ResponseType = OpenIdConnectResponseType.Code;
                        options.UsePkce = true;
                        options.RequireHttpsMetadata = true;
                        options.GetClaimsFromUserInfoEndpoint = true;
                        options.SaveTokens = false;
                        options.MapInboundClaims = false;
                        options.TokenValidationParameters.NameClaimType = oidc.NameClaimType;

                        options.Scope.Clear();
                        foreach (var scope in oidc.Scopes ?? [])
                        {
                            options.Scope.Add(scope);
                        }
                    });
                break;
            case AuthenticationProvider.External:
                services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
                    .AddCookie(CookieAuthenticationDefaults.AuthenticationScheme, ConfigureApplicationCookie);
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

        services.AddAuthorizationBuilder()
            .AddPolicy(ElfAuthorizationPolicies.Admin, policy =>
            {
                if (authentication.Provider == AuthenticationProvider.External)
                {
                    policy.RequireAssertion(_ => true);
                    return;
                }

                policy.RequireAuthenticatedUser();

                if (authentication.Provider == AuthenticationProvider.Local)
                {
                    policy.RequireRole("Administrator");
                    return;
                }

                if (authentication.Provider == AuthenticationProvider.OpenIdConnect)
                {
                    var allowedSubjects = (oidc.AllowedSubjects ?? [])
                        .ToHashSet(StringComparer.Ordinal);
                    policy.RequireAssertion(context =>
                        context.User.FindAll("sub")
                            .Any(claim => allowedSubjects.Contains(claim.Value)));
                }
            });

        return services;
    }

    private static void ConfigureApplicationCookie(CookieAuthenticationOptions options)
    {
        options.AccessDeniedPath = "/auth/accessdenied";
        options.LoginPath = "/auth/signin";
        options.LogoutPath = "/auth/signout";
    }
}
