using Microsoft.AspNetCore.Mvc.Filters;

namespace LinkForwarder.Web.Filters
{
    public class AddForwarderHeaderAttribute : ResultFilterAttribute
    {
        public override void OnResultExecuting(ResultExecutingContext context)
        {
            context.HttpContext.Response.Headers.Add("X-LinkForwarder",
                new[]
                {
                    Utils.AppVersion
                });
            base.OnResultExecuting(context);
        }
    }
}
