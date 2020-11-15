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

        [SetUp]
        public void Setup()
        {
            _loggerMock = new();
            _appSettingsMock = new();
            _tokenGeneratorMock = new();
            _linkVerifierMock = new();
            _linkForwarderServiceMock = new();
            _memoryCacheMock = new();
        }

        [TestCase("")]
        [TestCase(" ")]
        [TestCase(null)]
        public async Task TestForwardEmptyToken(string token)
        {
            var ctl = new ForwardController(
                _appSettingsMock.Object,
                _loggerMock.Object,
                _linkForwarderServiceMock.Object,
                _tokenGeneratorMock.Object,
                _memoryCacheMock.Object,
                _linkVerifierMock.Object);

            var result = await ctl.Forward(token);
            Assert.IsInstanceOf(typeof(BadRequestResult), result);
        }

        [TestCase("")]
        [TestCase(" ")]
        [TestCase(null)]
        public async Task TestForwardEmptyUserAgent(string ua)
        {
            var ctl = new ForwardController(
                _appSettingsMock.Object,
                _loggerMock.Object,
                _linkForwarderServiceMock.Object,
                _tokenGeneratorMock.Object,
                _memoryCacheMock.Object,
                _linkVerifierMock.Object)
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
        public async Task TestForwardInvalidToken()
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
                _linkVerifierMock.Object)
            {
                ControllerContext = GetHappyPathHttpContext()
            };

            var result = await ctl.Forward(inputToken);
            Assert.IsInstanceOf(typeof(BadRequestResult), result);
        }

        [Test]
        public async Task TestCacheFound()
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

            _appSettingsMock.Setup(p => p.Value).Returns(new AppSettings()
            {
                HonorDNT = false
            });

            var ctl = new ForwardController(
                _appSettingsMock.Object,
                _loggerMock.Object,
                _linkForwarderServiceMock.Object,
                _tokenGeneratorMock.Object,
                memoryCache,
                _linkVerifierMock.Object)
            {
                ControllerContext = GetHappyPathHttpContext()
            };

            var result = await ctl.Forward(inputToken);
            Assert.IsInstanceOf(typeof(RedirectResult), result);
        }

        [Test]
        public async Task TestFirstTimeRequestLinkNotExistsNoDefRedir()
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
                _linkVerifierMock.Object)
            {
                ControllerContext = GetHappyPathHttpContext()
            };

            var result = await ctl.Forward(inputToken);
            Assert.IsInstanceOf(typeof(NotFoundResult), result);
        }

        [Test]
        public async Task TestFirstTimeRequestLinkNotExistsWithValidDefRedir()
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
                _linkVerifierMock.Object)
            {
                ControllerContext = GetHappyPathHttpContext()
            };

            var result = await ctl.Forward(inputToken);
            Assert.IsInstanceOf(typeof(RedirectResult), result);
        }

        [TestCase(LinkVerifyResult.InvalidFormat)]
        [TestCase(LinkVerifyResult.InvalidLocal)]
        [TestCase(LinkVerifyResult.InvalidSelfReference)]
        public void TestFirstTimeRequestLinkNotExistsWithInvalidDefRedir(LinkVerifyResult linkVerifyResult)
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
                _linkVerifierMock.Object)
            {
                ControllerContext = GetHappyPathHttpContext()
            };

            Assert.ThrowsAsync(typeof(UriFormatException), async () =>
            {
                await ctl.Forward(inputToken);
            });
        }

        [Test]
        public async Task TestFirstTimeRequestLinkNotEnabled()
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
                _linkVerifierMock.Object)
            {
                ControllerContext = GetHappyPathHttpContext()
            };

            var result = await ctl.Forward(inputToken);
            Assert.IsInstanceOf(typeof(BadRequestObjectResult), result);
        }


        [Test]
        public async Task TestFirstTimeRequestNoDntNoTTL()
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

            _appSettingsMock.Setup(p => p.Value).Returns(new AppSettings
            {
                HonorDNT = false
            });

            var ctl = new ForwardController(
                _appSettingsMock.Object,
                _loggerMock.Object,
                _linkForwarderServiceMock.Object,
                _tokenGeneratorMock.Object,
                memoryCache,
                _linkVerifierMock.Object)
            {
                ControllerContext = GetHappyPathHttpContext()
            };

            var result = await ctl.Forward(inputToken);
            Assert.IsInstanceOf(typeof(RedirectResult), result);
        }

        [Test]
        public void TestFirstTimeRequestInvalidOriginUrl()
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
                _linkVerifierMock.Object)
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
        public async Task TestAkaEmptyName(string akaName)
        {
            var ctl = new ForwardController(
                _appSettingsMock.Object,
                _loggerMock.Object,
                _linkForwarderServiceMock.Object,
                _tokenGeneratorMock.Object,
                _memoryCacheMock.Object,
                _linkVerifierMock.Object);

            var result = await ctl.Aka(akaName);
            Assert.IsInstanceOf(typeof(BadRequestResult), result);
        }

        [TestCase("")]
        [TestCase(" ")]
        [TestCase(null)]
        public async Task TestAkaEmptyUserAgent(string ua)
        {
            var ctl = new ForwardController(
                _appSettingsMock.Object,
                _loggerMock.Object,
                _linkForwarderServiceMock.Object,
                _tokenGeneratorMock.Object,
                _memoryCacheMock.Object,
                _linkVerifierMock.Object)
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
