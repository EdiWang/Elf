using Elf.Admin.Auth;
using Elf.Admin.Pages.Auth;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.Extensions.Configuration;
using System.Net;
using System.Net.Http.Json;
using System.Reflection;

namespace Elf.Admin.Tests;

public class AdminAuthorizationIntegrationTests
{
    [Fact]
    public async Task Home_WhenLocalProviderAndAnonymous_RedirectsToSignIn()
    {
        using var factory = CreateFactory(AuthenticationProvider.Local);
        using var client = factory.CreateClient(new WebApplicationFactoryClientOptions
        {
            AllowAutoRedirect = false
        });

        var response = await client.GetAsync("/", TestContext.Current.CancellationToken);

        Assert.Equal(HttpStatusCode.Redirect, response.StatusCode);
        Assert.Equal("/auth/signin", response.Headers.Location?.AbsolutePath);
    }

    [Fact]
    public async Task Api_WhenLocalProviderAndAnonymous_IsUnauthorized()
    {
        using var factory = CreateFactory(AuthenticationProvider.Local);
        using var client = factory.CreateClient(new WebApplicationFactoryClientOptions
        {
            AllowAutoRedirect = false
        });

        var response = await client.GetAsync("/api/tag/list", TestContext.Current.CancellationToken);

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

        var response = await client.GetAsync("/auth/signin", TestContext.Current.CancellationToken);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
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
            response = await client.GetAsync("/auth/signin", TestContext.Current.CancellationToken);
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

        var response = await client.GetAsync("/", TestContext.Current.CancellationToken);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task Home_WhenRendered_ContainsAntiforgeryToken()
    {
        using var factory = CreateFactory(AuthenticationProvider.External);
        using var client = factory.CreateClient(new WebApplicationFactoryClientOptions
        {
            AllowAutoRedirect = false
        });

        var response = await client.GetAsync("/", TestContext.Current.CancellationToken);
        var content = await response.Content.ReadAsStringAsync(TestContext.Current.CancellationToken);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Contains("__RequestVerificationToken", content);
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
            "/api/tag",
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
                builder.ConfigureAppConfiguration((_, config) =>
                {
                    config.AddInMemoryCollection(new Dictionary<string, string>
                    {
                        ["Authentication:Provider"] = provider.ToString(),
                        ["ConnectionStrings:ElfDatabase"] = "Server=(localdb)\\MSSQLLocalDB;Database=elf-test;Trusted_Connection=True;"
                    });
                });
            });

    private static string InvokeGetRateLimitPartitionKey(HttpContext httpContext)
    {
        var method = typeof(Program).GetMethod(
            "GetRateLimitPartitionKey",
            BindingFlags.NonPublic | BindingFlags.Static);

        Assert.NotNull(method);
        return Assert.IsType<string>(method.Invoke(null, [httpContext]));
    }
}
