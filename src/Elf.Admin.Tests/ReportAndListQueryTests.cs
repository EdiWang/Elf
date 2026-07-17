using Elf.Admin.Features;
using Elf.Admin.Models;
using Elf.Data;
using Microsoft.EntityFrameworkCore;

namespace Elf.Admin.Tests;

public class ReportAndListQueryTests
{
    [Fact]
    public async Task ListLinkQuery_ReturnsHitsAndTagsWithoutLoadingFullTrackingRows()
    {
        await using var dbContext = CreateDbContext();
        var tag = new TagEntity { Id = 1, Name = "docs" };
        var link = new LinkEntity
        {
            Id = 1,
            OriginUrl = "https://example.com/docs",
            FwToken = "abc12345",
            Note = "Docs",
            IsEnabled = true,
            UpdateTimeUtc = new DateTime(2026, 5, 31, 12, 0, 0, DateTimeKind.Utc),
            Tags = [tag],
            LinkTrackings =
            [
                CreateTracking(1, 1, new DateTime(2026, 5, 31, 12, 1, 0, DateTimeKind.Utc)),
                CreateTracking(2, 1, new DateTime(2026, 5, 31, 12, 2, 0, DateTimeKind.Utc))
            ]
        };

        dbContext.Link.Add(link);
        await dbContext.SaveChangesAsync(TestContext.Current.CancellationToken);
        dbContext.ChangeTracker.Clear();

        var handler = new ListLinkQueryHandler(dbContext);

        var (links, totalRows) = await handler.HandleAsync(new ListLinkQuery(0, 10), TestContext.Current.CancellationToken);

        Assert.Equal(1, totalRows);
        var result = Assert.Single(links);
        Assert.Equal(2, result.Hits);
        var resultTag = Assert.Single(result.Tags);
        Assert.Equal("docs", resultTag.Name);
    }

    [Fact]
    public async Task GetLinkTrackingDateCount_IncludesFullEndDateAndExcludesNextDay()
    {
        await using var dbContext = CreateDbContext();
        await SeedDateRangeTrackingAsync(dbContext);
        var handler = new GetLinkTrackingDateCountQueryHandler(dbContext);

        var result = await handler.HandleAsync(new GetLinkTrackingDateCountQuery(CreateSingleDayRange()), TestContext.Current.CancellationToken);

        var day = Assert.Single(result);
        Assert.Equal(new DateTime(2026, 5, 31), day.TrackingDateUtc);
        Assert.Equal(2, day.RequestCount);
    }

    [Fact]
    public async Task GetMostRequestedLinkCount_IncludesFullEndDateAndExcludesNextDay()
    {
        await using var dbContext = CreateDbContext();
        await SeedDateRangeTrackingAsync(dbContext);
        var handler = new GetMostRequestedLinkCountQueryHandler(dbContext);

        var result = await handler.HandleAsync(new GetMostRequestedLinkCountQuery(CreateSingleDayRange()), TestContext.Current.CancellationToken);

        var linkCount = Assert.Single(result);
        Assert.Equal("abc12345", linkCount.FwToken);
        Assert.Equal(2, linkCount.RequestCount);
    }

    [Fact]
    public async Task GetClientTypeCounts_IncludesFullEndDateAndExcludesNextDay()
    {
        await using var dbContext = CreateDbContext();
        await SeedDateRangeTrackingAsync(dbContext);
        var handler = new GetClientTypeCountsQueryHandler(dbContext);

        var result = await handler.HandleAsync(new GetClientTypeCountsQuery(CreateSingleDayRange(), TopTypes: 5), TestContext.Current.CancellationToken);

        Assert.Equal(2, result.Sum(p => p.Count));
    }

    [Fact]
    public async Task GetLinkTrackingDateCountByLinkId_IncludesFullEndDateAndExcludesNextDay()
    {
        await using var dbContext = CreateDbContext();
        await SeedDateRangeTrackingAsync(dbContext);
        var handler = new GetLinkTrackingDateCountByLinkIdQueryHandler(dbContext);

        var result = await handler.HandleAsync(new GetLinkTrackingDateCountByLinkIdQuery(1, CreateSingleDayRange()), TestContext.Current.CancellationToken);

        var day = Assert.Single(result);
        Assert.Equal(2, day.RequestCount);
    }

    private static async Task SeedDateRangeTrackingAsync(ElfDbContext dbContext)
    {
        dbContext.Link.Add(new LinkEntity
        {
            Id = 1,
            OriginUrl = "https://example.com/docs",
            FwToken = "abc12345",
            Note = "Docs",
            IsEnabled = true,
            UpdateTimeUtc = new DateTime(2026, 5, 31, 12, 0, 0, DateTimeKind.Utc),
            LinkTrackings =
            [
                CreateTracking(1, 1, new DateTime(2026, 5, 31, 0, 0, 0, DateTimeKind.Utc)),
                CreateTracking(2, 1, new DateTime(2026, 5, 31, 23, 59, 59, DateTimeKind.Utc)),
                CreateTracking(3, 1, new DateTime(2026, 6, 1, 0, 0, 0, DateTimeKind.Utc))
            ]
        });

        await dbContext.SaveChangesAsync(TestContext.Current.CancellationToken);
        dbContext.ChangeTracker.Clear();
    }

    private static DateRangeRequest CreateSingleDayRange() => new()
    {
        StartDateUtc = new DateTime(2026, 5, 31, 0, 0, 0, DateTimeKind.Utc),
        EndDateUtc = new DateTime(2026, 5, 31, 0, 0, 0, DateTimeKind.Utc)
    };

    private static LinkTrackingEntity CreateTracking(int id, int linkId, DateTime requestTimeUtc) => new()
    {
        Id = new Guid($"00000000-0000-0000-0000-{id:000000000000}"),
        LinkId = linkId,
        RequestTimeUtc = requestTimeUtc,
        UserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/125.0 Safari/537.36",
        IpAddress = "203.0.113.10"
    };

    private static ElfDbContext CreateDbContext()
    {
        var options = new DbContextOptionsBuilder<ElfDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        return new ElfDbContext(options);
    }
}
