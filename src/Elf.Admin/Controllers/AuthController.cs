using Elf.Admin.Auth;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace Elf.Admin.Controllers;

[Route("auth")]
public class AuthController(IOptions<AuthenticationSettings> authSettings) : ControllerBase
{
    private readonly AuthenticationSettings _authenticationSettings = authSettings.Value;

    [HttpGet("signout")]
    public async Task<IActionResult> SignOutAsync()
    {
        switch (_authenticationSettings.Provider)
        {
            case AuthenticationProvider.EntraID:
                return SignOut(
                    new AuthenticationProperties { RedirectUri = "/" },
                    CookieAuthenticationDefaults.AuthenticationScheme,
                    OpenIdConnectDefaults.AuthenticationScheme);
            case AuthenticationProvider.Local:
                await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
                await HttpContext.SignOutAsync(ElfAuthSchemes.LocalAccountSetup);
                await HttpContext.SignOutAsync(ElfAuthSchemes.LocalAccountTwoFactor);
                return RedirectToPage("/Index");
            case AuthenticationProvider.External:
                return RedirectToPage("/Index");
            default:
                return RedirectToPage("/Index");
        }
    }

    [AllowAnonymous]
    [HttpGet("accessdenied")]
    [HttpGet("/account/accessdenied")]
    public IActionResult AccessDenied()
    {
        Response.StatusCode = StatusCodes.Status403Forbidden;
        return Content("Access Denied");
    }

    [Authorize]
    [HttpGet("me")]
    public IActionResult Me()
    {
        return Ok(new { UserName = User.Identity?.Name ?? "Anonymous" });
    }
}
