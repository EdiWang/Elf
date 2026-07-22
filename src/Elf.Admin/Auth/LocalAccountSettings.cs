using System.Text.Json.Serialization;

namespace Elf.Admin.Auth;

public class LocalAccountSettings
{
    public string Username { get; set; } = string.Empty;

    public string PasswordHash { get; set; } = string.Empty;

    public string TotpSecret { get; set; } = string.Empty;

    public bool IsTotpEnabled { get; set; }

    [JsonIgnore]
    public bool IsTotpConfigured =>
        IsTotpEnabled && !string.IsNullOrWhiteSpace(TotpSecret);
}
