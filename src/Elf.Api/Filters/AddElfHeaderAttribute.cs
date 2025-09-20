using Edi.AspNetCore.Utils;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Elf.Api.Filters;

public class AddElfHeaderAttribute : ResultFilterAttribute
{
    public override void OnResultExecuting(ResultExecutingContext context)
    {
        context.HttpContext.Response.Headers.Append("X-Elf-Version", new[] { VersionHelper.AppVersion });
        base.OnResultExecuting(context);
    }
}
