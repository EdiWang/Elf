using System.Security.Claims;

namespace Elf.Admin.Auth;

public static class ElfAuthorizationPolicies
{
    public const string Admin = "ElfAdmin";

    public static bool IsAllowedEntraUser(ClaimsPrincipal user, IReadOnlyCollection<string> allowedUsers)
    {
        if (allowedUsers.Count == 0)
        {
            return true;
        }

        var candidates = new[]
            {
                user.Identity?.Name,
                user.FindFirstValue(ClaimTypes.Email),
                user.FindFirstValue(ClaimTypes.Upn),
                user.FindFirstValue("preferred_username")
            }
            .Where(value => !string.IsNullOrWhiteSpace(value));

        return candidates.Any(candidate =>
            allowedUsers.Contains(candidate, StringComparer.OrdinalIgnoreCase));
    }
}
