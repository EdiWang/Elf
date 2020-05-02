using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace Elf.Web.Middleware
{
    public class PoweredByMiddleware
    {
        private readonly RequestDelegate _next;

        public PoweredByMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public Task Invoke(HttpContext httpContext)
        {
            httpContext.Response.Headers["X-Powered-By"] = "Elf";
            return _next.Invoke(httpContext);
        }
    }
}
