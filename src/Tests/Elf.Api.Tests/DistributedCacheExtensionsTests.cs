using Elf.Data;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;

namespace Elf.Api.Tests;

public class DistributedCacheExtensionsTests
{
    [Theory]
    [InlineData(null)]
    [InlineData(0)]
    [InlineData(-1)]
    public async Task SetLink_WithNonPositiveOrNullTtl_DoesNotCache(int? ttlSeconds)
    {
        var cache = CreateCache();
        var link = CreateLink();

        await cache.SetLink(link.FwToken, link, ttlSeconds.HasValue ? TimeSpan.FromSeconds(ttlSeconds.Value) : null);

        var cachedLink = await cache.GetLink(link.FwToken);
        Assert.Null(cachedLink);
    }

    [Fact]
    public async Task SetLink_WithPositiveTtl_CachesLink()
    {
        var cache = CreateCache();
        var link = CreateLink();

        await cache.SetLink(link.FwToken, link, TimeSpan.FromSeconds(30));

        var cachedLink = await cache.GetLink(link.FwToken);
        Assert.NotNull(cachedLink);
        Assert.Equal(link.Id, cachedLink.Id);
        Assert.Equal(link.OriginUrl, cachedLink.OriginUrl);
        Assert.Equal(link.FwToken, cachedLink.FwToken);
    }

    private static IDistributedCache CreateCache() =>
        new MemoryDistributedCache(Options.Create(new MemoryDistributedCacheOptions()));

    private static LinkEntity CreateLink() => new()
    {
        Id = 1,
        OriginUrl = "https://example.com",
        FwToken = "abc12345",
        Note = "Test link",
        IsEnabled = true,
        UpdateTimeUtc = DateTime.UtcNow,
        AkaName = "test",
        TTL = 30
    };
}
