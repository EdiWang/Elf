using Elf.Admin.Auth;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
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
            case AuthenticationProvider.OpenIdConnect:
                return SignOut(
                    new AuthenticationProperties { RedirectUri = Request.PathBase.Add(new PathString("/")).Value },
                    CookieAuthenticationDefaults.AuthenticationScheme,
                    ElfAuthSchemes.OpenIdConnect);
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

    [Authorize(Policy = ElfAuthorizationPolicies.Admin)]
    [HttpGet("me")]
    public IActionResult Me()
    {
        return Ok(new { UserName = User.Identity?.Name ?? "Anonymous" });
    }

    [Authorize]
    [HttpGet("identity")]
    public IActionResult Identity()
    {
        if (_authenticationSettings.Provider != AuthenticationProvider.OpenIdConnect)
        {
            return NotFound();
        }

        var subjectClaim = User.FindFirst("sub");
        var issuer = User.FindFirst("iss")?.Value ?? subjectClaim?.Issuer;
        var subject = subjectClaim?.Value;

        if (string.IsNullOrWhiteSpace(issuer) || string.IsNullOrWhiteSpace(subject))
        {
            return StatusCode(
                StatusCodes.Status500InternalServerError,
                new ProblemDetails
                {
                    Status = StatusCodes.Status500InternalServerError,
                    Detail = "The OpenID Connect identity is missing its required issuer or subject claim."
                });
        }

        return Ok(new
        {
            Issuer = issuer,
            Subject = subject,
            DisplayName = User.Identity?.Name ?? string.Empty
        });
    }
}
