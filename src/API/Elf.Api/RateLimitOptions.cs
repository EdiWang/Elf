namespace Elf.Api;

public class RateLimitOptions
{
    public const string RateLimit = "RateLimit";
    public bool AutoReplenishment { get; set; }
    public int PermitLimit { get; set; }
    public int WindowSeconds { get; set; }
    public int QueueLimit { get; set; }
}