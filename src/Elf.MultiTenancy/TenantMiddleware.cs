using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.VisualBasic;

namespace Elf.MultiTenancy
{
    public class Constants
    {
        public static string HttpContextTenantKey = "Tenant";
    }

    public class TenantMiddleware<T> where T : Tenant
    {
        private readonly RequestDelegate next;

        public TenantMiddleware(RequestDelegate next)
        {
            this.next = next;
        }

        public async Task Invoke(HttpContext context)
        {
            if (!context.Items.ContainsKey(Constants.HttpContextTenantKey))
            {
                var tenantService = context.RequestServices.GetService(typeof(TenantAccessService<T>)) as TenantAccessService<T>;
                context.Items.Add(Constants.HttpContextTenantKey, await tenantService.GetTenantAsync());
            }

            //Continue processing
            if (next != null)
                await next(context);
        }
    }
}
