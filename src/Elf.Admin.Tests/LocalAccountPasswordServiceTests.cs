using Elf.Admin.Auth;

namespace Elf.Admin.Tests;

public class LocalAccountPasswordServiceTests
{
    [Fact]
    public void HashPassword_CreatesHashThatCanBeVerified()
    {
        var service = new LocalAccountPasswordService();
        var account = new LocalAccountSettings { Username = "admin" };

        account.PasswordHash = service.HashPassword(account, "Password1!");

        Assert.NotEqual("Password1!", account.PasswordHash);
        Assert.True(service.VerifyPassword(account, "Password1!"));
    }

    [Fact]
    public void VerifyPassword_WhenPasswordDoesNotMatch_ReturnsFalse()
    {
        var service = new LocalAccountPasswordService();
        var account = new LocalAccountSettings { Username = "admin" };
        account.PasswordHash = service.HashPassword(account, "Password1!");

        Assert.False(service.VerifyPassword(account, "Password2!"));
    }

    [Fact]
    public void VerifyPassword_WhenHashOrPasswordIsMissing_ReturnsFalse()
    {
        var service = new LocalAccountPasswordService();
        var account = new LocalAccountSettings { Username = "admin" };

        Assert.False(service.VerifyPassword(account, "Password1!"));
        Assert.False(service.VerifyPassword(account, string.Empty));
    }
}
