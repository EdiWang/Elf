using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Threading.Tasks;
using Elf.Web;
using Elf.Web.Filters;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Abstractions;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Routing;
using NUnit.Framework;

namespace Elf.Tests.Filters
{
    [TestFixture]
    [ExcludeFromCodeCoverage]
    public class FiltersTests
    {
        [Test]
        public void TestAddForwarderHeaderAttribute()
        {
            var ctx = CreateResultExecutingContext(null);

            var att = new AddForwarderHeaderAttribute();
            att.OnResultExecuting(ctx);

            var header = ctx.HttpContext.Response.Headers["X-Elf-Version"];
            Assert.IsNotNull(header);
            Assert.AreEqual(header, Utils.AppVersion);
        }

        #region Helper Methods

        // https://github.com/dotnet/aspnetcore/blob/master/src/Mvc/shared/Mvc.Core.TestCommon/CommonFilterTest.cs

        private static ActionExecutingContext CreateActionExecutingContext(IFilterMetadata filter)
        {
            return new ActionExecutingContext(
                CreateActionContext(),
                new IFilterMetadata[] { filter, },
                new Dictionary<string, object>(),
                controller: new object());
        }

        private static ActionExecutedContext CreateActionExecutedContext(ActionExecutingContext context)
        {
            return new ActionExecutedContext(context, context.Filters, context.Controller)
            {
                Result = context.Result,
            };
        }

        private static ResultExecutingContext CreateResultExecutingContext(IFilterMetadata filter)
        {
            return new ResultExecutingContext(
                CreateActionContext(),
                new IFilterMetadata[] { filter, },
                new NoOpResult(),
                controller: new object());
        }

        private static ResultExecutedContext CreateResultExecutedContext(ResultExecutingContext context)
        {
            return new ResultExecutedContext(context, context.Filters, context.Result, context.Controller);
        }

        private static ActionContext CreateActionContext()
        {
            return new ActionContext(new DefaultHttpContext(), new RouteData(), new ActionDescriptor());
        }

        private class NoOpResult : IActionResult
        {
            public Task ExecuteResultAsync(ActionContext context)
            {
                return Task.FromResult(true);
            }
        }

        #endregion
    }
}
