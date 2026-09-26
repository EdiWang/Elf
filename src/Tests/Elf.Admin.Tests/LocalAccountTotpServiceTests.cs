using Elf.Admin.Auth;
using OtpNet;

namespace Elf.Admin.Tests;

public class LocalAccountTotpServiceTests
{
    [Fact]
    public void VerifyCode_WhenCodeIsCurrentTotp_ReturnsTrue()
    {
        var service = new LocalAccountTotpService();
        var secret = service.GenerateSecret();
        var totp = new Totp(Base32Encoding.ToBytes(secret), step: 30, mode: OtpHashMode.Sha1, totpSize: 6);
        var code = totp.ComputeTotp(DateTime.UtcNow);

        var result = service.VerifyCode(secret, code);

        Assert.True(result);
    }

    [Theory]
    [InlineData("")]
    [InlineData("12345")]
    [InlineData("1234567")]
    [InlineData("abcdef")]
    public void VerifyCode_WhenCodeFormatIsInvalid_ReturnsFalse(string code)
    {
        var service = new LocalAccountTotpService();
        var secret = service.GenerateSecret();

        var result = service.VerifyCode(secret, code);

        Assert.False(result);
    }

    [Fact]
    public void VerifyCode_WhenSecretIsInvalid_ReturnsFalse()
    {
        var service = new LocalAccountTotpService();

        var result = service.VerifyCode("not-base32", "123456");

        Assert.False(result);
    }

    [Fact]
    public void BuildAuthenticatorUri_UsesNormalizedAndEncodedValues()
    {
        var service = new LocalAccountTotpService();

        var uri = service.BuildAuthenticatorUri(" Elf Admin ", " admin@example.com ", " abcdef234567 ");

        Assert.StartsWith("otpauth://totp/Elf%20Admin:admin%40example.com", uri);
        Assert.Contains("secret=ABCDEF234567", uri);
        Assert.Contains("issuer=Elf%20Admin", uri);
        Assert.Contains("digits=6", uri);
        Assert.Contains("period=30", uri);
    }
}
