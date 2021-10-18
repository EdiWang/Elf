using System.Diagnostics.CodeAnalysis;
using Elf.Services.TokenGenerator;
using NUnit.Framework;

namespace Elf.Tests;

[TestFixture]
[ExcludeFromCodeCoverage]
public class TokenGeneratorTests
{
    public ITokenGenerator TGen { get; set; }

    [SetUp]
    public void Setup()
    {
        TGen = new ShortGuidTokenGenerator();
    }

    [Test]
    public void TokenFormat()
    {
        string token = TGen.GenerateToken();
        var hasUpperCase = token.Any(char.IsUpper);
        Assert.IsTrue(token.Length == 8);
        Assert.IsTrue(!hasUpperCase);
    }

    [TestCase("996", ExpectedResult = false)]
    [TestCase("", ExpectedResult = false)]
    [TestCase("Work 996 and get into ICU", ExpectedResult = false)]
    [TestCase("love.net", ExpectedResult = true)]
    public bool TokenParser(string token)
    {
        var b = TGen.TryParseToken(token, out var t);
        return b;
    }
}
