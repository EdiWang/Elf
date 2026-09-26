namespace Elf.Shared.Tests;

public class IdentifierRulesTests
{
    [Theory]
    [InlineData("docs")]
    [InlineData("docs-2026")]
    [InlineData("a1-b2-c3")]
    public void IsValidAkaName_WithValidAka_ReturnsTrue(string akaName)
    {
        Assert.True(IdentifierRules.IsValidAkaName(akaName));
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData(" ")]
    [InlineData("Docs")]
    [InlineData("docs_")]
    [InlineData("-docs")]
    [InlineData("docs-")]
    [InlineData("docs.example")]
    public void IsValidAkaName_WithInvalidAka_ReturnsFalse(string akaName)
    {
        Assert.False(IdentifierRules.IsValidAkaName(akaName));
    }

    [Fact]
    public void NormalizeTagName_TrimsAndLowercasesTag()
    {
        Assert.Equal("docs", IdentifierRules.NormalizeTagName(" DOCS "));
    }
}
