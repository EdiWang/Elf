using Elf.Data;
using Microsoft.Extensions.Caching.Distributed;
using System.Text.Json;

namespace Elf.Api;

public static class DistributedCacheExtensions
{
    public static async Task<LinkEntity> GetLink(this IDistributedCache cache, string token)
    {
        var cachedLinkBytes = await cache.GetAsync(token);
        if (null == cachedLinkBytes) return null;

        var cachedLinkJson = Encoding.UTF8.GetString(cachedLinkBytes);
        var cachedLink = JsonSerializer.Deserialize<LinkEntity>(cachedLinkJson);

        return cachedLink;
    }

    public static async Task SetLink(this IDistributedCache cache, string token, LinkEntity link, TimeSpan? ttl)
    {
        if (ttl is null || ttl <= TimeSpan.Zero)
        {
            return;
        }

        var json = JsonSerializer.Serialize(link);
        var bytes = Encoding.UTF8.GetBytes(json);

        await cache.SetAsync(token, bytes, new() { AbsoluteExpirationRelativeToNow = ttl });
    }
}