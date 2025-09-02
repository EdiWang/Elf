using Elf.Admin.Data;
using Elf.Admin.Models;
using Elf.TokenGenerator;
using LiteBus.Commands.Abstractions;
using Microsoft.EntityFrameworkCore;

namespace Elf.Admin.Features;

public record CreateLinkCommand(LinkEditModel Payload) : ICommand;

public class CreateLinkCommandHandler(
    ElfDbContext dbContext,
    ITokenGenerator tokenGenerator,
    ILogger<CreateLinkCommandHandler> logger) : ICommandHandler<CreateLinkCommand>
{
    public async Task HandleAsync(CreateLinkCommand request, CancellationToken ct)
    {
        // Check if link already exists and handle early return
        var existingLink = await dbContext.Link
            .FirstOrDefaultAsync(p => p.OriginUrl == request.Payload.OriginUrl, ct);

        if (existingLink is not null)
        {
            if (tokenGenerator.TryParseToken(existingLink.FwToken, out var validToken))
            {
                logger.LogInformation("Link already exists for token '{Token}'", validToken);
                return;
            }

            logger.LogError("Invalid token '{Token}' found for existing url '{Url}'",
                existingLink.FwToken, request.Payload.OriginUrl);
        }

        // Generate unique token
        var token = await GenerateUniqueTokenAsync(ct);
        logger.LogInformation("Generated Token '{Token}' for url '{Url}'", token, request.Payload.OriginUrl);

        // Use database transaction for consistency
        using var transaction = await dbContext.Database.BeginTransactionAsync(ct);
        try
        {
            // Create and configure link entity
            var link = CreateLinkEntity(request.Payload, token);

            // Handle tags if provided
            if (request.Payload.Tags is { Length: > 0 })
            {
                await ProcessTagsAsync(link, request.Payload.Tags, ct);
            }

            await dbContext.AddAsync(link, ct);
            await dbContext.SaveChangesAsync(ct);
            await transaction.CommitAsync(ct);
        }
        catch
        {
            await transaction.RollbackAsync(ct);
            throw;
        }
    }

    private async Task<string> GenerateUniqueTokenAsync(CancellationToken ct)
    {
        string token;
        int attempts = 0;
        const int maxAttempts = 10;

        do
        {
            token = tokenGenerator.GenerateToken();
            attempts++;

            if (attempts > maxAttempts)
            {
                throw new InvalidOperationException("Failed to generate unique token after maximum attempts");
            }
        }
        while (await dbContext.Link.AnyAsync(p => p.FwToken == token, ct));

        return token;
    }

    private static LinkEntity CreateLinkEntity(LinkEditModel payload, string token)
    {
        return new LinkEntity
        {
            FwToken = token,
            IsEnabled = payload.IsEnabled,
            Note = payload.Note,
            AkaName = string.IsNullOrWhiteSpace(payload.AkaName) ? null : payload.AkaName,
            OriginUrl = payload.OriginUrl,
            UpdateTimeUtc = DateTime.UtcNow,
            TTL = payload.TTL
        };
    }

    private async Task ProcessTagsAsync(LinkEntity link, string[] tagNames, CancellationToken ct)
    {
        // Get existing tags in batch
        var existingTags = await dbContext.Tag
            .Where(t => tagNames.Contains(t.Name))
            .ToListAsync(ct);

        var existingTagNames = existingTags.Select(t => t.Name).ToHashSet();
        var newTagNames = tagNames.Except(existingTagNames).ToList();

        // Create new tags if needed
        if (newTagNames.Count > 0)
        {
            var newTags = newTagNames.Select(name => new TagEntity { Name = name }).ToList();
            await dbContext.Tag.AddRangeAsync(newTags, ct);
            await dbContext.SaveChangesAsync(ct); // Save to get IDs
            existingTags.AddRange(newTags);
        }

        // Add all tags to link
        foreach (var tag in existingTags)
        {
            link.Tags.Add(tag);
        }
    }
}