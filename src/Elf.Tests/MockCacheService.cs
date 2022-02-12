using Moq;
using System.Diagnostics.CodeAnalysis;
using System.Text;
using System.Text.Json;
using Elf.Services.Entities;
using Microsoft.Extensions.Caching.Distributed;

namespace Elf.Tests;

[ExcludeFromCodeCoverage]
public static class MockCacheService
{
    public static IDistributedCache GetFakeCache(Link link, bool found = true)
    {
        var json = JsonSerializer.Serialize(link);
        var bytes = Encoding.UTF8.GetBytes(json);

        var cache = new Mock<IDistributedCache>();
        cache.Setup(x => x.GetAsync(It.IsAny<string>(), CancellationToken.None))
             .Returns(found ? Task.FromResult(bytes) : Task.FromResult((byte[])null));
        return cache.Object;
    }
}
