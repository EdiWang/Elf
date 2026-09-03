using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;

namespace Elf.Admin.Auth;

public static class ElfAuthSchemes
{
    public const string OpenIdConnect = OpenIdConnectDefaults.AuthenticationScheme;
    public const string Local = CookieAuthenticationDefaults.AuthenticationScheme;
    public const string LocalAccountSetup = "ElfLocalAccountSetup";
    public const string LocalAccountTwoFactor = "ElfLocalAccountTwoFactor";
}
