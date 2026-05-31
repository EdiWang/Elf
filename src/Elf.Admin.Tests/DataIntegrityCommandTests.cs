using Elf.Admin.Data;
using Elf.Admin.Features;
using Elf.Admin.Models;
using Elf.TokenGenerator;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;

namespace Elf.Admin.Tests;

public class DataIntegrityCommandTests
{
    [Fact]
    public async Task CreateLink_WhenAkaNameAlreadyExists_ThrowsDuplicateResourceException()
    {
        await using var dbContext = CreateDbContext();
        await SeedLinkAsync(dbContext, id: 1, fwToken: "abc12345", akaName: "docs");

        var handler = new CreateLinkCommandHandler(
            dbContext,
            new FixedTokenGenerator("def67890"),
            NullLogger<CreateLinkCommandHandler>.Instance);

        var command = new CreateLinkCommand(new LinkEditModel
        {
            OriginUrl = "https://example.com/new",
            AkaName = "docs",
            IsEnabled = true,
            TTL = 0
        });

        await Assert.ThrowsAsync<DuplicateResourceException>(() =>
            handler.HandleAsync(command, TestContext.Current.CancellationToken));
    }

    [Fact]
    public async Task EditLink_WhenAkaNameAlreadyExistsOnAnotherLink_ThrowsDuplicateResourceException()
    {
        await using var dbContext = CreateDbContext();
        await SeedLinkAsync(dbContext, id: 1, fwToken: "abc12345", akaName: "docs");
        await SeedLinkAsync(dbContext, id: 2, fwToken: "def67890", akaName: "blog");

        var handler = new EditLinkCommandHandler(dbContext);
        var command = new EditLinkCommand(2, new LinkEditModel
        {
            OriginUrl = "https://example.com/blog",
            AkaName = "docs",
            IsEnabled = true,
            TTL = 0,
            Tags = []
        });

        await Assert.ThrowsAsync<DuplicateResourceException>(() =>
            handler.HandleAsync(command, TestContext.Current.CancellationToken));
    }

    [Fact]
    public async Task UpdateTag_WhenNameAlreadyExists_ThrowsDuplicateResourceException()
    {
        await using var dbContext = CreateDbContext();
        dbContext.Tag.AddRange(
            new TagEntity { Id = 1, Name = "docs" },
            new TagEntity { Id = 2, Name = "blog" });
        await dbContext.SaveChangesAsync(TestContext.Current.CancellationToken);

        var handler = new UpdateTagCommandHandler(dbContext);
        var command = new UpdateTagCommand(2, new UpdateTagRequest { Name = " docs " });

        await Assert.ThrowsAsync<DuplicateResourceException>(() =>
            handler.HandleAsync(command, TestContext.Current.CancellationToken));
    }

    [Fact]
    public async Task CreateTag_WhenNameDiffersOnlyByWhitespace_DoesNotCreateDuplicate()
    {
        await using var dbContext = CreateDbContext();
        dbContext.Tag.Add(new TagEntity { Id = 1, Name = "docs" });
        await dbContext.SaveChangesAsync(TestContext.Current.CancellationToken);

        var handler = new CreateTagCommandHandler(dbContext);

        await handler.HandleAsync(new CreateTagCommand(" docs "), TestContext.Current.CancellationToken);

        Assert.Equal(1, await dbContext.Tag.CountAsync(TestContext.Current.CancellationToken));
    }

    private static async Task SeedLinkAsync(ElfDbContext dbContext, int id, string fwToken, string akaName)
    {
        dbContext.Link.Add(new LinkEntity
        {
            Id = id,
            OriginUrl = $"https://example.com/{id}",
            FwToken = fwToken,
            AkaName = akaName,
            IsEnabled = true,
            UpdateTimeUtc = DateTime.UtcNow
        });
        await dbContext.SaveChangesAsync(TestContext.Current.CancellationToken);
    }

    private static ElfDbContext CreateDbContext()
    {
        var options = new DbContextOptionsBuilder<ElfDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        return new ElfDbContext(options);
    }

    private sealed class FixedTokenGenerator(string token) : ITokenGenerator
    {
        public string GenerateToken() => token;

        public bool TryParseToken(string input, out string parsedToken)
        {
            parsedToken = input;
            return !string.IsNullOrWhiteSpace(input);
        }
    }
}
