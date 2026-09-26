using Elf.App.Auth;
using Elf.App.Controllers;
using Elf.App.Features;
using Elf.App.Models;
using Elf.App.Pages.Auth;
using Elf.App.Setup;
using Elf.Data;
using LiteBus.Queries.Abstractions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.IdentityModel.Protocols;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.Extensions.Options;
using Moq;
using System.Net;
using System.Net.Http.Json;
using System.Reflection;
using System.Text.RegularExpressions;

namespace Elf.App.Tests;

public class AdminAuthorizationIntegrationTests
{
    [Theory]
    [InlineData("/admin")]
    [InlineData("/admin/")]
    public async Task Home_WhenLocalProviderAndAnonymous_RedirectsToAdminSignIn(string path)
    {
        using var factory = CreateFactory(AuthenticationProvider.Local);
        using var client = factory.CreateClient(new WebApplicationFactoryClientOptions
        {
            AllowAutoRedirect = false
        });

        var response = await client.GetAsync(path, TestContext.Current.CancellationToken);

        Assert.Equal(HttpStatusCode.Redirect, response.StatusCode);
        Assert.Equal("/admin/auth/signin", response.Headers.Location?.AbsolutePath);
    }

    [Fact]
    public async Task Api_WhenLocalProviderAndAnonymous_IsUnauthorized()
    {
        using var factory = CreateFactory(AuthenticationProvider.Local);
        using var client = factory.CreateClient(new WebApplicationFactoryClientOptions
        {
            AllowAutoRedirect = false
        });

        var response = await client.GetAsync("/admin/api/tag/list", TestContext.Current.CancellationToken);

        Assert.True(
            response.StatusCode is HttpStatusCode.Unauthorized or HttpStatusCode.Redirect,
            $"Expected unauthorized or redirect response, got {(int)response.StatusCode}.");
    }

    [Fact]
    public async Task AuthSignIn_WhenLocalProviderAndAnonymous_IsAllowed()
    {
        using var factory = CreateFactory(AuthenticationProvider.Local);
        using var client = factory.CreateClient(new WebApplicationFactoryClientOptions
        {
            AllowAutoRedirect = false
        });

        var response = await client.GetAsync("/admin/auth/signin", TestContext.Current.CancellationToken);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task AccessDenied_WhenUnderAdminBasePath_ReturnsForbidden()
    {
        using var factory = CreateFactory(AuthenticationProvider.External);
        using var client = factory.CreateClient(new WebApplicationFactoryClientOptions
        {
            AllowAutoRedirect = false
        });

        var response = await client.GetAsync("/admin/auth/accessdenied", TestContext.Current.CancellationToken);

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
        Assert.Equal("Access Denied", await response.Content.ReadAsStringAsync(TestContext.Current.CancellationToken));
    }

    [Fact]
    public async Task AuthSignIn_WhenAuthRateLimitIsExceeded_ReturnsTooManyRequests()
    {
        using var factory = CreateFactory(AuthenticationProvider.Local);
        using var client = factory.CreateClient(new WebApplicationFactoryClientOptions
        {
            AllowAutoRedirect = false
        });

        HttpResponseMessage response = null;
        for (var i = 0; i < 9; i++)
        {
            response = await client.GetAsync("/admin/auth/signin", TestContext.Current.CancellationToken);
        }

        Assert.NotNull(response);
        Assert.Equal(HttpStatusCode.TooManyRequests, response.StatusCode);
        Assert.Equal("0", response.Headers.GetValues("x-ratelimit-remaining").Single());
        Assert.Equal("8", response.Headers.GetValues("x-ratelimit-limit").Single());
        Assert.Equal("Too Many Requests", await response.Content.ReadAsStringAsync(TestContext.Current.CancellationToken));
    }

    [Fact]
    public async Task Health_WhenLocalProviderAndAnonymous_IsAllowed()
    {
        using var factory = CreateFactory(AuthenticationProvider.Local);
        using var client = factory.CreateClient(new WebApplicationFactoryClientOptions
        {
            AllowAutoRedirect = false
        });

        var response = await client.GetAsync("/health", TestContext.Current.CancellationToken);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task Home_WhenExternalProviderAndAnonymous_IsAllowed()
    {
        using var factory = CreateFactory(AuthenticationProvider.External);
        using var client = factory.CreateClient(new WebApplicationFactoryClientOptions
        {
            AllowAutoRedirect = false
        });

        var response = await client.GetAsync("/admin", TestContext.Current.CancellationToken);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Theory]
    [InlineData("/api/tag/list")]
    [InlineData("/auth/signin")]
    [InlineData("/account/accessdenied")]
    [InlineData("/signin-oidc")]
    [InlineData("/signout-callback-oidc")]
    [InlineData("/js/main.mjs")]
    [InlineData("/css/site.css")]
    [InlineData("/lib/alpinejs/dist/module.esm.min.js")]
    public async Task LegacyRootAdminPaths_AreNotMapped(string path)
    {
        using var factory = CreateFactory(AuthenticationProvider.External);
        using var client = factory.CreateClient(new WebApplicationFactoryClientOptions
        {
            AllowAutoRedirect = false
        });

        var response = await client.GetAsync(path, TestContext.Current.CancellationToken);

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task AdminBasePath_ServesAssetsAndLeavesRootHealthAvailable()
    {
        using var factory = CreateFactory(AuthenticationProvider.External);
        using var client = factory.CreateClient();

        Assert.Equal(HttpStatusCode.OK, (await client.GetAsync("/admin/css/site.css", TestContext.Current.CancellationToken)).StatusCode);
        Assert.Equal(HttpStatusCode.OK, (await client.GetAsync("/admin/js/main.mjs", TestContext.Current.CancellationToken)).StatusCode);
        Assert.Equal(HttpStatusCode.OK, (await client.GetAsync("/admin/lib/alpinejs/dist/module.esm.min.js", TestContext.Current.CancellationToken)).StatusCode);
        Assert.Equal(HttpStatusCode.OK, (await client.GetAsync("/admin/favicon.ico", TestContext.Current.CancellationToken)).StatusCode);
        Assert.Equal(HttpStatusCode.OK, (await client.GetAsync("/health", TestContext.Current.CancellationToken)).StatusCode);
        var rootHealth = await client.GetAsync("/", TestContext.Current.CancellationToken);
        Assert.Equal(HttpStatusCode.OK, rootHealth.StatusCode);
        Assert.Equal("DENY", rootHealth.Headers.GetValues("X-Frame-Options").Single());
    }

    [Fact]
    public async Task OpenIdConnectSignInAndSignOut_UseAdminCallbackPaths()
    {
        using var factory = CreateOpenIdConnectFactory();
        using var client = factory.CreateClient(new WebApplicationFactoryClientOptions
        {
            AllowAutoRedirect = false
        });

        var signIn = await client.GetAsync("/admin/auth/signin", TestContext.Current.CancellationToken);
        var signInRedirect = QueryHelpers.ParseQuery(signIn.Headers.Location!.Query);
        Assert.Equal("http://localhost/admin/signin-oidc", signInRedirect["redirect_uri"]);

        var signOut = await client.GetAsync("/admin/auth/signout", TestContext.Current.CancellationToken);
        var signOutRedirect = QueryHelpers.ParseQuery(signOut.Headers.Location!.Query);
        Assert.Equal("http://localhost/admin/signout-callback-oidc", signOutRedirect["post_logout_redirect_uri"]);
    }

    [Fact]
    public async Task AdminAndIdentityEndpoints_UseExpectedAuthorizationPolicies()
    {
        using var factory = CreateFactory(AuthenticationProvider.External);
        using var client = factory.CreateClient();
        await client.GetAsync("/health", TestContext.Current.CancellationToken);
        var endpoints = factory.Services
            .GetServices<EndpointDataSource>()
            .SelectMany(source => source.Endpoints)
            .OfType<RouteEndpoint>();

        var adminEndpoint = Assert.Single(endpoints, candidate =>
            candidate.RoutePattern.RawText == "api/Tag/list");
        var adminAuthorizeData = adminEndpoint.Metadata.GetOrderedMetadata<IAuthorizeData>();

        var adminPolicy = Assert.Single(adminAuthorizeData);
        Assert.Equal(ElfAuthorizationPolicies.Admin, adminPolicy.Policy);

        var identityEndpoint = Assert.Single(endpoints, candidate =>
            candidate.Metadata.GetMetadata<ControllerActionDescriptor>()?.ActionName ==
            nameof(AuthController.Identity));
        var identityAuthorizeData = identityEndpoint.Metadata.GetOrderedMetadata<IAuthorizeData>();

        var identityPolicy = Assert.Single(identityAuthorizeData);
        Assert.Null(identityPolicy.Policy);
    }

    [Fact]
    public async Task Home_WhenRendered_ContainsAntiforgeryToken()
    {
        using var factory = CreateFactory(AuthenticationProvider.External);
        using var client = factory.CreateClient(new WebApplicationFactoryClientOptions
        {
            AllowAutoRedirect = false
        });

        var response = await client.GetAsync("/admin", TestContext.Current.CancellationToken);
        var content = await response.Content.ReadAsStringAsync(TestContext.Current.CancellationToken);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Contains("__RequestVerificationToken", content);
        Assert.Contains("<base href=\"/admin/\"", content);
        Assert.Contains("/admin/js/main.mjs", content);
        Assert.Contains("data-forwarder-base-url=\"https://go.edi.wang\"", content);
    }

    [Fact]
    public async Task ForwarderRoutes_ArePublicAndAdminApiRemainsProtected()
    {
        using var factory = CreateFactory(AuthenticationProvider.Local);
        using var client = factory.CreateClient(new WebApplicationFactoryClientOptions
        {
            AllowAutoRedirect = false
        });
        client.DefaultRequestHeaders.UserAgent.ParseAdd("Elf integration test");

        var forwardResponse = await client.GetAsync("/fw/not-a-token", TestContext.Current.CancellationToken);
        Assert.Equal(HttpStatusCode.BadRequest, forwardResponse.StatusCode);

        var adminResponse = await client.GetAsync("/admin/api/tag/list", TestContext.Current.CancellationToken);
        Assert.True(adminResponse.StatusCode is HttpStatusCode.Unauthorized or HttpStatusCode.Redirect);

        var endpoints = factory.Services
            .GetServices<EndpointDataSource>()
            .SelectMany(source => source.Endpoints)
            .OfType<RouteEndpoint>()
            .Select(endpoint => endpoint.Metadata.GetMetadata<ControllerActionDescriptor>())
            .Where(action => action?.ControllerTypeInfo.AsType() == typeof(ForwardController))
            .ToList();

        Assert.Contains(endpoints, action => action?.ActionName == nameof(ForwardController.Forward));
        Assert.Contains(endpoints, action => action?.ActionName == nameof(ForwardController.Aka));
    }

    [Fact]
    public async Task Forward_WhenCacheThrowsInProduction_ReturnsServerErrorWithoutLoginRedirect()
    {
        var cache = new Mock<IDistributedCache>();
        cache.Setup(value => value.GetAsync(It.IsAny<string>(), It.IsAny<CancellationToken>()))
            .ThrowsAsync(new InvalidOperationException("Simulated cache failure"));

        using var factory = CreateFactory(AuthenticationProvider.Local, configureTestServices: services =>
        {
            services.RemoveAll<IDistributedCache>();
            services.AddSingleton(cache.Object);
        }).WithWebHostBuilder(builder => builder.UseEnvironment("Production"));
        using var client = factory.CreateClient(new WebApplicationFactoryClientOptions { AllowAutoRedirect = false });
        client.DefaultRequestHeaders.UserAgent.ParseAdd("Elf integration test");

        var response = await client.GetAsync("/fw/a1b2c3d4", TestContext.Current.CancellationToken);

        Assert.Equal(HttpStatusCode.InternalServerError, response.StatusCode);
        Assert.Null(response.Headers.Location);
        Assert.Contains("no-store", response.Headers.CacheControl?.ToString());
        Assert.DoesNotContain("Simulated cache failure", await response.Content.ReadAsStringAsync(TestContext.Current.CancellationToken));
    }

    [Fact]
    public async Task Admin_WhenQueryThrowsInProduction_StillUsesErrorPage()
    {
        using var factory = CreateFactory(AuthenticationProvider.External)
            .WithWebHostBuilder(builder => builder.UseEnvironment("Production"));
        using var client = factory.CreateClient(new WebApplicationFactoryClientOptions { AllowAutoRedirect = false });
        factory.Services.GetRequiredService<TestQueryMediator>().ThrowOnTagLookup = true;

        var response = await client.GetAsync("/admin/api/tag/list", TestContext.Current.CancellationToken);

        Assert.Equal(HttpStatusCode.InternalServerError, response.StatusCode);
        Assert.Contains("An error occurred", await response.Content.ReadAsStringAsync(TestContext.Current.CancellationToken));
    }

    [Fact]
    public async Task ForwardAndAka_WhenLinkIsValid_RedirectWithoutCaching()
    {
        using var factory = CreateFactory(AuthenticationProvider.External);
        using var client = factory.CreateClient(new WebApplicationFactoryClientOptions
        {
            AllowAutoRedirect = false
        });
        client.DefaultRequestHeaders.UserAgent.ParseAdd("Elf integration test");

        var mediator = factory.Services.GetRequiredService<TestQueryMediator>();
        mediator.Link = new LinkEntity
        {
            OriginUrl = "https://example.com/destination",
            FwToken = "a1b2c3d4",
            AkaName = "good-name",
            IsEnabled = true,
            TTL = 60
        };
        mediator.AkaToken = "a1b2c3d4";

        var forward = await client.GetAsync("/fw/a1b2c3d4", TestContext.Current.CancellationToken);
        Assert.Equal(HttpStatusCode.Redirect, forward.StatusCode);
        Assert.Equal("https://example.com/destination", forward.Headers.Location?.ToString());
        Assert.Contains("no-store", forward.Headers.CacheControl?.ToString());

        var aka = await client.GetAsync("/aka/good-name", TestContext.Current.CancellationToken);
        Assert.Equal(HttpStatusCode.Redirect, aka.StatusCode);
        Assert.Equal("https://example.com/destination", aka.Headers.Location?.ToString());
        Assert.Contains("no-store", aka.Headers.CacheControl?.ToString());

        var invalidAka = await client.GetAsync("/aka/-invalid", TestContext.Current.CancellationToken);
        Assert.Equal(HttpStatusCode.NotFound, invalidAka.StatusCode);
        Assert.Equal(1, mediator.AkaQueryCount);
    }

    [Fact]
    public async Task Forward_WhenLinkIsMissingOrDisabled_UsesConfiguredFallback()
    {
        using var factory = CreateFactory(AuthenticationProvider.External);
        using var client = factory.CreateClient(new WebApplicationFactoryClientOptions
        {
            AllowAutoRedirect = false
        });
        client.DefaultRequestHeaders.UserAgent.ParseAdd("Elf integration test");
        var mediator = factory.Services.GetRequiredService<TestQueryMediator>();

        var missing = await client.GetAsync("/fw/a1b2c3d4", TestContext.Current.CancellationToken);
        Assert.Equal(HttpStatusCode.Redirect, missing.StatusCode);
        Assert.Equal("https://fallback.example/not-found", missing.Headers.Location?.ToString());

        mediator.Link = new LinkEntity
        {
            OriginUrl = "https://example.com/disabled",
            FwToken = "a1b2c3d4",
            IsEnabled = false,
            TTL = 60
        };
        var disabled = await client.GetAsync("/fw/a1b2c3d4", TestContext.Current.CancellationToken);
        Assert.Equal(HttpStatusCode.Redirect, disabled.StatusCode);
        Assert.Equal("https://fallback.example/not-found", disabled.Headers.Location?.ToString());
    }

    [Theory]
    [InlineData("not-a-url")]
    [InlineData("http://127.0.0.1/private")]
    [InlineData("https://go.edi.wang/fw/another-token")]
    [InlineData("https://go.edi.wang/aka/another-name")]
    public async Task Forward_WhenStoredOriginIsInvalidOrSelfReferential_UsesFallback(string originUrl)
    {
        using var factory = CreateFactory(AuthenticationProvider.External);
        using var client = factory.CreateClient(new WebApplicationFactoryClientOptions
        {
            AllowAutoRedirect = false,
            BaseAddress = new Uri("https://go.edi.wang")
        });
        client.DefaultRequestHeaders.UserAgent.ParseAdd("Elf integration test");
        factory.Services.GetRequiredService<TestQueryMediator>().Link = new LinkEntity
        {
            OriginUrl = originUrl,
            FwToken = "a1b2c3d4",
            IsEnabled = true,
            TTL = 60
        };

        var response = await client.GetAsync("/fw/a1b2c3d4", TestContext.Current.CancellationToken);

        Assert.Equal(HttpStatusCode.Redirect, response.StatusCode);
        Assert.Equal("https://fallback.example/not-found", response.Headers.Location?.ToString());
    }

    [Theory]
    [InlineData("https://go.edi.wang/fw/another-token")]
    [InlineData("https://go.edi.wang/aka/another-name")]
    public async Task AdminCreate_WhenOriginTargetsSameHostForwardEndpoint_IsRejected(string originUrl)
    {
        using var factory = CreateFactory(AuthenticationProvider.External);
        using var client = factory.CreateClient(new WebApplicationFactoryClientOptions
        {
            AllowAutoRedirect = false,
            BaseAddress = new Uri("https://go.edi.wang")
        });

        var home = await client.GetAsync("/admin", TestContext.Current.CancellationToken);
        var html = await home.Content.ReadAsStringAsync(TestContext.Current.CancellationToken);
        var antiforgeryToken = Regex.Match(html, "name=\"__RequestVerificationToken\" type=\"hidden\" value=\"([^\"]+)\"");
        Assert.True(antiforgeryToken.Success, "Expected an antiforgery token on the Admin page.");

        using var request = new HttpRequestMessage(HttpMethod.Post, "/admin/api/link/create")
        {
            Content = JsonContent.Create(new LinkEditModel
            {
                OriginUrl = originUrl,
                IsEnabled = true,
                TTL = 60
            })
        };
        request.Headers.Add("RequestVerificationToken", antiforgeryToken.Groups[1].Value);

        var response = await client.SendAsync(request, TestContext.Current.CancellationToken);
        var body = await response.Content.ReadAsStringAsync(TestContext.Current.CancellationToken);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        Assert.Contains("pointing to this site", body);
    }

    [Fact]
    public async Task ForwarderRateLimit_GroupsIpv6ClientsBy64Subnet()
    {
        using var factory = CreateFactory(
            AuthenticationProvider.Local,
            settings: new Dictionary<string, string>
            {
                ["RateLimit:PermitLimit"] = "2",
                ["RateLimit:WindowSeconds"] = "60"
            },
            configureTestServices: services => services.AddTransient<IStartupFilter, RemoteIpHeaderStartupFilter>());
        using var client = factory.CreateClient(new WebApplicationFactoryClientOptions
        {
            AllowAutoRedirect = false
        });
        client.DefaultRequestHeaders.UserAgent.ParseAdd("Elf integration test");

        HttpResponseMessage response = null;
        var addresses = new[]
        {
            "2001:db8:abcd:1234::1",
            "2001:db8:abcd:1234::2",
            "2001:db8:abcd:1234::3"
        };
        foreach (var address in addresses)
        {
            using var request = new HttpRequestMessage(HttpMethod.Get, "/fw/not-a-token");
            request.Headers.Add("X-Test-Remote-IP", address);
            response = await client.SendAsync(request, TestContext.Current.CancellationToken);
        }

        Assert.NotNull(response);
        Assert.Equal(HttpStatusCode.TooManyRequests, response.StatusCode);
        Assert.Equal("2", response.Headers.GetValues("x-ratelimit-limit").Single());
    }

    [Fact]
    public async Task UnsafeApiRequest_WhenAntiforgeryTokenIsMissing_ReturnsBadRequest()
    {
        using var factory = CreateFactory(AuthenticationProvider.External);
        using var client = factory.CreateClient(new WebApplicationFactoryClientOptions
        {
            AllowAutoRedirect = false
        });

        var response = await client.PostAsJsonAsync(
            "/admin/api/tag",
            new { name = "docs" },
            TestContext.Current.CancellationToken);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Theory]
    [InlineData(typeof(SignInModel))]
    [InlineData(typeof(SetupAuthenticatorModel))]
    [InlineData(typeof(VerifyAuthenticatorModel))]
    public void AuthPages_HaveAuthRateLimitPolicy(Type pageModelType)
    {
        var attribute = pageModelType.GetCustomAttribute<EnableRateLimitingAttribute>();

        Assert.NotNull(attribute);
        Assert.Equal(ElfRateLimitPolicies.Auth, attribute.PolicyName);
    }

    [Fact]
    public void AuthRateLimitPartitionKey_WhenIpv6AddressesShare64Subnet_ReturnsSameSubnetKey()
    {
        var firstContext = new DefaultHttpContext();
        firstContext.Connection.RemoteIpAddress = IPAddress.Parse("2001:db8:abcd:1234::1");

        var secondContext = new DefaultHttpContext();
        secondContext.Connection.RemoteIpAddress = IPAddress.Parse("2001:db8:abcd:1234::ffff");

        var firstKey = InvokeGetRateLimitPartitionKey(firstContext);
        var secondKey = InvokeGetRateLimitPartitionKey(secondContext);

        Assert.Equal("2001:db8:abcd:1234::/64", firstKey);
        Assert.Equal(firstKey, secondKey);
    }

    private static WebApplicationFactory<Program> CreateFactory(
        AuthenticationProvider provider,
        IReadOnlyDictionary<string, string> settings = null,
        Action<IServiceCollection> configureTestServices = null) =>
        new WebApplicationFactory<Program>()
            .WithWebHostBuilder(builder =>
            {
                builder.UseSetting("Authentication:Provider", provider.ToString());
                builder.UseSetting("DefaultRedirectionUrl", "https://fallback.example/not-found");
                builder.UseSetting("FeatureManagement:EnableTracking", "false");
                builder.UseSetting(
                    "ConnectionStrings:ElfDatabase",
                    "Server=(localdb)\\MSSQLLocalDB;Database=elf-test;Trusted_Connection=True;");
                foreach (var setting in settings ?? new Dictionary<string, string>())
                {
                    builder.UseSetting(setting.Key, setting.Value);
                }

                builder.ConfigureTestServices(services =>
                {
                    UseSuccessfulStartupInitializer(services);
                    services.RemoveAll<IQueryMediator>();
                    services.AddSingleton<TestQueryMediator>();
                    services.AddSingleton<IQueryMediator>(serviceProvider =>
                        serviceProvider.GetRequiredService<TestQueryMediator>());
                    configureTestServices?.Invoke(services);
                });
            });

    private static WebApplicationFactory<Program> CreateOpenIdConnectFactory()
    {
        var configurationManager = new Mock<IConfigurationManager<OpenIdConnectConfiguration>>();
        configurationManager
            .Setup(manager => manager.GetConfigurationAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(new OpenIdConnectConfiguration
            {
                AuthorizationEndpoint = "https://identity.example.com/authorize",
                EndSessionEndpoint = "https://identity.example.com/logout"
            });

        return new WebApplicationFactory<Program>()
            .WithWebHostBuilder(builder =>
            {
                builder.UseSetting("Authentication:Provider", AuthenticationProvider.OpenIdConnect.ToString());
                builder.UseSetting("Authentication:OpenIdConnect:Authority", "https://identity.example.com/");
                builder.UseSetting("Authentication:OpenIdConnect:ClientId", "elf-admin-test");
                builder.UseSetting("Authentication:OpenIdConnect:ClientSecret", "test-client-secret");
                builder.UseSetting(
                    "ConnectionStrings:ElfDatabase",
                    "Server=(localdb)\\MSSQLLocalDB;Database=elf-test;Trusted_Connection=True;");
                builder.ConfigureTestServices(services =>
                {
                    services.PostConfigure<OpenIdConnectOptions>(
                        ElfAuthSchemes.OpenIdConnect,
                        options => options.ConfigurationManager = configurationManager.Object);
                    UseSuccessfulStartupInitializer(services);
                    services.RemoveAll<IQueryMediator>();
                    services.AddSingleton<TestQueryMediator>();
                    services.AddSingleton<IQueryMediator>(serviceProvider =>
                        serviceProvider.GetRequiredService<TestQueryMediator>());
                });
            });
    }

    private static void UseSuccessfulStartupInitializer(IServiceCollection services)
    {
        services.RemoveAll<IStartUpInitializer>();
        services.AddScoped<IStartUpInitializer, SuccessfulStartupInitializer>();
    }

    private sealed class SuccessfulStartupInitializer : IStartUpInitializer
    {
        public Task<InitStartUpResult> InitStartUpAsync(CancellationToken cancellationToken = default) =>
            Task.FromResult(InitStartUpResult.Success);
    }

    private sealed class TestQueryMediator : IQueryMediator
    {
        public LinkEntity Link { get; set; }

        public string AkaToken { get; set; }

        public int AkaQueryCount { get; private set; }

        public bool ThrowOnTagLookup { get; set; }

        public Task<TQueryResult> QueryAsync<TQueryResult>(
            IQuery<TQueryResult> query,
            QueryMediationSettings settings,
            CancellationToken cancellationToken = default)
        {
            object result = query switch
            {
                GetLinkByTokenQuery => Link,
                GetTokenByAkaNameQuery => QueryAkaToken(),
                GetTagsQuery when ThrowOnTagLookup => throw new InvalidOperationException("Simulated query failure"),
                _ => null
            };

            return Task.FromResult(result is null ? default : (TQueryResult)result);
        }

        public IAsyncEnumerable<TQueryResult> StreamAsync<TQueryResult>(
            IStreamQuery<TQueryResult> query,
            QueryMediationSettings settings,
            CancellationToken cancellationToken = default) =>
            AsyncEnumerable.Empty<TQueryResult>();

        private string QueryAkaToken()
        {
            AkaQueryCount++;
            return AkaToken;
        }
    }

    private sealed class RemoteIpHeaderStartupFilter : IStartupFilter
    {
        public Action<IApplicationBuilder> Configure(Action<IApplicationBuilder> next) => app =>
        {
            app.Use(async (context, nextRequest) =>
            {
                if (IPAddress.TryParse(context.Request.Headers["X-Test-Remote-IP"], out var ipAddress))
                {
                    context.Connection.RemoteIpAddress = ipAddress;
                }

                await nextRequest();
            });
            next(app);
        };
    }

    private static string InvokeGetRateLimitPartitionKey(HttpContext httpContext)
    {
        var method = typeof(Program).GetMethod(
            "GetRateLimitPartitionKey",
            BindingFlags.NonPublic | BindingFlags.Static);

        Assert.NotNull(method);
        return Assert.IsType<string>(method.Invoke(null, [httpContext]));
    }
}
