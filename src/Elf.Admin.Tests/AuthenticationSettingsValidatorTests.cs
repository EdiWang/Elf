using Elf.Admin.Auth;
using Microsoft.Extensions.Options;

namespace Elf.Admin.Tests;

public class AuthenticationSettingsValidatorTests
{
    private readonly AuthenticationSettingsValidator _validator = new();

    [Theory]
    [InlineData(AuthenticationProvider.Local)]
    [InlineData(AuthenticationProvider.External)]
    public void Validate_WhenProviderDoesNotUseOidc_Succeeds(AuthenticationProvider provider)
    {
        var result = _validator.Validate(Options.DefaultName, new AuthenticationSettings
        {
            Provider = provider
        });

        Assert.False(result.Failed);
    }

    [Fact]
    public void Validate_WhenOpenIdConnectSettingsAreValid_Succeeds()
    {
        var result = _validator.Validate(Options.DefaultName, CreateValidSettings());

        Assert.False(result.Failed);
    }

    [Fact]
    public void Validate_WhenOpenIdConnectRequiredSettingsAreInvalid_ReportsAllFailures()
    {
        var result = _validator.Validate(Options.DefaultName, new AuthenticationSettings
        {
            Provider = AuthenticationProvider.OpenIdConnect,
            OpenIdConnect = new OpenIdConnectAuthenticationSettings
            {
                Authority = "http://identity.example.com/",
                Scopes = ["profile"],
                AllowedSubjects = [" "]
            }
        });

        Assert.True(result.Failed);
        Assert.Contains("Authority", result.FailureMessage);
        Assert.Contains("ClientId", result.FailureMessage);
        Assert.Contains("ClientSecret", result.FailureMessage);
        Assert.Contains("Scopes", result.FailureMessage);
        Assert.Contains("AllowedSubjects", result.FailureMessage);
    }

    [Fact]
    public void Validate_WhenAllowedSubjectsAreEmpty_SucceedsForBootstrap()
    {
        var settings = CreateValidSettings();
        settings.OpenIdConnect.AllowedSubjects = [];

        var result = _validator.Validate(Options.DefaultName, settings);

        Assert.False(result.Failed);
    }

    [Theory]
    [InlineData("")]
    [InlineData("signin-oidc")]
    [InlineData("//signin-oidc")]
    [InlineData("/signin-oidc?returnUrl=/")]
    [InlineData("/signin-oidc#fragment")]
    public void Validate_WhenCallbackPathIsInvalid_Fails(string callbackPath)
    {
        var settings = CreateValidSettings();
        settings.OpenIdConnect.CallbackPath = callbackPath;

        var result = _validator.Validate(Options.DefaultName, settings);

        Assert.True(result.Failed);
        Assert.Contains("CallbackPath", result.FailureMessage);
    }

    private static AuthenticationSettings CreateValidSettings() =>
        new()
        {
            Provider = AuthenticationProvider.OpenIdConnect,
            OpenIdConnect = new OpenIdConnectAuthenticationSettings
            {
                Authority = "https://identity.example.com/",
                ClientId = "elf-admin",
                ClientSecret = "test-client-secret",
                AllowedSubjects = ["allowed-subject"]
            }
        };
}
