using System.Text.RegularExpressions;

namespace Elf.Shared;

public static partial class IdentifierRules
{
    public const string AkaNamePattern = "^(?!-)[a-z0-9-]{1,32}(?<!-)$";
    public const string AkaNameRouteConstraint = @"regex(^(?!-)[[a-z0-9-]]{{1,32}}(?<!-)$)";

    public static bool IsValidAkaName(string akaName) =>
        !string.IsNullOrWhiteSpace(akaName) && AkaNameRegex().IsMatch(akaName);

    public static string NormalizeTagName(string tagName) => tagName?.Trim().ToLowerInvariant();

    [GeneratedRegex(AkaNamePattern, RegexOptions.CultureInvariant, "en-US")]
    private static partial Regex AkaNameRegex();
}
