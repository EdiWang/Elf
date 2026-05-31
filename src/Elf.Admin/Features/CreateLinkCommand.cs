using Elf.Admin.Data;
using Elf.Admin.Models;
using Elf.Shared;
using Elf.TokenGenerator;
using LiteBus.Commands.Abstractions;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace Elf.Admin.Features;

public record CreateLinkCommand(LinkEditModel Payload) : ICommand;

public class CreateLinkCommandHandler(
    ElfDbContext dbContext,
    ITokenGenerator tokenGenerator,
    ILogger<CreateLinkCommandHandler> logger) : ICommandHandler<CreateLinkCommand>
{
    public async Task HandleAsync(CreateLinkCommand request, CancellationToken ct)
    {
        await EnsureAkaNameIsAvailableAsync(request.Payload.AkaName, ct);

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

        var token = await GenerateUniqueTokenAsync(ct);
        logger.LogInformation("Generated Token '{Token}' for url '{Url}'", token, request.Payload.OriginUrl);

        using var transaction = await dbContext.Database.BeginTransactionAsync(ct);
        try
        {
            var link = CreateLinkEntity(request.Payload, token);

            if (request.Payload.Tags is { Length: > 0 })
            {
                await ProcessTagsAsync(link, request.Payload.Tags, ct);
            }

            await dbContext.AddAsync(link, ct);
            await dbContext.SaveChangesAsync(ct);
            await transaction.CommitAsync(ct);
        }
        catch (DbUpdateException ex) when (ex.IsUniqueConstraintViolation())
        {
            await transaction.RollbackAsync(ct);
            throw new DuplicateResourceException("The link token, aka name, or tag already exists.");
        }
        catch
        {
            await transaction.RollbackAsync(ct);
            throw;
        }
    }

    private async Task EnsureAkaNameIsAvailableAsync(string akaName, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(akaName))
        {
            return;
        }

        var normalizedAkaName = akaName.Trim();
        if (!IdentifierRules.IsValidAkaName(normalizedAkaName))
        {
            throw new ValidationException("Aka can only contain lowercase letters, numbers, and hyphens, and cannot start or end with a hyphen.");
        }

        var exists = await dbContext.Link.AnyAsync(p => p.AkaName == normalizedAkaName, ct);
        if (exists)
        {
            throw new DuplicateResourceException($"Aka '{normalizedAkaName}' is already used by another link.");
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
            AkaName = string.IsNullOrWhiteSpace(payload.AkaName) ? null : payload.AkaName.Trim(),
            OriginUrl = payload.OriginUrl,
            UpdateTimeUtc = DateTime.UtcNow,
            TTL = payload.TTL
        };
    }

    private async Task ProcessTagsAsync(LinkEntity link, string[] tagNames, CancellationToken ct)
    {
        var normalizedTagNames = NormalizeTagNames(tagNames);
        if (normalizedTagNames.Length == 0)
        {
            return;
        }

        var existingTags = await dbContext.Tag
            .Where(t => normalizedTagNames.Contains(t.Name))
            .ToListAsync(ct);

        var existingTagNames = existingTags.Select(t => t.Name).ToHashSet();
        var newTagNames = normalizedTagNames.Except(existingTagNames).ToList();

        if (newTagNames.Count > 0)
        {
            var newTags = newTagNames.Select(name => new TagEntity { Name = name }).ToList();
            await dbContext.Tag.AddRangeAsync(newTags, ct);
            await dbContext.SaveChangesAsync(ct);
            existingTags.AddRange(newTags);
        }

        foreach (var tag in existingTags)
        {
            link.Tags.Add(tag);
        }
    }

    private static string[] NormalizeTagNames(string[] tagNames) => tagNames
        .Select(IdentifierRules.NormalizeTagName)
        .Where(tagName => !string.IsNullOrWhiteSpace(tagName))
        .Distinct()
        .ToArray();
}