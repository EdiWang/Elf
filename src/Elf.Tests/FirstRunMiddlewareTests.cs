using System;
using System.Threading.Tasks;
using Elf.Web.Middleware;
using Microsoft.AspNetCore.Http;
using NUnit.Framework;

namespace Elf.Tests
{
    [TestFixture]
    public class FirstRunMiddlewareTests
    {
        [Test]
        public async Task TestFirstRunWithToken()
        {
            var ctx = new DefaultHttpContext();
            AppDomain.CurrentDomain.SetData("FIRSTRUN_INIT_SUCCESS", true);

            static Task RequestDelegate(HttpContext context) => Task.CompletedTask;
            var middleware = new FirstRunMiddleware(RequestDelegate);
            await middleware.Invoke(ctx, null, null);

            Assert.Pass();
        }
    }
}
