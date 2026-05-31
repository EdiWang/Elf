using Elf.Admin.Data;
using Microsoft.EntityFrameworkCore;

namespace Elf.Admin.Tests;

public class ElfDbContextIndexTests
{
    [Fact]
    public void LinkEntity_HasExpectedIndexes()
    {
        using var dbContext = CreateDbContext();
        var entityType = dbContext.Model.FindEntityType(typeof(LinkEntity));

        Assert.NotNull(entityType);
        Assert.Contains(entityType.GetIndexes(), index =>
            index.IsUnique &&
            index.GetDatabaseName() == "IX_Link_FwToken" &&
            index.GetFilter() == "[FwToken] IS NOT NULL");
        Assert.Contains(entityType.GetIndexes(), index =>
            index.IsUnique &&
            index.GetDatabaseName() == "IX_Link_AkaName" &&
            index.GetFilter() == "[AkaName] IS NOT NULL");
        Assert.Contains(entityType.GetIndexes(), index =>
            !index.IsUnique &&
            index.GetDatabaseName() == "IX_Link_UpdateTimeUtc");
    }

    [Fact]
    public void TagEntity_HasUniqueNameIndex()
    {
        using var dbContext = CreateDbContext();
        var entityType = dbContext.Model.FindEntityType(typeof(TagEntity));

        Assert.NotNull(entityType);
        Assert.Contains(entityType.GetIndexes(), index =>
            index.IsUnique &&
            index.GetDatabaseName() == "IX_Tag_Name");
    }

    [Fact]
    public void LinkTrackingEntity_HasExpectedReportingIndexes()
    {
        using var dbContext = CreateDbContext();
        var entityType = dbContext.Model.FindEntityType(typeof(LinkTrackingEntity));

        Assert.NotNull(entityType);
        Assert.Contains(entityType.GetIndexes(), index =>
            index.GetDatabaseName() == "IX_LinkTracking_LinkId_RequestTimeUtc");
        Assert.Contains(entityType.GetIndexes(), index =>
            index.GetDatabaseName() == "IX_LinkTracking_RequestTimeUtc");
    }

    private static ElfDbContext CreateDbContext()
    {
        var options = new DbContextOptionsBuilder<ElfDbContext>()
            .UseSqlServer("Server=(localdb)\\MSSQLLocalDB;Database=elf-metadata-tests;Trusted_Connection=True;")
            .Options;

        return new ElfDbContext(options);
    }
}
