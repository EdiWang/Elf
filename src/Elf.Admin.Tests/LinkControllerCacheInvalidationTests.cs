using Elf.Admin.Controllers;
using Elf.Admin.Data;
using Elf.Admin.Features;
using Elf.Shared;
using LiteBus.Commands;
using LiteBus.Commands.Abstractions;
using LiteBus.Extensions.Microsoft.DependencyInjection;
using LiteBus.Queries.Abstractions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.FeatureManagement;
using Moq;

namespace Elf.Admin.Tests;

public class LinkControllerCacheInvalidationTests
{
    [Fact]
    public async Task SetEnable_WhenCommandReturnsToken_RemovesCachedLink()
    {
        var cache = new Mock<IDistributedCache>();
        await using var serviceProvider = CreateServiceProvider(out var databaseName);

        await SeedLinkAsync(databaseName);

        var controller = new LinkController(
            Mock.Of<ILinkVerifier>(),
            cache.Object,
            Mock.Of<IFeatureManager>(),
            serviceProvider.GetRequiredService<ICommandMediator>(),
            Mock.Of<IQueryMediator>());

        var result = await controller.SetEnable(1, false);

        Assert.IsType<NoContentResult>(result);
        cache.Verify(c => c.RemoveAsync("abc12345", It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task SetEnable_WhenCommandReturnsNull_DoesNotRemoveCachedLink()
    {
        var cache = new Mock<IDistributedCache>();
        await using var serviceProvider = CreateServiceProvider(out _);

        var controller = new LinkController(
            Mock.Of<ILinkVerifier>(),
            cache.Object,
            Mock.Of<IFeatureManager>(),
            serviceProvider.GetRequiredService<ICommandMediator>(),
            Mock.Of<IQueryMediator>());

        var result = await controller.SetEnable(404, false);

        Assert.IsType<NoContentResult>(result);
        cache.Verify(c => c.RemoveAsync(It.IsAny<string>(), It.IsAny<CancellationToken>()), Times.Never);
    }

    private static ServiceProvider CreateServiceProvider(out string databaseName)
    {
        var inMemoryDatabaseName = Guid.NewGuid().ToString();
        databaseName = inMemoryDatabaseName;

        var services = new ServiceCollection();
        services.AddDbContext<ElfDbContext>(options => options.UseInMemoryDatabase(inMemoryDatabaseName));
        services.AddTransient<SetEnableCommandHandler>();
        services.AddLiteBus(liteBus =>
        {
            liteBus.AddCommandModule(module =>
            {
                module.RegisterFromAssembly(typeof(SetEnableCommand).Assembly);
            });
        });

        return services.BuildServiceProvider();
    }

    private static async Task SeedLinkAsync(string databaseName)
    {
        var options = new DbContextOptionsBuilder<ElfDbContext>()
            .UseInMemoryDatabase(databaseName)
            .Options;

        await using var dbContext = new ElfDbContext(options);
        dbContext.Link.Add(new LinkEntity
        {
            Id = 1,
            OriginUrl = "https://example.com",
            FwToken = "abc12345",
            IsEnabled = true,
            UpdateTimeUtc = DateTime.UtcNow
        });
        await dbContext.SaveChangesAsync(TestContext.Current.CancellationToken);
    }
}
