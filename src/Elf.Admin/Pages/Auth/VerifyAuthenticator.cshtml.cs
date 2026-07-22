using Elf.Admin.Auth;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.Extensions.Options;
using System.ComponentModel.DataAnnotations;

namespace Elf.Admin.Pages.Auth;

[Authorize(AuthenticationSchemes = ElfAuthSchemes.LocalAccountTwoFactor)]
[EnableRateLimiting(ElfRateLimitPolicies.Auth)]
public class VerifyAuthenticatorModel(
    IOptions<AuthenticationSettings> authSettings,
    ILocalAccountStore localAccountStore,
    ILocalAccountTotpService totpService,
    ILogger<VerifyAuthenticatorModel> logger) : PageModel
{
    private readonly AuthenticationSettings _authenticationSettings = authSettings.Value;

    [BindProperty]
    [Required]
    [Display(Name = "Authenticator code")]
    [StringLength(6, MinimumLength = 6)]
    [RegularExpression("[0-9]{6}")]
    public string AuthenticatorCode { get; set; }

    public async Task<IActionResult> OnGetAsync()
    {
        if (_authenticationSettings.Provider != AuthenticationProvider.Local)
        {
            return RedirectToPage("/Index");
        }

        var account = await localAccountStore.GetAsync(HttpContext.RequestAborted);
        if (account is null || !account.IsTotpConfigured)
        {
            return RedirectToPage("/Auth/SignIn");
        }

        return Page();
    }

    public async Task<IActionResult> OnPostAsync()
    {
        if (_authenticationSettings.Provider != AuthenticationProvider.Local)
        {
            return RedirectToPage("/Index");
        }

        var account = await localAccountStore.GetAsync(HttpContext.RequestAborted);
        if (account is null || !account.IsTotpConfigured)
        {
            return RedirectToPage("/Auth/SignIn");
        }

        if (!ModelState.IsValid)
        {
            Response.StatusCode = StatusCodes.Status400BadRequest;
            return Page();
        }

        if (!totpService.VerifyCode(account.TotpSecret, AuthenticatorCode))
        {
            ModelState.AddModelError(nameof(AuthenticatorCode), "Invalid authenticator code.");
            return Page();
        }

        await HttpContext.SignOutAsync(ElfAuthSchemes.LocalAccountTwoFactor);
        await SignInAdminAsync(account.Username);

        logger.LogInformation("Authentication success for local account '{Username}'", account.Username);

        return RedirectToPage("/Index");
    }

    private async Task SignInAdminAsync(string username)
    {
        var principal = LocalAccountPrincipalFactory.Create(username, CookieAuthenticationDefaults.AuthenticationScheme);
        await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, principal);
    }
}
