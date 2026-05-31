using Elf.Admin.Data;
using Elf.Admin.Models;
using Elf.Shared;
using LiteBus.Commands.Abstractions;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace Elf.Admin.Features;

public record EditLinkCommand(int Id, LinkEditModel Payload) : ICommand<string>;

public class EditLinkCommandHandler(ElfDbContext dbContext) : ICommandHandler<EditLinkCommand, string>
{
    public async Task<string> HandleAsync(EditLinkCommand request, CancellationToken ct)
    {
        var (id, payload) = request;

        // Use Include to load tags in a single query
        var link = await dbContext.Link
            .Include(l => l.Tags)
            .FirstOrDefaultAsync(l => l.Id == id, ct);

        if (link is null) return null;

        await EnsureAkaNameIsAvailableAsync(id, payload.AkaName, ct);

        // Update link properties
        link.OriginUrl = payload.OriginUrl;
        link.Note = payload.Note;
        link.AkaName = string.IsNullOrWhiteSpace(payload.AkaName) ? null : payload.AkaName.Trim();
        link.IsEnabled = payload.IsEnabled;
        link.TTL = payload.TTL;
        link.UpdateTimeUtc = DateTime.UtcNow; // Update timestamp

        // Handle tags efficiently
        await UpdateLinkTagsAsync(link, payload.Tags, ct);

        try
        {
            await dbContext.SaveChangesAsync(ct);
        }
        catch (DbUpdateException ex) when (ex.IsUniqueConstraintViolation())
        {
            throw new DuplicateResourceException("The link token, aka name, or tag already exists.");
        }

        return link.FwToken;
    }

    private async Task EnsureAkaNameIsAvailableAsync(int id, string akaName, CancellationToken ct)
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

        var exists = await dbContext.Link.AnyAsync(p => p.Id != id && p.AkaName == normalizedAkaName, ct);
        if (exists)
        {
            throw new DuplicateResourceException($"Aka '{normalizedAkaName}' is already used by another link.");
        }
    }

    private async Task UpdateLinkTagsAsync(LinkEntity link, string[] newTags, CancellationToken ct)
    {
        // Clear existing tags
        link.Tags.Clear();

        var normalizedTagNames = NormalizeTagNames(newTags);
        if (normalizedTagNames.Length == 0)
            return;

        // Get all existing tags that match the new tag names in a single query
        var existingTags = await dbContext.Tag
            .Where(t => normalizedTagNames.Contains(t.Name))
            .ToDictionaryAsync(t => t.Name, t => t, ct);

        // Identify new tags that need to be created
        var newTagNames = normalizedTagNames.Except(existingTags.Keys).ToArray();

        if (newTagNames.Length > 0)
        {
            var tagsToAdd = newTagNames.Select(name => new TagEntity { Name = name }).ToArray();
            await dbContext.Tag.AddRangeAsync(tagsToAdd, ct);
            await dbContext.SaveChangesAsync(ct);

            // Add newly created tags to the dictionary
            foreach (var tag in tagsToAdd)
            {
                existingTags[tag.Name] = tag;
            }
        }

        // Add all tags to the link
        foreach (var tagName in normalizedTagNames)
        {
            if (existingTags.TryGetValue(tagName, out var tag))
            {
                link.Tags.Add(tag);
            }
        }
    }

    private static string[] NormalizeTagNames(string[] tagNames) => (tagNames ?? [])
        .Select(IdentifierRules.NormalizeTagName)
        .Where(tagName => !string.IsNullOrWhiteSpace(tagName))
        .Distinct()
        .ToArray();
}