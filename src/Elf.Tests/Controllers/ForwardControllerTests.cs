using Elf.Api.Controllers;
using Elf.Api.Data;
using Elf.Api.Features;
using Elf.Api.Models;
using Elf.Api.TokenGenerator;
using Elf.MultiTenancy;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.FeatureManagement;
using Moq;
using NUnit.Framework;
using System.Diagnostics.CodeAnalysis;

namespace Elf.Tests.Controllers;

[TestFixture]
[ExcludeFromCodeCoverage]
public class ForwardControllerTests
{
    private Mock<ILogger<ForwardController>> _loggerMock;
    private Mock<ITokenGenerator> _tokenGeneratorMock;
    private Mock<ILinkVerifier> _linkVerifierMock;
    private Mock<IServiceScopeFactory> _serviceScopeFactoryMock;
    private Mock<IDistributedCache> _cacheMock;
    private Mock<IFeatureManager> _mockFeatureManager;
    private Mock<IMediator> _mockMediator;
    private Mock<ITenantAccessor<Tenant>> _mockTenantAccessor;

    [SetUp]
    public void Setup()
    {
        _loggerMock = new();
        _tokenGeneratorMock = new();
        _linkVerifierMock = new();
        _serviceScopeFactoryMock = new();
        _cacheMock = new();
        _mockFeatureManager = new();
        _mockTenantAccessor = new();
        _mockMediator = new();

        _mockTenantAccessor.Setup(p => p.Tenant).Returns(new Tenant
        {
            Id = Guid.Empty,
            Identifier = "unittest",
            Items = new()
        });
    }

    private ForwardController CreateController(IDistributedCache men = null) => new(
            _mockTenantAccessor.Object,
            _loggerMock.Object,
            _tokenGeneratorMock.Object,
            men ?? _cacheMock.Object,
            _linkVerifierMock.Object,
            _mockFeatureManager.Object,
            _mockMediator.Object,
            _serviceScopeFactoryMock.Object);


    [TestCase("")]
    [TestCase(" ")]
    [TestCase(null)]
    public async Task Forward_EmptyToken(string token)
    {
        var ctl = CreateController();

        var result = await ctl.Forward(token);
        Assert.IsInstanceOf(typeof(BadRequestResult), result);
    }

    [TestCase("")]
    [TestCase(" ")]
    [TestCase(null)]
    public async Task Forward_EmptyUserAgent(string ua)
    {
        var ctl = CreateController();

        ctl.ControllerContext = new()
        {
            HttpContext = new DefaultHttpContext()
        };

        ctl.ControllerContext.HttpContext.Request.Headers["User-Agent"] = ua;

        var result = await ctl.Forward("996");
        Assert.IsInstanceOf(typeof(BadRequestResult), result);
    }

    [Test]
    public async Task Forward_InvalidToken()
    {
        const string inputToken = "996";
        string t;
        _tokenGeneratorMock.Setup(p => p.TryParseToken(inputToken, out t))
                           .Returns(false);

        var ctl = CreateController();

        ctl.ControllerContext = GetHappyPathHttpContext();

        var result = await ctl.Forward(inputToken);
        Assert.IsInstanceOf(typeof(BadRequestResult), result);
    }

    [Test]
    public async Task CacheFound()
    {
        const string inputToken = "996";
        string t;
        _tokenGeneratorMock.Setup(p => p.TryParseToken(inputToken, out t))
                           .Returns(true);

        var link = new LinkEntity
        {
            OriginUrl = "https://996.icu"
        };

        var fakeCache = MockCacheService.GetFakeCache(link);
        // var cachedResponse = cache.Get<Link>(inputToken);

        _mockFeatureManager.Setup(p => p.IsEnabledAsync(nameof(FeatureFlags.HonorDNT))).Returns(Task.FromResult(false));

        var ctl = CreateController(fakeCache);
        ctl.ControllerContext = GetHappyPathHttpContext();

        var result = await ctl.Forward(inputToken);
        Assert.IsInstanceOf(typeof(RedirectResult), result);
    }

    [Test]
    public async Task FirstTimeRequest_LinkNotExists_NoDefRedir()
    {
        const string inputToken = "996";
        string t;
        _tokenGeneratorMock
            .Setup(p => p.TryParseToken(inputToken, out t))
            .Returns(true);

        var link = new LinkEntity();
        var cache = MockCacheService.GetFakeCache(link, false);

        _mockMediator
            .Setup(p => p.Send(It.IsAny<GetLinkByTokenQuery>(), default))
            .ReturnsAsync(() => null);


        _mockTenantAccessor.Setup(p => p.Tenant).Returns(new Tenant
        {
            Items = new() { { "DefaultRedirectionUrl", string.Empty } }
        });

        var ctl = CreateController(cache);

        ctl.ControllerContext = GetHappyPathHttpContext();

        var result = await ctl.Forward(inputToken);
        Assert.IsInstanceOf(typeof(NotFoundResult), result);
    }

    [Test]
    public async Task FirstTimeRequest_LinkNotExists_ValidDefRedir()
    {
        string inputToken = "996";
        string t;
        _tokenGeneratorMock
            .Setup(p => p.TryParseToken(inputToken, out t))
            .Returns(true);

        var link = new LinkEntity();
        var cache = MockCacheService.GetFakeCache(link, false);

        _mockMediator
            .Setup(p => p.Send(It.IsAny<GetLinkByTokenQuery>(), default))
            .ReturnsAsync(() => null);

        _linkVerifierMock
            .Setup(p => p.Verify(It.IsAny<string>(), It.IsAny<IUrlHelper>(), It.IsAny<HttpRequest>(), false))
            .Returns(LinkVerifyResult.Valid);

        _mockTenantAccessor.Setup(p => p.Tenant).Returns(new Tenant
        {
            Items = new() { { "DefaultRedirectionUrl", "https://edi.wang" } }
        });

        var ctl = CreateController(cache);
        ctl.ControllerContext = GetHappyPathHttpContext();

        var result = await ctl.Forward(inputToken);
        Assert.IsInstanceOf(typeof(RedirectResult), result);
    }

    [TestCase(LinkVerifyResult.InvalidFormat)]
    [TestCase(LinkVerifyResult.InvalidLocal)]
    [TestCase(LinkVerifyResult.InvalidSelfReference)]
    public void FirstTimeRequest_LinkNotExists_InvalidDefRedir(LinkVerifyResult linkVerifyResult)
    {
        string inputToken = "996";
        string t;
        _tokenGeneratorMock
            .Setup(p => p.TryParseToken(inputToken, out t))
            .Returns(true);

        var link = new LinkEntity();
        var cache = MockCacheService.GetFakeCache(link, false);

        _mockMediator
            .Setup(p => p.Send(It.IsAny<GetLinkByTokenQuery>(), default))
            .ReturnsAsync(() => null);

        _linkVerifierMock
            .Setup(p => p.Verify(It.IsAny<string>(), It.IsAny<IUrlHelper>(), It.IsAny<HttpRequest>(), false))
            .Returns(linkVerifyResult);

        _mockTenantAccessor.Setup(p => p.Tenant).Returns(new Tenant
        {
            Items = new() { { "DefaultRedirectionUrl", "INVALID_VALUE" } }
        });

        var ctl = CreateController(cache);
        ctl.ControllerContext = GetHappyPathHttpContext();

        Assert.ThrowsAsync(typeof(UriFormatException), async () =>
        {
            await ctl.Forward(inputToken);
        });
    }

    [Test]
    public async Task FirstTimeRequest_LinkNotEnabled()
    {
        string inputToken = "996";
        string t;
        _tokenGeneratorMock
            .Setup(p => p.TryParseToken(inputToken, out t))
            .Returns(true);

        var link = new LinkEntity() { IsEnabled = false };
        var cache = MockCacheService.GetFakeCache(link, false);

        _mockMediator
            .Setup(p => p.Send(It.IsAny<GetLinkByTokenQuery>(), default))
            .ReturnsAsync(link);

        _linkVerifierMock
            .Setup(p => p.Verify(It.IsAny<string>(), It.IsAny<IUrlHelper>(), It.IsAny<HttpRequest>(), false))
            .Returns(LinkVerifyResult.Valid);

        var ctl = CreateController(cache);
        ctl.ControllerContext = GetHappyPathHttpContext();

        var result = await ctl.Forward(inputToken);
        Assert.IsInstanceOf(typeof(BadRequestObjectResult), result);
    }


    //[Test]
    //public async Task FirstTimeRequest_NoDnt_NoTTL()
    //{
    //    string inputToken = "996";
    //    string t;
    //    _tokenGeneratorMock
    //        .Setup(p => p.TryParseToken(inputToken, out t))
    //        .Returns(true);

    //    var link = new Link { IsEnabled = true, OriginUrl = "https://edi.wang" };
    //    var cache = MockCacheService.GetFakeCache(link, false);

    //    _linkForwarderServiceMock
    //        .Setup(p => p.GetLinkAsync(It.IsAny<Guid>(), null))
    //        .ReturnsAsync(link);

    //    _linkVerifierMock
    //        .Setup(p => p.Verify(It.IsAny<string>(), It.IsAny<IUrlHelper>(), It.IsAny<HttpRequest>(), false))
    //        .Returns(LinkVerifyResult.Valid);

    //    _mockFeatureManager.Setup(p => p.IsEnabledAsync(nameof(FeatureFlags.HonorDNT))).Returns(Task.FromResult(false));

    //    var ctl = CreateController(cache);
    //    ctl.ControllerContext = GetHappyPathHttpContext();

    //    var result = await ctl.Forward(inputToken);
    //    Assert.IsInstanceOf(typeof(RedirectResult), result);
    //}

    [Test]
    public void FirstTimeRequest_InvalidOriginUrl()
    {
        string inputToken = "996";
        string t;
        _tokenGeneratorMock
            .Setup(p => p.TryParseToken(inputToken, out t))
            .Returns(true);

        var link = new LinkEntity { IsEnabled = true, OriginUrl = "INVALID_VALUE" };
        var cache = MockCacheService.GetFakeCache(link, false);

        _mockMediator
            .Setup(p => p.Send(It.IsAny<GetLinkByTokenQuery>(), default))
            .ReturnsAsync(link);

        _linkVerifierMock
            .Setup(p => p.Verify(It.IsAny<string>(), It.IsAny<IUrlHelper>(), It.IsAny<HttpRequest>(), false))
            .Returns(LinkVerifyResult.InvalidFormat);

        _mockTenantAccessor.Setup(p => p.Tenant).Returns(new Tenant
        {
            Items = new() { { "DefaultRedirectionUrl", "https://edi.wang" } }
        });

        var ctl = CreateController(cache);
        ctl.ControllerContext = GetHappyPathHttpContext();

        Assert.ThrowsAsync(typeof(UriFormatException), async () =>
        {
            await ctl.Forward(inputToken);
        });
    }

    [TestCase("")]
    [TestCase(" ")]
    [TestCase(null)]
    public async Task Aka_EmptyName(string akaName)
    {
        var ctl = CreateController();

        var result = await ctl.Aka(akaName);
        Assert.IsInstanceOf(typeof(BadRequestResult), result);
    }

    [TestCase("")]
    [TestCase(" ")]
    [TestCase(null)]
    public async Task Aka_EmptyUserAgent(string ua)
    {
        var ctl = CreateController();

        ctl.ControllerContext = new()
        {
            HttpContext = new DefaultHttpContext()
        };

        ctl.ControllerContext.HttpContext.Request.Headers["User-Agent"] = ua;

        var result = await ctl.Aka("996");
        Assert.IsInstanceOf(typeof(BadRequestResult), result);
    }

    private static ControllerContext GetHappyPathHttpContext()
    {
        var ctx = new ControllerContext
        {
            HttpContext = new DefaultHttpContext()
        };

        ctx.HttpContext.Request.Headers["User-Agent"] = "Unit Test";
        return ctx;
    }
}
