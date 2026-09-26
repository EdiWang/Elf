using Elf.Admin.Features;
using Elf.Data;
using Microsoft.EntityFrameworkCore;

namespace Elf.Admin.Tests;

public class SetEnableCommandHandlerTests
{
    [Fact]
    public async Task HandleAsync_WhenLinkExists_UpdatesEnabledStateAndReturnsToken()
    {
        await using var dbContext = CreateDbContext();
        dbContext.Link.Add(new LinkEntity
        {
            Id = 1,
            OriginUrl = "https://example.com",
            FwToken = "abc12345",
            IsEnabled = true,
            UpdateTimeUtc = DateTime.UtcNow
        });
        await dbContext.SaveChangesAsync(TestContext.Current.CancellationToken);

        var handler = new SetEnableCommandHandler(dbContext);

        var token = await handler.HandleAsync(new SetEnableCommand(1, false), TestContext.Current.CancellationToken);

        var link = await dbContext.Link.FindAsync([1], TestContext.Current.CancellationToken);
        Assert.Equal("abc12345", token);
        Assert.NotNull(link);
        Assert.False(link.IsEnabled);
    }

    [Fact]
    public async Task HandleAsync_WhenLinkDoesNotExist_ReturnsNull()
    {
        await using var dbContext = CreateDbContext();
        var handler = new SetEnableCommandHandler(dbContext);

        var token = await handler.HandleAsync(new SetEnableCommand(404, false), TestContext.Current.CancellationToken);

        Assert.Null(token);
    }

    private static ElfDbContext CreateDbContext()
    {
        var options = new DbContextOptionsBuilder<ElfDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        return new ElfDbContext(options);
    }
}
