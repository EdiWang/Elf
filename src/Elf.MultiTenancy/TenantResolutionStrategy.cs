using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace Elf.MultiTenancy
{
    public interface ITenantResolutionStrategy
    {
        Task<string> GetTenantIdentifierAsync();
    }

    /// <summary>
    /// Resolve the host to a tenant identifier
    /// </summary>
    public class HostResolutionStrategy : ITenantResolutionStrategy
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public HostResolutionStrategy(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        /// <summary>
        /// Get the tenant identifier
        /// </summary>
        /// <returns></returns>
        public async Task<string> GetTenantIdentifierAsync()
        {
            return await Task.FromResult(_httpContextAccessor.HttpContext.Request.Host.Host);
        }
    }
}
