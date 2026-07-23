namespace Elf.Admin.Auth;

public class AuthenticationSettings
{
    public AuthenticationProvider Provider { get; set; } = AuthenticationProvider.Local;

    public LocalAuthenticationSettings Local { get; set; } = new();

    public TotpAuthenticationSettings Totp { get; set; } = new();

    public EntraIdAuthenticationSettings EntraID { get; set; } = new();
}

public class LocalAuthenticationSettings
{
    public string BootstrapUsername { get; set; } = "admin";

    public string BootstrapPassword { get; set; } = string.Empty;
}

public class TotpAuthenticationSettings
{
    public string Issuer { get; set; } = "Elf";
}

public class EntraIdAuthenticationSettings
{
    public string Instance { get; set; } = "https://login.microsoftonline.com/";

    public string TenantId { get; set; } = string.Empty;

    public string ClientId { get; set; } = string.Empty;

    public string ClientSecret { get; set; } = string.Empty;

    public string CallbackPath { get; set; } = "/signin-oidc";

    public string[] AllowedUsers { get; set; } = [];
}
