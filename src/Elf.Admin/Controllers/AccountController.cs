using Elf.Admin.Auth;
using Elf.Admin.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace Elf.Admin.Controllers;

[ApiController]
[Route("api/account")]
public class AccountController(
    IOptions<AuthenticationSettings> authSettings,
    ILocalAccountStore localAccountStore,
    ILocalAccountPasswordService passwordService,
    ILogger<AccountController> logger) : ControllerBase
{
    private readonly AuthenticationSettings _authenticationSettings = authSettings.Value;

    [HttpGet]
    [ProducesResponseType<LocalAccountProfile>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Get(CancellationToken ct)
    {
        var providerCheck = EnsureLocalProvider();
        if (providerCheck is not null) return providerCheck;

        var account = await localAccountStore.GetAsync(ct);
        if (account is null) return NotFound("Local account is not initialized.");

        return Ok(new LocalAccountProfile
        {
            Username = account.Username,
            IsTotpConfigured = account.IsTotpConfigured
        });
    }

    [HttpPut]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(UpdateLocalAccountRequest request, CancellationToken ct)
    {
        var providerCheck = EnsureLocalProvider();
        if (providerCheck is not null) return providerCheck;

        var account = await localAccountStore.GetAsync(ct);
        if (account is null) return NotFound("Local account is not initialized.");

        if (!passwordService.VerifyPassword(account, request.CurrentPassword))
        {
            logger.LogWarning("Local account update rejected because current password verification failed.");
            return BadRequest("Current password is invalid.");
        }

        account.Username = request.Username.Trim();
        if (!string.IsNullOrWhiteSpace(request.NewPassword))
        {
            account.PasswordHash = passwordService.HashPassword(account, request.NewPassword);
        }

        await localAccountStore.SaveAsync(account, ct);
        await SignInLocalAccountAsync(account.Username);

        logger.LogInformation("Local account settings updated for '{Username}'.", account.Username);
        return NoContent();
    }

    [HttpPost("reset-authenticator")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> ResetAuthenticator(ResetLocalAuthenticatorRequest request, CancellationToken ct)
    {
        var providerCheck = EnsureLocalProvider();
        if (providerCheck is not null) return providerCheck;

        var account = await localAccountStore.GetAsync(ct);
        if (account is null) return NotFound("Local account is not initialized.");

        if (!passwordService.VerifyPassword(account, request.CurrentPassword))
        {
            logger.LogWarning("Local account authenticator reset rejected because current password verification failed.");
            return BadRequest("Current password is invalid.");
        }

        account.TotpSecret = string.Empty;
        account.IsTotpEnabled = false;
        await localAccountStore.SaveAsync(account, ct);

        await SignOutLocalCookiesAsync();

        logger.LogInformation("Local account authenticator was reset for '{Username}'.", account.Username);
        return NoContent();
    }

    private IActionResult EnsureLocalProvider() =>
        _authenticationSettings.Provider == AuthenticationProvider.Local
            ? null
            : NotFound("Local account management is not available.");

    private async Task SignInLocalAccountAsync(string username)
    {
        var principal = LocalAccountPrincipalFactory.Create(username, CookieAuthenticationDefaults.AuthenticationScheme);
        await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, principal);
    }

    private async Task SignOutLocalCookiesAsync()
    {
        await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        await HttpContext.SignOutAsync(ElfAuthSchemes.LocalAccountSetup);
        await HttpContext.SignOutAsync(ElfAuthSchemes.LocalAccountTwoFactor);
    }
}
