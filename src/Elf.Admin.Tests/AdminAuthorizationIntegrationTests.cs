using Elf.Admin.Auth;
using Elf.Admin.Controllers;
using Elf.Admin.Pages.Auth;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Protocols;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.Extensions.Options;
using Moq;
using System.Net;
using System.Net.Http.Json;
using System.Reflection;

namespace Elf.Admin.Tests;

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
    [InlineData("/")]
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

    private static WebApplicationFactory<Program> CreateFactory(AuthenticationProvider provider) =>
        new WebApplicationFactory<Program>()
            .WithWebHostBuilder(builder =>
            {
                builder.UseSetting("Authentication:Provider", provider.ToString());
                builder.UseSetting(
                    "ConnectionStrings:ElfDatabase",
                    "Server=(localdb)\\MSSQLLocalDB;Database=elf-test;Trusted_Connection=True;");
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
                builder.ConfigureTestServices(services => services.PostConfigure<OpenIdConnectOptions>(
                    ElfAuthSchemes.OpenIdConnect,
                    options => options.ConfigurationManager = configurationManager.Object));
            });
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
