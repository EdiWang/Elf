using Elf.App.Controllers;
using Elf.App.Features;
using Elf.App.Models;
using Elf.Data;
using Elf.Shared;
using Elf.Shared.Models;
using LiteBus.Commands;
using LiteBus.Commands.Abstractions;
using LiteBus.Extensions.Microsoft.DependencyInjection;
using LiteBus.Messaging;
using LiteBus.Queries;
using LiteBus.Queries.Abstractions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.FeatureManagement;
using Moq;

namespace Elf.App.Tests;

public class LinkControllerCacheInvalidationTests
{
    [Fact]
    public async Task SetEnable_WhenCommandReturnsToken_RemovesCachedLink()
    {
        var cache = new Mock<IMemoryCache>();
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
        cache.Verify(c => c.Remove("abc12345"), Times.Once);
    }

    [Fact]
    public async Task SetEnable_WhenCommandReturnsNull_DoesNotRemoveCachedLink()
    {
        var cache = new Mock<IMemoryCache>();
        await using var serviceProvider = CreateServiceProvider(out _);

        var controller = new LinkController(
            Mock.Of<ILinkVerifier>(),
            cache.Object,
            Mock.Of<IFeatureManager>(),
            serviceProvider.GetRequiredService<ICommandMediator>(),
            Mock.Of<IQueryMediator>());

        var result = await controller.SetEnable(404, false);

        Assert.IsType<NoContentResult>(result);
        cache.Verify(c => c.Remove(It.IsAny<object>()), Times.Never);
    }

    [Fact]
    public async Task Edit_WhenCommandReturnsToken_RemovesCachedLink()
    {
        var cache = new Mock<IMemoryCache>();
        await using var serviceProvider = CreateServiceProvider(out var databaseName);
        await SeedLinkAsync(databaseName);

        var controller = CreateController(cache.Object, serviceProvider);

        var result = await controller.Edit(1, new LinkEditModel
        {
            OriginUrl = "https://example.com/updated",
            IsEnabled = true,
            TTL = 60,
            Tags = []
        });

        Assert.IsType<NoContentResult>(result);
        cache.Verify(c => c.Remove("abc12345"), Times.Once);
    }

    [Fact]
    public async Task Delete_WhenLinkExists_RemovesCachedLink()
    {
        var cache = new Mock<IMemoryCache>();
        await using var serviceProvider = CreateServiceProvider(out var databaseName);
        await SeedLinkAsync(databaseName);

        var controller = CreateController(cache.Object, serviceProvider);

        var result = await controller.Delete(1);

        Assert.IsType<OkResult>(result);
        cache.Verify(c => c.Remove("abc12345"), Times.Once);
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
            liteBus.AddMessaging(_ => { });

            liteBus.AddCommands(module =>
            {
                module.RegisterFromAssembly(typeof(SetEnableCommand).Assembly);
            });

            liteBus.AddQueries(module =>
            {
                module.RegisterFromAssembly(typeof(SetEnableCommand).Assembly);
            });
        });

        return services.BuildServiceProvider();
    }

    private static LinkController CreateController(IMemoryCache cache, ServiceProvider serviceProvider)
    {
        var featureManager = new Mock<IFeatureManager>();
        featureManager
            .Setup(manager => manager.IsEnabledAsync(nameof(FeatureFlags.AllowSelfRedirection)))
            .ReturnsAsync(false);

        var linkVerifier = new Mock<ILinkVerifier>();
        linkVerifier
            .Setup(verifier => verifier.Verify(
                It.IsAny<string>(),
                It.IsAny<IUrlHelper>(),
                It.IsAny<HttpRequest>(),
                It.IsAny<bool>()))
            .Returns(LinkVerifyResult.Valid);

        return new LinkController(
            linkVerifier.Object,
            cache,
            featureManager.Object,
            serviceProvider.GetRequiredService<ICommandMediator>(),
            serviceProvider.GetRequiredService<IQueryMediator>())
        {
            ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext()
            }
        };
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
