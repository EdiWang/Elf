using Elf.Admin.Data;
using Elf.Admin.Models;
using LiteBus.Commands.Abstractions;
using Microsoft.EntityFrameworkCore;

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

        // Update link properties
        link.OriginUrl = payload.OriginUrl;
        link.Note = payload.Note;
        link.AkaName = string.IsNullOrWhiteSpace(payload.AkaName) ? null : payload.AkaName;
        link.IsEnabled = payload.IsEnabled;
        link.TTL = payload.TTL;
        link.UpdateTimeUtc = DateTime.UtcNow; // Update timestamp

        // Handle tags efficiently
        await UpdateLinkTagsAsync(link, payload.Tags, ct);

        await dbContext.SaveChangesAsync(ct);
        return link.FwToken;
    }

    private async Task UpdateLinkTagsAsync(LinkEntity link, string[] newTags, CancellationToken ct)
    {
        // Clear existing tags
        link.Tags.Clear();
        
        if (newTags is null or { Length: 0 })
            return;

        // Get all existing tags that match the new tag names in a single query
        var existingTags = await dbContext.Tag
            .Where(t => newTags.Contains(t.Name))
            .ToDictionaryAsync(t => t.Name, t => t, ct);

        // Identify new tags that need to be created
        var newTagNames = newTags.Except(existingTags.Keys).ToArray();
        
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
        foreach (var tagName in newTags)
        {
            if (existingTags.TryGetValue(tagName, out var tag))
            {
                link.Tags.Add(tag);
            }
        }
    }
}