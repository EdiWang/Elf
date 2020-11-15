using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Threading.Tasks;
using Elf.Web.Middleware;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Primitives;
using Moq;
using NUnit.Framework;

namespace Elf.Tests
{
    [TestFixture]
    [ExcludeFromCodeCoverage]
    public class PoweredByMiddlewareTests
    {
        [Test]
        public async Task TestPoweredByHeader()
        {
            const string key = "X-Powered-By";
            const string value = "Elf";

            var headersArray = new Dictionary<string, StringValues> { { key, string.Empty } };
            var headersDic = new HeaderDictionary(headersArray);
            var httpResponseMock = new Mock<HttpResponse>();
            httpResponseMock.SetupGet(r => r.Headers).Returns(headersDic);

            var httpContextMock = new Mock<HttpContext>();
            httpContextMock.Setup(c => c.Response).Returns(httpResponseMock.Object);

            static Task RequestDelegate(HttpContext context) => Task.CompletedTask;
            var middleware = new PoweredByMiddleware(RequestDelegate);

            await middleware.Invoke(httpContextMock.Object);

            Assert.AreEqual(value, headersArray[key]);
            httpResponseMock.Verify(r => r.Headers, Times.Once);
        }
    }
}
