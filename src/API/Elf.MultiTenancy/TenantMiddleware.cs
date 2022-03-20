using Microsoft.AspNetCore.Http;

namespace Elf.MultiTenancy;

public class Constants
{
    public static string HttpContextTenantKey => "Tenant";
}

public class TenantMiddleware<T> where T : Tenant
{
    private readonly RequestDelegate _next;

    public TenantMiddleware(RequestDelegate next) => _next = next;

    public async Task Invoke(HttpContext context)
    {
        if (!context.Items.ContainsKey(Constants.HttpContextTenantKey))
        {
            if (context.RequestServices.GetService(typeof(TenantAccessService<T>)) is TenantAccessService<T> tenantService)
            {
                context.Items.Add(Constants.HttpContextTenantKey, await tenantService.GetTenantAsync());
            }
        }

        //Continue processing
        if (_next != null) await _next(context);
    }
}
