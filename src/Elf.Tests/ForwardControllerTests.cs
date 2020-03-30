using System;
using System.Collections.Generic;
using System.Text;
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

namespace Elf.Tests
{
    [TestFixture]
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
            _loggerMock = new Mock<ILogger<ForwardController>>();
            _appSettingsMock = new Mock<IOptions<AppSettings>>();
            _tokenGeneratorMock = new Mock<ITokenGenerator>();
            _linkVerifierMock = new Mock<ILinkVerifier>();
            _linkForwarderServiceMock = new Mock<ILinkForwarderService>();
            _memoryCacheMock = new Mock<IMemoryCache>();
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
        public async Task TestForwardEmptyUA(string ua)
        {
            var ctl = new ForwardController(
                _appSettingsMock.Object,
                _loggerMock.Object,
                _linkForwarderServiceMock.Object,
                _tokenGeneratorMock.Object,
                _memoryCacheMock.Object,
                _linkVerifierMock.Object)
            {
                ControllerContext = new ControllerContext
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
            string inputToken = "996";
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
                ControllerContext = new ControllerContext
                {
                    HttpContext = new DefaultHttpContext()
                }
            };

            ctl.ControllerContext.HttpContext.Request.Headers["User-Agent"] = "Unit Test";

            var result = await ctl.Forward(inputToken);
            Assert.IsInstanceOf(typeof(BadRequestResult), result);
        }

        [Test]
        public async Task TestCacheFound()
        {
            string inputToken = "996";
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
                ControllerContext = new ControllerContext
                {
                    HttpContext = new DefaultHttpContext()
                }
            };

            ctl.ControllerContext.HttpContext.Request.Headers["User-Agent"] = "Unit Test";

            var result = await ctl.Forward(inputToken);
            Assert.IsInstanceOf(typeof(RedirectResult), result);
        }
    }
}
