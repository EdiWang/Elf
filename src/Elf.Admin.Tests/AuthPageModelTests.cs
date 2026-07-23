using Elf.Admin.Auth;
using Elf.Admin.Controllers;
using Elf.Admin.Models;
using Elf.Admin.Pages;
using Elf.Admin.Pages.Auth;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.Extensions.Options;
using Moq;
using System.Security.Claims;

namespace Elf.Admin.Tests;

public class AuthPageModelTests
{
    [Fact]
    public async Task SignIn_OnPostAsync_WhenPasswordIsValidAndTotpIsMissing_RedirectsToSetup()
    {
        var passwordService = new LocalAccountPasswordService();
        var account = CreateAccount(passwordService, isTotpEnabled: false);
        var authenticationService = CreateAuthenticationService();
        var model = CreateSignInModel(
            new FakeLocalAccountStore(account),
            passwordService,
            authenticationService);
        model.Username = account.Username;
        model.Password = ValidPassword;

        var result = await model.OnPostAsync();

        var redirect = Assert.IsType<RedirectToPageResult>(result);
        Assert.Equal("/Auth/SetupAuthenticator", redirect.PageName);
        authenticationService.Verify(x => x.SignOutAsync(
            model.HttpContext,
            ElfAuthSchemes.LocalAccountTwoFactor,
            null), Times.Once);
        authenticationService.Verify(x => x.SignInAsync(
            model.HttpContext,
            ElfAuthSchemes.LocalAccountSetup,
            It.Is<ClaimsPrincipal>(p => p.Identity!.Name == account.Username),
            It.IsAny<AuthenticationProperties>()), Times.Once);
    }

    [Fact]
    public async Task SignIn_OnPostAsync_WhenPasswordIsValidAndTotpIsConfigured_RedirectsToVerify()
    {
        var passwordService = new LocalAccountPasswordService();
        var account = CreateAccount(passwordService, isTotpEnabled: true);
        var authenticationService = CreateAuthenticationService();
        var model = CreateSignInModel(
            new FakeLocalAccountStore(account),
            passwordService,
            authenticationService);
        model.Username = account.Username;
        model.Password = ValidPassword;

        var result = await model.OnPostAsync();

        var redirect = Assert.IsType<RedirectToPageResult>(result);
        Assert.Equal("/Auth/VerifyAuthenticator", redirect.PageName);
        authenticationService.Verify(x => x.SignOutAsync(
            model.HttpContext,
            ElfAuthSchemes.LocalAccountSetup,
            null), Times.Once);
        authenticationService.Verify(x => x.SignInAsync(
            model.HttpContext,
            ElfAuthSchemes.LocalAccountTwoFactor,
            It.Is<ClaimsPrincipal>(p => p.Identity!.Name == account.Username),
            It.IsAny<AuthenticationProperties>()), Times.Once);
    }

    [Fact]
    public async Task SignIn_OnPostAsync_WhenPasswordIsInvalid_ReturnsPageWithoutSignIn()
    {
        var passwordService = new LocalAccountPasswordService();
        var account = CreateAccount(passwordService, isTotpEnabled: true);
        var authenticationService = CreateAuthenticationService();
        var model = CreateSignInModel(
            new FakeLocalAccountStore(account),
            passwordService,
            authenticationService);
        model.Username = account.Username;
        model.Password = "WrongPassword1!";

        var result = await model.OnPostAsync();

        Assert.IsType<PageResult>(result);
        Assert.False(model.ModelState.IsValid);
        authenticationService.Verify(x => x.SignInAsync(
            It.IsAny<HttpContext>(),
            It.IsAny<string>(),
            It.IsAny<ClaimsPrincipal>(),
            It.IsAny<AuthenticationProperties>()), Times.Never);
    }

    [Fact]
    public async Task SignIn_OnGetAsync_WhenProviderIsEntraId_ReturnsOpenIdConnectChallenge()
    {
        var model = CreateSignInModel(
            new FakeLocalAccountStore(null),
            new LocalAccountPasswordService(),
            CreateAuthenticationService(),
            new AuthenticationSettings { Provider = AuthenticationProvider.EntraID });

        var result = await model.OnGetAsync();

        var challenge = Assert.IsType<ChallengeResult>(result);
        Assert.Contains(OpenIdConnectDefaults.AuthenticationScheme, challenge.AuthenticationSchemes);
    }

    [Fact]
    public async Task SetupAuthenticator_OnGetAsync_WhenSecretIsMissing_GeneratesAndStoresSecret()
    {
        var account = new LocalAccountSettings { Username = "admin", PasswordHash = "hash" };
        var store = new FakeLocalAccountStore(account);
        var model = CreateSetupAuthenticatorModel(store, new FakeTotpService
        {
            GeneratedSecret = "ABCDEF234567"
        });

        var result = await model.OnGetAsync();

        Assert.IsType<PageResult>(result);
        Assert.Equal("ABCDEF234567", account.TotpSecret);
        Assert.False(account.IsTotpEnabled);
        Assert.Equal(1, store.SaveCount);
        Assert.StartsWith("data:image/png;base64,", model.QrCodeImageUri);
        Assert.Equal("ABCDEF234567", model.SetupKey);
    }

    [Fact]
    public async Task SetupAuthenticator_OnPostAsync_WhenCodeIsValid_EnablesTotpAndSignsInAdmin()
    {
        var account = new LocalAccountSettings
        {
            Username = "admin",
            PasswordHash = "hash",
            TotpSecret = "ABCDEF234567"
        };
        var store = new FakeLocalAccountStore(account);
        var authenticationService = CreateAuthenticationService();
        var model = CreateSetupAuthenticatorModel(
            store,
            new FakeTotpService { VerifyResult = true },
            authenticationService);
        model.AuthenticatorCode = "123456";

        var result = await model.OnPostAsync();

        var redirect = Assert.IsType<RedirectToPageResult>(result);
        Assert.Equal("/Index", redirect.PageName);
        Assert.True(account.IsTotpEnabled);
        Assert.Equal(1, store.SaveCount);
        authenticationService.Verify(x => x.SignOutAsync(
            model.HttpContext,
            ElfAuthSchemes.LocalAccountSetup,
            null), Times.Once);
        authenticationService.Verify(x => x.SignInAsync(
            model.HttpContext,
            CookieAuthenticationDefaults.AuthenticationScheme,
            It.Is<ClaimsPrincipal>(p => p.Identity!.Name == account.Username),
            It.IsAny<AuthenticationProperties>()), Times.Once);
    }

    [Fact]
    public async Task VerifyAuthenticator_OnPostAsync_WhenCodeIsValid_SignsInAdmin()
    {
        var account = new LocalAccountSettings
        {
            Username = "admin",
            PasswordHash = "hash",
            TotpSecret = "ABCDEF234567",
            IsTotpEnabled = true
        };
        var authenticationService = CreateAuthenticationService();
        var model = CreateVerifyAuthenticatorModel(
            new FakeLocalAccountStore(account),
            new FakeTotpService { VerifyResult = true },
            authenticationService);
        model.AuthenticatorCode = "123456";

        var result = await model.OnPostAsync();

        var redirect = Assert.IsType<RedirectToPageResult>(result);
        Assert.Equal("/Index", redirect.PageName);
        authenticationService.Verify(x => x.SignOutAsync(
            model.HttpContext,
            ElfAuthSchemes.LocalAccountTwoFactor,
            null), Times.Once);
        authenticationService.Verify(x => x.SignInAsync(
            model.HttpContext,
            CookieAuthenticationDefaults.AuthenticationScheme,
            It.Is<ClaimsPrincipal>(p => p.Identity!.Name == account.Username),
            It.IsAny<AuthenticationProperties>()), Times.Once);
    }

    [Fact]
    public async Task AuthController_SignOutAsync_WhenProviderIsLocal_SignsOutAllLocalCookies()
    {
        var authenticationService = CreateAuthenticationService();
        var controller = CreateAuthController(
            new AuthenticationSettings { Provider = AuthenticationProvider.Local },
            authenticationService);

        var result = await controller.SignOutAsync();

        Assert.IsType<RedirectToPageResult>(result);
        authenticationService.Verify(x => x.SignOutAsync(
            controller.HttpContext,
            CookieAuthenticationDefaults.AuthenticationScheme,
            null), Times.Once);
        authenticationService.Verify(x => x.SignOutAsync(
            controller.HttpContext,
            ElfAuthSchemes.LocalAccountSetup,
            null), Times.Once);
        authenticationService.Verify(x => x.SignOutAsync(
            controller.HttpContext,
            ElfAuthSchemes.LocalAccountTwoFactor,
            null), Times.Once);
    }

    [Fact]
    public async Task AuthController_SignOutAsync_WhenProviderIsEntraId_ReturnsSignOutResult()
    {
        var controller = CreateAuthController(new AuthenticationSettings { Provider = AuthenticationProvider.EntraID });

        var result = await controller.SignOutAsync();

        var signOut = Assert.IsType<SignOutResult>(result);
        Assert.Equal(
            [CookieAuthenticationDefaults.AuthenticationScheme, OpenIdConnectDefaults.AuthenticationScheme],
            signOut.AuthenticationSchemes);
    }

    [Fact]
    public async Task AccountController_Get_WhenProviderIsLocal_ReturnsProfile()
    {
        var passwordService = new LocalAccountPasswordService();
        var account = CreateAccount(passwordService, isTotpEnabled: true);
        var controller = CreateAccountController(
            new AuthenticationSettings { Provider = AuthenticationProvider.Local },
            new FakeLocalAccountStore(account),
            passwordService);

        var result = await controller.Get(TestContext.Current.CancellationToken);

        var ok = Assert.IsType<OkObjectResult>(result);
        var profile = Assert.IsType<LocalAccountProfile>(ok.Value);
        Assert.Equal("admin", profile.Username);
        Assert.True(profile.IsTotpConfigured);
    }

    [Fact]
    public async Task AccountController_Update_WhenCurrentPasswordIsValid_UpdatesAccountAndRefreshesCookie()
    {
        var passwordService = new LocalAccountPasswordService();
        var account = CreateAccount(passwordService, isTotpEnabled: true);
        var store = new FakeLocalAccountStore(account);
        var authenticationService = CreateAuthenticationService();
        var controller = CreateAccountController(
            new AuthenticationSettings { Provider = AuthenticationProvider.Local },
            store,
            passwordService,
            authenticationService);

        var result = await controller.Update(new UpdateLocalAccountRequest
        {
            Username = "owner",
            CurrentPassword = ValidPassword,
            NewPassword = "NewPassword1!"
        }, TestContext.Current.CancellationToken);

        Assert.IsType<NoContentResult>(result);
        Assert.Equal("owner", account.Username);
        Assert.True(passwordService.VerifyPassword(account, "NewPassword1!"));
        Assert.False(passwordService.VerifyPassword(account, ValidPassword));
        Assert.Equal(1, store.SaveCount);
        authenticationService.Verify(x => x.SignInAsync(
            controller.HttpContext,
            CookieAuthenticationDefaults.AuthenticationScheme,
            It.Is<ClaimsPrincipal>(p => p.Identity!.Name == "owner"),
            It.IsAny<AuthenticationProperties>()), Times.Once);
    }

    [Fact]
    public async Task AccountController_Update_WhenCurrentPasswordIsInvalid_ReturnsBadRequest()
    {
        var passwordService = new LocalAccountPasswordService();
        var account = CreateAccount(passwordService, isTotpEnabled: true);
        var store = new FakeLocalAccountStore(account);
        var authenticationService = CreateAuthenticationService();
        var controller = CreateAccountController(
            new AuthenticationSettings { Provider = AuthenticationProvider.Local },
            store,
            passwordService,
            authenticationService);

        var result = await controller.Update(new UpdateLocalAccountRequest
        {
            Username = "owner",
            CurrentPassword = "WrongPassword1!",
            NewPassword = "NewPassword1!"
        }, TestContext.Current.CancellationToken);

        var badRequest = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal("Current password is invalid.", badRequest.Value);
        Assert.Equal("admin", account.Username);
        Assert.Equal(0, store.SaveCount);
        authenticationService.Verify(x => x.SignInAsync(
            It.IsAny<HttpContext>(),
            It.IsAny<string>(),
            It.IsAny<ClaimsPrincipal>(),
            It.IsAny<AuthenticationProperties>()), Times.Never);
    }

    [Fact]
    public async Task AccountController_ResetAuthenticator_WhenCurrentPasswordIsValid_ClearsTotpAndSignsOut()
    {
        var passwordService = new LocalAccountPasswordService();
        var account = CreateAccount(passwordService, isTotpEnabled: true);
        var store = new FakeLocalAccountStore(account);
        var authenticationService = CreateAuthenticationService();
        var controller = CreateAccountController(
            new AuthenticationSettings { Provider = AuthenticationProvider.Local },
            store,
            passwordService,
            authenticationService);

        var result = await controller.ResetAuthenticator(new ResetLocalAuthenticatorRequest
        {
            CurrentPassword = ValidPassword
        }, TestContext.Current.CancellationToken);

        Assert.IsType<NoContentResult>(result);
        Assert.False(account.IsTotpEnabled);
        Assert.Empty(account.TotpSecret);
        Assert.Equal(1, store.SaveCount);
        authenticationService.Verify(x => x.SignOutAsync(
            controller.HttpContext,
            CookieAuthenticationDefaults.AuthenticationScheme,
            null), Times.Once);
        authenticationService.Verify(x => x.SignOutAsync(
            controller.HttpContext,
            ElfAuthSchemes.LocalAccountSetup,
            null), Times.Once);
        authenticationService.Verify(x => x.SignOutAsync(
            controller.HttpContext,
            ElfAuthSchemes.LocalAccountTwoFactor,
            null), Times.Once);
    }

    [Fact]
    public void Account_OnGet_WhenProviderIsNotLocal_ReturnsNotFound()
    {
        var model = new AccountModel(Options.Create(new AuthenticationSettings
        {
            Provider = AuthenticationProvider.EntraID
        }));

        var result = model.OnGet();

        Assert.IsType<NotFoundResult>(result);
    }

    [Fact]
    public void Account_OnGet_WhenProviderIsLocal_ReturnsPage()
    {
        var model = new AccountModel(Options.Create(new AuthenticationSettings
        {
            Provider = AuthenticationProvider.Local
        }));

        var result = model.OnGet();

        Assert.IsType<PageResult>(result);
    }

    private const string ValidPassword = "Password1!";

    private static LocalAccountSettings CreateAccount(
        ILocalAccountPasswordService passwordService,
        bool isTotpEnabled)
    {
        var account = new LocalAccountSettings
        {
            Username = "admin",
            TotpSecret = isTotpEnabled ? "ABCDEF234567" : string.Empty,
            IsTotpEnabled = isTotpEnabled
        };
        account.PasswordHash = passwordService.HashPassword(account, ValidPassword);

        return account;
    }

    private static SignInModel CreateSignInModel(
        ILocalAccountStore store,
        ILocalAccountPasswordService passwordService,
        Mock<IAuthenticationService> authenticationService,
        AuthenticationSettings authenticationSettings = null)
    {
        var model = new SignInModel(
            Options.Create(authenticationSettings ?? new AuthenticationSettings()),
            store,
            passwordService,
            NullLogger<SignInModel>.Instance);

        SetHttpContext(model, authenticationService);

        return model;
    }

    private static SetupAuthenticatorModel CreateSetupAuthenticatorModel(
        ILocalAccountStore store,
        ILocalAccountTotpService totpService,
        Mock<IAuthenticationService> authenticationService = null,
        AuthenticationSettings authenticationSettings = null)
    {
        var model = new SetupAuthenticatorModel(
            Options.Create(authenticationSettings ?? new AuthenticationSettings()),
            store,
            totpService,
            NullLogger<SetupAuthenticatorModel>.Instance);

        SetHttpContext(model, authenticationService ?? CreateAuthenticationService());

        return model;
    }

    private static VerifyAuthenticatorModel CreateVerifyAuthenticatorModel(
        ILocalAccountStore store,
        ILocalAccountTotpService totpService,
        Mock<IAuthenticationService> authenticationService = null,
        AuthenticationSettings authenticationSettings = null)
    {
        var model = new VerifyAuthenticatorModel(
            Options.Create(authenticationSettings ?? new AuthenticationSettings()),
            store,
            totpService,
            NullLogger<VerifyAuthenticatorModel>.Instance);

        SetHttpContext(model, authenticationService ?? CreateAuthenticationService());

        return model;
    }

    private static AuthController CreateAuthController(
        AuthenticationSettings authenticationSettings,
        Mock<IAuthenticationService> authenticationService = null)
    {
        var controller = new AuthController(Options.Create(authenticationSettings));
        var httpContext = CreateHttpContext(authenticationService ?? CreateAuthenticationService());
        controller.ControllerContext = new ControllerContext
        {
            HttpContext = httpContext
        };

        return controller;
    }

    private static AccountController CreateAccountController(
        AuthenticationSettings authenticationSettings,
        ILocalAccountStore localAccountStore,
        ILocalAccountPasswordService passwordService,
        Mock<IAuthenticationService> authenticationService = null)
    {
        var controller = new AccountController(
            Options.Create(authenticationSettings),
            localAccountStore,
            passwordService,
            NullLogger<AccountController>.Instance);
        var httpContext = CreateHttpContext(authenticationService ?? CreateAuthenticationService());
        controller.ControllerContext = new ControllerContext
        {
            HttpContext = httpContext
        };

        return controller;
    }

    private static void SetHttpContext(PageModel model, Mock<IAuthenticationService> authenticationService)
    {
        model.PageContext = new()
        {
            HttpContext = CreateHttpContext(authenticationService)
        };
    }

    private static DefaultHttpContext CreateHttpContext(Mock<IAuthenticationService> authenticationService)
    {
        var services = new ServiceCollection();
        services.AddSingleton(authenticationService.Object);

        var httpContext = new DefaultHttpContext
        {
            RequestServices = services.BuildServiceProvider()
        };
        httpContext.Request.Headers.UserAgent = "xunit";
        httpContext.Request.Scheme = "https";

        return httpContext;
    }

    private static Mock<IAuthenticationService> CreateAuthenticationService()
    {
        var authenticationService = new Mock<IAuthenticationService>();
        authenticationService
            .Setup(x => x.SignInAsync(
                It.IsAny<HttpContext>(),
                It.IsAny<string>(),
                It.IsAny<ClaimsPrincipal>(),
                It.IsAny<AuthenticationProperties>()))
            .Returns(Task.CompletedTask);
        authenticationService
            .Setup(x => x.SignOutAsync(
                It.IsAny<HttpContext>(),
                It.IsAny<string>(),
                It.IsAny<AuthenticationProperties>()))
            .Returns(Task.CompletedTask);

        return authenticationService;
    }

    private sealed class FakeLocalAccountStore(LocalAccountSettings account) : ILocalAccountStore
    {
        public int SaveCount { get; private set; }

        public Task<LocalAccountSettings> GetAsync(CancellationToken ct = default) =>
            Task.FromResult(account);

        public Task<LocalAccountSettings> GetOrCreateAsync(CancellationToken ct = default) =>
            Task.FromResult(account);

        public Task SaveAsync(LocalAccountSettings account, CancellationToken ct = default)
        {
            SaveCount++;
            return Task.CompletedTask;
        }
    }

    private sealed class FakeTotpService : ILocalAccountTotpService
    {
        public string GeneratedSecret { get; set; } = "ABCDEF234567";

        public bool VerifyResult { get; set; }

        public string GenerateSecret() => GeneratedSecret;

        public bool VerifyCode(string secret, string code) => VerifyResult;

        public string BuildAuthenticatorUri(string issuer, string accountName, string secret) =>
            $"otpauth://totp/{issuer}:{accountName}?secret={secret}&issuer={issuer}&digits=6&period=30";
    }
}
