using System.Diagnostics.CodeAnalysis;
using Microsoft.Extensions.Caching.Memory;
using Moq;

namespace Elf.Tests;

[ExcludeFromCodeCoverage]
public static class MockMemoryCacheService
{
    public static IMemoryCache GetMemoryCache(object expectedValue, bool found = true)
    {
        var mockMemoryCache = new Mock<IMemoryCache>();
        mockMemoryCache
            .Setup(x => x.TryGetValue(It.IsAny<object>(), out expectedValue))
            .Returns(found);
        return mockMemoryCache.Object;
    }
}
