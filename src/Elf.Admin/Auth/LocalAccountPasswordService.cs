using Microsoft.AspNetCore.Identity;

namespace Elf.Admin.Auth;

public interface ILocalAccountPasswordService
{
    string HashPassword(LocalAccountSettings account, string password);

    bool VerifyPassword(LocalAccountSettings account, string password);
}

public class LocalAccountPasswordService : ILocalAccountPasswordService
{
    private readonly PasswordHasher<LocalAccountSettings> _passwordHasher = new();

    public string HashPassword(LocalAccountSettings account, string password)
    {
        ArgumentNullException.ThrowIfNull(account);
        ArgumentException.ThrowIfNullOrWhiteSpace(password);

        return _passwordHasher.HashPassword(account, password);
    }

    public bool VerifyPassword(LocalAccountSettings account, string password)
    {
        if (account is null ||
            string.IsNullOrWhiteSpace(account.PasswordHash) ||
            string.IsNullOrWhiteSpace(password))
        {
            return false;
        }

        var result = _passwordHasher.VerifyHashedPassword(
            account,
            account.PasswordHash,
            password);

        return result is PasswordVerificationResult.Success or PasswordVerificationResult.SuccessRehashNeeded;
    }
}
