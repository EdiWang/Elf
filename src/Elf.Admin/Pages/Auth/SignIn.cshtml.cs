using Elf.Admin.Auth;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.Extensions.Options;
using System.ComponentModel.DataAnnotations;

namespace Elf.Admin.Pages.Auth;

[AllowAnonymous]
[EnableRateLimiting(ElfRateLimitPolicies.Auth)]
public class SignInModel(
    IOptions<AuthenticationSettings> authSettings,
    ILocalAccountStore localAccountStore,
    ILocalAccountPasswordService passwordService,
    ILogger<SignInModel> logger) : PageModel
{
    private readonly AuthenticationSettings _authenticationSettings = authSettings.Value;

    [BindProperty]
    [Required]
    [Display(Name = "Username")]
    [MinLength(2)]
    [MaxLength(64)]
    public string Username { get; set; }

    [BindProperty]
    [Required]
    [Display(Name = "Password")]
    [DataType(DataType.Password)]
    [MinLength(8)]
    [MaxLength(128)]
    public string Password { get; set; }

    public async Task<IActionResult> OnGetAsync()
    {
        switch (_authenticationSettings.Provider)
        {
            case AuthenticationProvider.EntraID:
                return Challenge(
                    new AuthenticationProperties { RedirectUri = "/" },
                    OpenIdConnectDefaults.AuthenticationScheme);
            case AuthenticationProvider.Local:
                await SignOutLocalCookiesAsync();
                return Page();
            case AuthenticationProvider.External:
                return RedirectToPage("/Index");
            default:
                Response.StatusCode = StatusCodes.Status501NotImplemented;
                return Content("Invalid AuthenticationProvider, please check system settings.");
        }
    }

    public async Task<IActionResult> OnPostAsync()
    {
        switch (_authenticationSettings.Provider)
        {
            case AuthenticationProvider.Local:
                break;
            case AuthenticationProvider.EntraID:
                return Challenge(
                    new AuthenticationProperties { RedirectUri = "/" },
                    OpenIdConnectDefaults.AuthenticationScheme);
            case AuthenticationProvider.External:
                return RedirectToPage("/Index");
            default:
                Response.StatusCode = StatusCodes.Status501NotImplemented;
                return Content("Invalid AuthenticationProvider, please check system settings.");
        }

        if (string.IsNullOrWhiteSpace(Request.Headers.UserAgent.ToString()))
        {
            return Unauthorized();
        }

        if (!ModelState.IsValid)
        {
            Response.StatusCode = StatusCodes.Status400BadRequest;
            return Page();
        }

        var account = await localAccountStore.GetOrCreateAsync(HttpContext.RequestAborted);
        if (account is null)
        {
            logger.LogWarning("Local account sign-in failed because the account is not initialized.");
            ModelState.AddModelError(string.Empty, "Local account is not initialized.");
            return Page();
        }

        if (!string.Equals(account.Username, Username?.Trim(), StringComparison.Ordinal) ||
            !passwordService.VerifyPassword(account, Password))
        {
            logger.LogWarning("Login failed for local account '{Username}'", Username);
            ModelState.AddModelError(string.Empty, "Invalid login attempt.");
            return Page();
        }

        if (!account.IsTotpConfigured)
        {
            await HttpContext.SignOutAsync(ElfAuthSchemes.LocalAccountTwoFactor);
            await SignInSetupAsync(account.Username);
            return RedirectToPage("/Auth/SetupAuthenticator");
        }

        await HttpContext.SignOutAsync(ElfAuthSchemes.LocalAccountSetup);
        await SignInTwoFactorAsync(account.Username);
        return RedirectToPage("/Auth/VerifyAuthenticator");
    }

    private async Task SignOutLocalCookiesAsync()
    {
        await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        await HttpContext.SignOutAsync(ElfAuthSchemes.LocalAccountSetup);
        await HttpContext.SignOutAsync(ElfAuthSchemes.LocalAccountTwoFactor);
    }

    private async Task SignInSetupAsync(string username)
    {
        var principal = LocalAccountPrincipalFactory.Create(username, ElfAuthSchemes.LocalAccountSetup);
        await HttpContext.SignInAsync(ElfAuthSchemes.LocalAccountSetup, principal);
    }

    private async Task SignInTwoFactorAsync(string username)
    {
        var principal = LocalAccountPrincipalFactory.Create(username, ElfAuthSchemes.LocalAccountTwoFactor);
        await HttpContext.SignInAsync(ElfAuthSchemes.LocalAccountTwoFactor, principal);
    }
}
