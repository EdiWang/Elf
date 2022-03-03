using System.Text;
using System.Text.Json;
using Elf.Services.Entities;
using Microsoft.Extensions.Caching.Distributed;

namespace Elf.Api;

public static class DistributedCacheExtensions
{
    public static async Task<Link> GetLink(this IDistributedCache cache, string token)
    {
        var cachedLinkBytes = await cache.GetAsync(token);
        if (null == cachedLinkBytes) return null;

        var cachedLinkJson = Encoding.UTF8.GetString(cachedLinkBytes);
        var cachedLink = JsonSerializer.Deserialize<Link>(cachedLinkJson);

        return cachedLink;
    }

    public static async Task SetLink(this IDistributedCache cache, string token, Link link, TimeSpan? ttl = null)
    {
        var json = JsonSerializer.Serialize(link);
        var bytes = Encoding.UTF8.GetBytes(json);

        if (ttl == null)
        {
            await cache.SetAsync(token, bytes);
        }
        else
        {
            await cache.SetAsync(token, bytes, new() { SlidingExpiration = ttl });
        }
    }
}