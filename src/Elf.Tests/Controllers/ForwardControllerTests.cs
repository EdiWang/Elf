using System;
using System.Diagnostics.CodeAnalysis;
using System.Threading.Tasks;
using Elf.Services;
using Elf.Services.Entities;
using Elf.Services.TokenGenerator;
using Elf.Web;
using Elf.Web.Controllers;
using Elf.Web.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.FeatureManagement;
using Moq;
using NUnit.Framework;

namespace Elf.Tests.Controllers
{
    [TestFixture]
    [ExcludeFromCodeCoverage]
    public class ForwardControllerTests
    {
        private Mock<ILogger<ForwardController>> _loggerMock;
        private Mock<IOptions<AppSettings>> _appSettingsMock;
        private Mock<ITokenGenerator> _tokenGeneratorMock;
        private Mock<ILinkVerifier> _linkVerifierMock;
        private Mock<ILinkForwarderService> _linkForwarderServiceMock;
        private Mock<IMemoryCache> _memoryCacheMock;
        private Mock<IFeatureManager> _mockFeatureManager;

        [SetUp]
        public void Setup()
        {
            _loggerMock = new();
            _appSettingsMock = new();
            _tokenGeneratorMock = new();
            _linkVerifierMock = new();
            _linkForwarderServiceMock = new();
            _memoryCacheMock = new();
            _mockFeatureManager = new();
        }

        [TestCase("")]
        [TestCase(" ")]
        [TestCase(null)]
        public async Task Forward_EmptyToken(string token)
        {
            var ctl = new ForwardController(
                _appSettingsMock.Object,
                _loggerMock.Object,
                _linkForwarderServiceMock.Object,
                _tokenGeneratorMock.Object,
                _memoryCacheMock.Object,
                _linkVerifierMock.Object,
                _mockFeatureManager.Object);

            var result = await ctl.Forward(token);
            Assert.IsInstanceOf(typeof(BadRequestResult), result);
        }

        [TestCase("")]
        [TestCase(" ")]
        [TestCase(null)]
        public async Task Forward_EmptyUserAgent(string ua)
        {
            var ctl = new ForwardController(
                _appSettingsMock.Object,
                _loggerMock.Object,
                _linkForwarderServiceMock.Object,
                _tokenGeneratorMock.Object,
                _memoryCacheMock.Object,
                _linkVerifierMock.Object,
                _mockFeatureManager.Object)
            {
                ControllerContext = new()
                {
                    HttpContext = new DefaultHttpContext()
                }
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

            var ctl = new ForwardController(
                _appSettingsMock.Object,
                _loggerMock.Object,
                _linkForwarderServiceMock.Object,
                _tokenGeneratorMock.Object,
                _memoryCacheMock.Object,
                _linkVerifierMock.Object,
                _mockFeatureManager.Object)
            {
                ControllerContext = GetHappyPathHttpContext()
            };

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

            var link = new Link
            {
                OriginUrl = "https://996.icu"
            };

            var memoryCache = MockMemoryCacheService.GetMemoryCache(link);
            // var cachedResponse = memoryCache.Get<Link>(inputToken);

            _mockFeatureManager.Setup(p => p.IsEnabledAsync(nameof(FeatureFlags.HonorDNT))).Returns(Task.FromResult(false));

            var ctl = new ForwardController(
                _appSettingsMock.Object,
                _loggerMock.Object,
                _linkForwarderServiceMock.Object,
                _tokenGeneratorMock.Object,
                memoryCache,
                _linkVerifierMock.Object,
                _mockFeatureManager.Object)
            {
                ControllerContext = GetHappyPathHttpContext()
            };

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

            var link = new Link();
            var memoryCache = MockMemoryCacheService.GetMemoryCache(link, false);

            _linkForwarderServiceMock
                .Setup(p => p.GetLinkAsync(null))
                .ReturnsAsync(() => null);

            _appSettingsMock.Setup(p => p.Value).Returns(new AppSettings
            {
                DefaultRedirectionUrl = string.Empty
            });

            var ctl = new ForwardController(
                _appSettingsMock.Object,
                _loggerMock.Object,
                _linkForwarderServiceMock.Object,
                _tokenGeneratorMock.Object,
                memoryCache,
                _linkVerifierMock.Object,
                _mockFeatureManager.Object)
            {
                ControllerContext = GetHappyPathHttpContext()
            };

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

            var link = new Link();
            var memoryCache = MockMemoryCacheService.GetMemoryCache(link, false);

            _linkForwarderServiceMock
                .Setup(p => p.GetLinkAsync(null))
                .ReturnsAsync(() => null);

            _linkVerifierMock
                .Setup(p => p.Verify(It.IsAny<string>(), It.IsAny<IUrlHelper>(), It.IsAny<HttpRequest>(), false))
                .Returns(LinkVerifyResult.Valid);

            _appSettingsMock.Setup(p => p.Value).Returns(new AppSettings
            {
                DefaultRedirectionUrl = "https://edi.wang"
            });

            var ctl = new ForwardController(
                _appSettingsMock.Object,
                _loggerMock.Object,
                _linkForwarderServiceMock.Object,
                _tokenGeneratorMock.Object,
                memoryCache,
                _linkVerifierMock.Object,
                _mockFeatureManager.Object)
            {
                ControllerContext = GetHappyPathHttpContext()
            };

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

            var link = new Link();
            var memoryCache = MockMemoryCacheService.GetMemoryCache(link, false);

            _linkForwarderServiceMock
                .Setup(p => p.GetLinkAsync(null))
                .ReturnsAsync(() => null);

            _linkVerifierMock
                .Setup(p => p.Verify(It.IsAny<string>(), It.IsAny<IUrlHelper>(), It.IsAny<HttpRequest>(), false))
                .Returns(linkVerifyResult);

            _appSettingsMock.Setup(p => p.Value).Returns(new AppSettings
            {
                DefaultRedirectionUrl = "INVALID_VALUE"
            });

            var ctl = new ForwardController(
                _appSettingsMock.Object,
                _loggerMock.Object,
                _linkForwarderServiceMock.Object,
                _tokenGeneratorMock.Object,
                memoryCache,
                _linkVerifierMock.Object,
                _mockFeatureManager.Object)
            {
                ControllerContext = GetHappyPathHttpContext()
            };

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

            var link = new Link { IsEnabled = false };
            var memoryCache = MockMemoryCacheService.GetMemoryCache(link, false);

            _linkForwarderServiceMock
                .Setup(p => p.GetLinkAsync(null))
                .ReturnsAsync(link);

            _linkVerifierMock
                .Setup(p => p.Verify(It.IsAny<string>(), It.IsAny<IUrlHelper>(), It.IsAny<HttpRequest>(), false))
                .Returns(LinkVerifyResult.Valid);

            var ctl = new ForwardController(
                _appSettingsMock.Object,
                _loggerMock.Object,
                _linkForwarderServiceMock.Object,
                _tokenGeneratorMock.Object,
                memoryCache,
                _linkVerifierMock.Object,
                _mockFeatureManager.Object)
            {
                ControllerContext = GetHappyPathHttpContext()
            };

            var result = await ctl.Forward(inputToken);
            Assert.IsInstanceOf(typeof(BadRequestObjectResult), result);
        }


        [Test]
        public async Task FirstTimeRequest_NoDnt_NoTTL()
        {
            string inputToken = "996";
            string t;
            _tokenGeneratorMock
                .Setup(p => p.TryParseToken(inputToken, out t))
                .Returns(true);

            var link = new Link { IsEnabled = true, OriginUrl = "https://edi.wang" };
            var memoryCache = MockMemoryCacheService.GetMemoryCache(link, false);

            _linkForwarderServiceMock
                .Setup(p => p.GetLinkAsync(null))
                .ReturnsAsync(link);

            _linkVerifierMock
                .Setup(p => p.Verify(It.IsAny<string>(), It.IsAny<IUrlHelper>(), It.IsAny<HttpRequest>(), false))
                .Returns(LinkVerifyResult.Valid);

            _mockFeatureManager.Setup(p => p.IsEnabledAsync(nameof(FeatureFlags.HonorDNT))).Returns(Task.FromResult(false));

            var ctl = new ForwardController(
                _appSettingsMock.Object,
                _loggerMock.Object,
                _linkForwarderServiceMock.Object,
                _tokenGeneratorMock.Object,
                memoryCache,
                _linkVerifierMock.Object,
                _mockFeatureManager.Object)
            {
                ControllerContext = GetHappyPathHttpContext()
            };

            var result = await ctl.Forward(inputToken);
            Assert.IsInstanceOf(typeof(RedirectResult), result);
        }

        [Test]
        public void FirstTimeRequest_InvalidOriginUrl()
        {
            string inputToken = "996";
            string t;
            _tokenGeneratorMock
                .Setup(p => p.TryParseToken(inputToken, out t))
                .Returns(true);

            var link = new Link { IsEnabled = true, OriginUrl = "INVALID_VALUE" };
            var memoryCache = MockMemoryCacheService.GetMemoryCache(link, false);

            _linkForwarderServiceMock
                .Setup(p => p.GetLinkAsync(null))
                .ReturnsAsync(link);

            _linkVerifierMock
                .Setup(p => p.Verify(It.IsAny<string>(), It.IsAny<IUrlHelper>(), It.IsAny<HttpRequest>(), false))
                .Returns(LinkVerifyResult.InvalidFormat);

            _appSettingsMock.Setup(p => p.Value).Returns(new AppSettings
            {
                DefaultRedirectionUrl = "https://edi.wang"
            });

            var ctl = new ForwardController(
                _appSettingsMock.Object,
                _loggerMock.Object,
                _linkForwarderServiceMock.Object,
                _tokenGeneratorMock.Object,
                memoryCache,
                _linkVerifierMock.Object,
                _mockFeatureManager.Object)
            {
                ControllerContext = GetHappyPathHttpContext()
            };

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
            var ctl = new ForwardController(
                _appSettingsMock.Object,
                _loggerMock.Object,
                _linkForwarderServiceMock.Object,
                _tokenGeneratorMock.Object,
                _memoryCacheMock.Object,
                _linkVerifierMock.Object,
                _mockFeatureManager.Object);

            var result = await ctl.Aka(akaName);
            Assert.IsInstanceOf(typeof(BadRequestResult), result);
        }

        [TestCase("")]
        [TestCase(" ")]
        [TestCase(null)]
        public async Task Aka_EmptyUserAgent(string ua)
        {
            var ctl = new ForwardController(
                _appSettingsMock.Object,
                _loggerMock.Object,
                _linkForwarderServiceMock.Object,
                _tokenGeneratorMock.Object,
                _memoryCacheMock.Object,
                _linkVerifierMock.Object,
                _mockFeatureManager.Object)
            {
                ControllerContext = new()
                {
                    HttpContext = new DefaultHttpContext()
                }
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
}
