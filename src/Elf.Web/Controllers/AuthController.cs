using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Elf.Web.Controllers;

public class AuthController : ControllerBase
{
    [HttpGet]
    [AllowAnonymous]
    public IActionResult SignIn()
    {
        var redirectUrl = Url.Page("/Admin");
        return Challenge(
            new AuthenticationProperties { RedirectUri = redirectUrl },
            OpenIdConnectDefaults.AuthenticationScheme);
    }

    [HttpGet]
    public IActionResult SignOut(int nounce = 1055)
    {
        var callbackUrl = Url.Action(nameof(SignedOut), "Auth", values: null, protocol: Request.Scheme);
        return SignOut(
            new AuthenticationProperties { RedirectUri = callbackUrl },
            CookieAuthenticationDefaults.AuthenticationScheme,
            OpenIdConnectDefaults.AuthenticationScheme);
    }

    [HttpGet]
    [AllowAnonymous]
    public IActionResult SignedOut()
    {
        return Redirect("/");
    }
}
