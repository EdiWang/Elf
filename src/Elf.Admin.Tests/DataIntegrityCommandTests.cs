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

    [Fact]
    public async Task CreateTag_NormalizesNameToLowercase()
    {
        await using var dbContext = CreateDbContext();
        var handler = new CreateTagCommandHandler(dbContext);

        await handler.HandleAsync(new CreateTagCommand(" DOCS "), TestContext.Current.CancellationToken);

        var tag = Assert.Single(await dbContext.Tag.ToListAsync(TestContext.Current.CancellationToken));
        Assert.Equal("docs", tag.Name);
    }

    [Fact]
    public async Task EditLink_NormalizesTagsToLowercaseAndDistinctValues()
    {
        await using var dbContext = CreateDbContext();
        await SeedLinkAsync(dbContext, id: 1, fwToken: "abc12345", akaName: "docs");
        var handler = new EditLinkCommandHandler(dbContext);

        await handler.HandleAsync(new EditLinkCommand(1, new LinkEditModel
        {
            OriginUrl = "https://example.com/docs",
            AkaName = "docs",
            IsEnabled = true,
            Tags = [" DOCS ", "docs", "Blog"]
        }), TestContext.Current.CancellationToken);

        var tags = await dbContext.Tag.OrderBy(t => t.Name).Select(t => t.Name).ToListAsync(TestContext.Current.CancellationToken);
        Assert.Equal(["blog", "docs"], tags);
    }

    [Fact]
    public async Task CreateLink_WhenAkaNameHasInvalidFormat_ThrowsValidationException()
    {
        await using var dbContext = CreateDbContext();
        var handler = new CreateLinkCommandHandler(
            dbContext,
            new FixedTokenGenerator("abc12345"),
            NullLogger<CreateLinkCommandHandler>.Instance);

        var command = new CreateLinkCommand(new LinkEditModel
        {
            OriginUrl = "https://example.com/new",
            AkaName = "Docs-",
            IsEnabled = true
        });

        await Assert.ThrowsAsync<System.ComponentModel.DataAnnotations.ValidationException>(() =>
            handler.HandleAsync(command, TestContext.Current.CancellationToken));
    }

    [Fact]
    public async Task DeleteLink_RemovesLinkAndClearsTagRelationship()
    {
        await using var dbContext = CreateDbContext();
        var tag = new TagEntity { Id = 1, Name = "docs" };
        var link = new LinkEntity
        {
            Id = 1,
            OriginUrl = "https://example.com/docs",
            FwToken = "abc12345",
            AkaName = "docs",
            IsEnabled = true,
            UpdateTimeUtc = DateTime.UtcNow
        };
        link.Tags.Add(tag);
        dbContext.Link.Add(link);
        await dbContext.SaveChangesAsync(TestContext.Current.CancellationToken);

        var handler = new DeleteLinkCommandHandler(dbContext);

        await handler.HandleAsync(new DeleteLinkCommand(1), TestContext.Current.CancellationToken);

        Assert.Empty(await dbContext.Link.ToListAsync(TestContext.Current.CancellationToken));
        var remainingTag = Assert.Single(await dbContext.Tag.Include(t => t.Links).ToListAsync(TestContext.Current.CancellationToken));
        Assert.Equal("docs", remainingTag.Name);
        Assert.Empty(remainingTag.Links);
    }

    [Fact]
    public async Task DeleteLink_WhenLinkDoesNotExist_DoesNotThrow()
    {
        await using var dbContext = CreateDbContext();
        var handler = new DeleteLinkCommandHandler(dbContext);

        await handler.HandleAsync(new DeleteLinkCommand(404), TestContext.Current.CancellationToken);

        Assert.Empty(await dbContext.Link.ToListAsync(TestContext.Current.CancellationToken));
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
