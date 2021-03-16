using System;
using System.Linq;
using System.Threading.Tasks;

namespace Elf.MultiTenancy
{
    public interface ITenantStore<T> where T : Tenant
    {
        Task<T> GetTenantAsync(string identifier);
    }

    /// <summary>
    /// In memory store for testing
    /// </summary>
    public class InMemoryTenantStore : ITenantStore<Tenant>
    {
        /// <summary>
        /// Get a tenant for a given identifier
        /// </summary>
        /// <param name="identifier"></param>
        /// <returns></returns>
        public async Task<Tenant> GetTenantAsync(string identifier)
        {
            var tenant = new[]
            {
                new Tenant
                {
                    Id = "80fdb3c0-5888-4295-bf40-ebee0e3cd8f3",
                    Identifier = "localhost",
                    Items = new()
                    {
                        { "DefaultRedirectionUrl","https://greenhat.today" }
                    }
                }
            }.SingleOrDefault(t => t.Identifier == identifier);

            return await Task.FromResult(tenant);
        }
    }

    public class AppSettingsTenantStore : ITenantStore<Tenant>
    {
        public async Task<Tenant> GetTenantAsync(string identifier)
        {
            throw new NotImplementedException();
        }
    }
}
