using System.Security.Claims;

namespace Elf.Admin.Auth;

public static class LocalAccountPrincipalFactory
{
    public static ClaimsPrincipal Create(string username, string authenticationType)
    {
        var claims = new List<Claim>
        {
            new(ClaimTypes.Name, username),
            new(ClaimTypes.Role, "Administrator")
        };

        return new ClaimsPrincipal(new ClaimsIdentity(claims, authenticationType));
    }
}
