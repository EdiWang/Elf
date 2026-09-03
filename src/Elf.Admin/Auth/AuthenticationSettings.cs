namespace Elf.Admin.Auth;

public class AuthenticationSettings
{
    public AuthenticationProvider Provider { get; set; } = AuthenticationProvider.Local;

    public LocalAuthenticationSettings Local { get; set; } = new();

    public TotpAuthenticationSettings Totp { get; set; } = new();

    public OpenIdConnectAuthenticationSettings OpenIdConnect { get; set; } = new();
}

public class LocalAuthenticationSettings
{
    public string BootstrapUsername { get; set; } = "admin";

    public string BootstrapPassword { get; set; } = string.Empty;
}

public class TotpAuthenticationSettings
{
    public bool Enabled { get; set; } = true;

    public string Issuer { get; set; } = "Elf";
}

public class OpenIdConnectAuthenticationSettings
{
    public string Authority { get; set; } = string.Empty;

    public string ClientId { get; set; } = string.Empty;

    public string ClientSecret { get; set; } = string.Empty;

    public string CallbackPath { get; set; } = "/signin-oidc";

    public string SignedOutCallbackPath { get; set; } = "/signout-callback-oidc";

    public string NameClaimType { get; set; } = "name";

    public string[] Scopes { get; set; } = ["openid", "profile", "email"];

    public string[] AllowedSubjects { get; set; } = [];
}
