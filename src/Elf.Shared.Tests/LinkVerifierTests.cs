using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace Elf.Shared.Tests;

public class LinkVerifierTests
{
    private readonly LinkVerifier _linkVerifier;
    private readonly Mock<IUrlHelper> _mockUrlHelper;
    private readonly Mock<HttpRequest> _mockHttpRequest;

    public LinkVerifierTests()
    {
        _linkVerifier = new LinkVerifier();
        _mockUrlHelper = new Mock<IUrlHelper>();
        _mockHttpRequest = new Mock<HttpRequest>();
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("   ")]
    [InlineData("\t")]
    [InlineData("\n")]
    public void Verify_NullOrWhitespaceUrl_ReturnsInvalidFormat(string url)
    {
        // Act
        var result = _linkVerifier.Verify(url, _mockUrlHelper.Object, _mockHttpRequest.Object);

        // Assert
        Assert.Equal(LinkVerifyResult.InvalidFormat, result);
    }

    [Theory]
    [InlineData("not-a-url")]
    [InlineData("htp://invalid.com")]
    [InlineData("ftp://example.com")]
    [InlineData("mailto:test@example.com")]
    [InlineData("javascript:alert('xss')")]
    public void Verify_InvalidUrlFormat_ReturnsInvalidFormat(string url)
    {
        // Act
        var result = _linkVerifier.Verify(url, _mockUrlHelper.Object, _mockHttpRequest.Object);

        // Assert
        Assert.Equal(LinkVerifyResult.InvalidFormat, result);
    }

    [Theory]
    [InlineData("http://example.com")]
    [InlineData("https://example.com")]
    [InlineData("https://subdomain.example.com/path")]
    [InlineData("http://192.168.1.1")]
    public void Verify_ValidUrlFormatButLocalUrl_ReturnsInvalidLocal(string url)
    {
        // Arrange
        _mockUrlHelper.Setup(x => x.IsLocalUrl(url)).Returns(true);

        // Act
        var result = _linkVerifier.Verify(url, _mockUrlHelper.Object, _mockHttpRequest.Object);

        // Assert
        Assert.Equal(LinkVerifyResult.InvalidLocal, result);
    }

    [Fact]
    public void Verify_SelfReferenceToForwardEndpoint_ReturnsInvalidSelfReference()
    {
        // Arrange
        var url = "https://example.com/fw/some-link";
        var mockHostString = new HostString("example.com");
        
        _mockUrlHelper.Setup(x => x.IsLocalUrl(url)).Returns(false);
        _mockHttpRequest.Setup(x => x.Host).Returns(mockHostString);
        _mockHttpRequest.Setup(x => x.Scheme).Returns("https");

        // Act
        var result = _linkVerifier.Verify(url, _mockUrlHelper.Object, _mockHttpRequest.Object);

        // Assert
        Assert.Equal(LinkVerifyResult.InvalidSelfReference, result);
    }

    [Fact]
    public void Verify_SelfReferenceToForwardEndpointWithAllowSelfRedirection_ReturnsValid()
    {
        // Arrange
        var url = "https://example.com/fw/some-link";
        var mockHostString = new HostString("example.com");
        
        _mockUrlHelper.Setup(x => x.IsLocalUrl(url)).Returns(false);
        _mockHttpRequest.Setup(x => x.Host).Returns(mockHostString);
        _mockHttpRequest.Setup(x => x.Scheme).Returns("https");

        // Act
        var result = _linkVerifier.Verify(url, _mockUrlHelper.Object, _mockHttpRequest.Object, allowSelfRedirection: true);

        // Assert
        Assert.Equal(LinkVerifyResult.Valid, result);
    }

    [Theory]
    [InlineData("https://google.com")]
    [InlineData("http://github.com/user/repo")]
    [InlineData("https://api.example.com/endpoint")]
    public void Verify_ValidExternalUrl_ReturnsValid(string url)
    {
        // Arrange
        _mockUrlHelper.Setup(x => x.IsLocalUrl(url)).Returns(false);
        _mockHttpRequest.Setup(x => x.Host).Returns(new HostString("different-host.com"));
        _mockHttpRequest.Setup(x => x.Scheme).Returns("https");

        // Act
        var result = _linkVerifier.Verify(url, _mockUrlHelper.Object, _mockHttpRequest.Object);

        // Assert
        Assert.Equal(LinkVerifyResult.Valid, result);
    }

    [Fact]
    public void Verify_SelfReferenceButNotForwardEndpoint_ReturnsValid()
    {
        // Arrange
        var url = "https://example.com/regular-path";
        var mockHostString = new HostString("example.com");
        
        _mockUrlHelper.Setup(x => x.IsLocalUrl(url)).Returns(false);
        _mockHttpRequest.Setup(x => x.Host).Returns(mockHostString);
        _mockHttpRequest.Setup(x => x.Scheme).Returns("https");

        // Act
        var result = _linkVerifier.Verify(url, _mockUrlHelper.Object, _mockHttpRequest.Object);

        // Assert
        Assert.Equal(LinkVerifyResult.Valid, result);
    }

    [Theory]
    [InlineData("https://example.com/fw", "http://example.com")]
    [InlineData("https://example.com/fw", "https://different-host.com")]
    public void Verify_DifferentHostOrScheme_ReturnsValid(string url, string requestHost)
    {
        // Arrange
        var uri = new Uri(requestHost);
        var mockHostString = new HostString(uri.Host);
        
        _mockUrlHelper.Setup(x => x.IsLocalUrl(url)).Returns(false);
        _mockHttpRequest.Setup(x => x.Host).Returns(mockHostString);
        _mockHttpRequest.Setup(x => x.Scheme).Returns(uri.Scheme);

        // Act
        var result = _linkVerifier.Verify(url, _mockUrlHelper.Object, _mockHttpRequest.Object);

        // Assert
        Assert.Equal(LinkVerifyResult.Valid, result);
    }
}

public class LinkVerifierIsForwardEndpointTests
{
    [Fact]
    public void IsForwardEndpoint_NullUri_ThrowsArgumentNullException()
    {
        // Act & Assert
        Assert.Throws<ArgumentNullException>(() => LinkVerifier.IsForwardEndpoint(null));
    }

    [Theory]
    [InlineData("https://example.com/")]
    [InlineData("https://example.com")]
    public void IsForwardEndpoint_RootPath_ReturnsFalse(string url)
    {
        // Arrange
        var uri = new Uri(url);

        // Act
        var result = LinkVerifier.IsForwardEndpoint(uri);

        // Assert
        Assert.False(result);
    }

    [Theory]
    [InlineData("https://example.com/fw")]
    [InlineData("https://example.com/fw/")]
    [InlineData("https://example.com/FW")]
    [InlineData("https://example.com/Fw")]
    public void IsForwardEndpoint_FwEndpoint_ReturnsTrue(string url)
    {
        // Arrange
        var uri = new Uri(url);

        // Act
        var result = LinkVerifier.IsForwardEndpoint(uri);

        // Assert
        Assert.True(result);
    }

    [Theory]
    [InlineData("https://example.com/aka")]
    [InlineData("https://example.com/aka/")]
    [InlineData("https://example.com/AKA")]
    [InlineData("https://example.com/Aka")]
    public void IsForwardEndpoint_AkaEndpoint_ReturnsTrue(string url)
    {
        // Arrange
        var uri = new Uri(url);

        // Act
        var result = LinkVerifier.IsForwardEndpoint(uri);

        // Assert
        Assert.True(result);
    }

    [Theory]
    [InlineData("https://example.com/fw/some-token")]
    [InlineData("https://example.com/aka/some-token")]
    [InlineData("https://example.com/fw/nested/path")]
    public void IsForwardEndpoint_ForwardEndpointWithAdditionalPath_ReturnsTrue(string url)
    {
        // Arrange
        var uri = new Uri(url);

        // Act
        var result = LinkVerifier.IsForwardEndpoint(uri);

        // Assert
        Assert.True(result);
    }

    [Theory]
    [InlineData("https://example.com/not-fw")]
    [InlineData("https://example.com/not-aka")]
    [InlineData("https://example.com/fwsomething")]
    [InlineData("https://example.com/akasomething")]
    [InlineData("https://example.com/api/fw")]
    [InlineData("https://example.com/admin")]
    [InlineData("https://example.com/regular-path")]
    public void IsForwardEndpoint_NonForwardEndpoint_ReturnsFalse(string url)
    {
        // Arrange
        var uri = new Uri(url);

        // Act
        var result = LinkVerifier.IsForwardEndpoint(uri);

        // Assert
        Assert.False(result);
    }

    [Theory]
    [InlineData("https://example.com/fw-test")]
    [InlineData("https://example.com/aka-test")]
    [InlineData("https://example.com/test-fw")]
    [InlineData("https://example.com/test-aka")]
    public void IsForwardEndpoint_PartialMatch_ReturnsFalse(string url)
    {
        // Arrange
        var uri = new Uri(url);

        // Act
        var result = LinkVerifier.IsForwardEndpoint(uri);

        // Assert
        Assert.False(result);
    }

    [Theory]
    [InlineData("https://example.com/fw")]
    [InlineData("https://example.com/fw/")]
    [InlineData("https://example.com/aka")]
    [InlineData("https://example.com/aka/")]
    public void IsForwardEndpoint_CaseInsensitive_ReturnsTrue(string url)
    {
        // Arrange
        var uri = new Uri(url.ToUpper());

        // Act
        var result = LinkVerifier.IsForwardEndpoint(uri);

        // Assert
        Assert.True(result);
    }
}