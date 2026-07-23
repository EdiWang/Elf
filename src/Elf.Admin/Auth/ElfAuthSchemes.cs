using Microsoft.AspNetCore.Authentication.Cookies;

namespace Elf.Admin.Auth;

public static class ElfAuthSchemes
{
    public const string EntraID = CookieAuthenticationDefaults.AuthenticationScheme;
    public const string Local = CookieAuthenticationDefaults.AuthenticationScheme;
    public const string LocalAccountSetup = "ElfLocalAccountSetup";
    public const string LocalAccountTwoFactor = "ElfLocalAccountTwoFactor";
}
