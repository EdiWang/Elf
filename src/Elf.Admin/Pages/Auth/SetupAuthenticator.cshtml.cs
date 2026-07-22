using Elf.Admin.Auth;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Options;
using QRCoder;
using System.ComponentModel.DataAnnotations;

namespace Elf.Admin.Pages.Auth;

[Authorize(AuthenticationSchemes = ElfAuthSchemes.LocalAccountSetup)]
public class SetupAuthenticatorModel(
    IOptions<AuthenticationSettings> authSettings,
    ILocalAccountStore localAccountStore,
    ILocalAccountTotpService totpService,
    ILogger<SetupAuthenticatorModel> logger) : PageModel
{
    private readonly AuthenticationSettings _authenticationSettings = authSettings.Value;

    public string SetupKey { get; private set; }

    public string QrCodeImageUri { get; private set; }

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
        if (account is null)
        {
            return RedirectToPage("/Auth/SignIn");
        }

        if (account.IsTotpConfigured)
        {
            return RedirectToPage("/Auth/SignIn");
        }

        await EnsureTotpSecretAsync(account);
        BuildAuthenticatorDisplay(account);

        return Page();
    }

    public async Task<IActionResult> OnPostAsync()
    {
        if (_authenticationSettings.Provider != AuthenticationProvider.Local)
        {
            return RedirectToPage("/Index");
        }

        var account = await localAccountStore.GetAsync(HttpContext.RequestAborted);
        if (account is null || account.IsTotpConfigured)
        {
            return RedirectToPage("/Auth/SignIn");
        }

        await EnsureTotpSecretAsync(account);

        if (!ModelState.IsValid)
        {
            BuildAuthenticatorDisplay(account);
            Response.StatusCode = StatusCodes.Status400BadRequest;
            return Page();
        }

        if (!totpService.VerifyCode(account.TotpSecret, AuthenticatorCode))
        {
            ModelState.AddModelError(nameof(AuthenticatorCode), "Invalid authenticator code.");
            BuildAuthenticatorDisplay(account);
            return Page();
        }

        account.IsTotpEnabled = true;
        await localAccountStore.SaveAsync(account, HttpContext.RequestAborted);
        await HttpContext.SignOutAsync(ElfAuthSchemes.LocalAccountSetup);
        await SignInAdminAsync(account.Username);

        logger.LogInformation("TOTP authenticator setup completed for local account '{Username}'", account.Username);

        return RedirectToPage("/Index");
    }

    private async Task EnsureTotpSecretAsync(LocalAccountSettings account)
    {
        if (!string.IsNullOrWhiteSpace(account.TotpSecret))
        {
            return;
        }

        account.TotpSecret = totpService.GenerateSecret();
        account.IsTotpEnabled = false;
        await localAccountStore.SaveAsync(account, HttpContext.RequestAborted);
    }

    private void BuildAuthenticatorDisplay(LocalAccountSettings account)
    {
        SetupKey = account.TotpSecret;
        var issuer = _authenticationSettings.Totp.Issuer;
        var authenticatorUri = totpService.BuildAuthenticatorUri(issuer, account.Username, account.TotpSecret);
        QrCodeImageUri = CreateQrCodeImageUri(authenticatorUri);
    }

    private async Task SignInAdminAsync(string username)
    {
        var principal = LocalAccountPrincipalFactory.Create(username, CookieAuthenticationDefaults.AuthenticationScheme);
        await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, principal);
    }

    private static string CreateQrCodeImageUri(string authenticatorUri)
    {
        using var qrGenerator = new QRCodeGenerator();
        using var qrCodeData = qrGenerator.CreateQrCode(authenticatorUri, QRCodeGenerator.ECCLevel.Q);
        var qrCode = new PngByteQRCode(qrCodeData);
        var qrCodeBytes = qrCode.GetGraphic(8);

        return $"data:image/png;base64,{Convert.ToBase64String(qrCodeBytes)}";
    }
}
