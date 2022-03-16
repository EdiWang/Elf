using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;

namespace Elf.MultiTenancy;

/// <summary>
/// Configure tenant services
/// </summary>
public class TenantBuilder<T> where T : Tenant
{
    private readonly IServiceCollection _services;

    public TenantBuilder(IServiceCollection services)
    {
        services.AddTransient<TenantAccessService<T>>();
        services.AddTransient<ITenantAccessor<Tenant>, TenantAccessor<Tenant>>();

        _services = services;
    }

    /// <summary>
    /// Register the tenant resolver implementation
    /// </summary>
    /// <typeparam name="TResolutionStrategy"></typeparam>
    /// <param name="lifetime"></param>
    /// <returns></returns>
    public TenantBuilder<T> WithResolutionStrategy<TResolutionStrategy>(ServiceLifetime lifetime = ServiceLifetime.Transient)
        where TResolutionStrategy : class, ITenantResolutionStrategy
    {
        _services.TryAddSingleton<IHttpContextAccessor, HttpContextAccessor>();
        _services.Add(ServiceDescriptor.Describe(typeof(ITenantResolutionStrategy), typeof(TResolutionStrategy), lifetime));
        return this;
    }

    /// <summary>
    /// Register the tenant store implementation
    /// </summary>
    /// <typeparam name="TStore"></typeparam>
    /// <param name="lifetime"></param>
    /// <returns></returns>
    public TenantBuilder<T> WithStore<TStore>(ServiceLifetime lifetime = ServiceLifetime.Transient)
        where TStore : class, ITenantStore<T>
    {
        _services.Add(ServiceDescriptor.Describe(typeof(ITenantStore<T>), typeof(TStore), lifetime));
        return this;
    }
}
