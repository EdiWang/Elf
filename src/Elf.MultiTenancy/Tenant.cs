namespace Elf.MultiTenancy;

/// <summary>
/// Tenant information
/// </summary>
public class Tenant
{
    /// <summary>
    /// The tenant Id
    /// </summary>
    public Guid Id { get; set; }

    /// <summary>
    /// The tenant identifier
    /// </summary>
    public string Identifier { get; set; }

    public bool IsDefault { get; set; }

    /// <summary>
    /// Tenant items
    /// </summary>
    public Dictionary<string, string> Items { get; set; } = new();
}
