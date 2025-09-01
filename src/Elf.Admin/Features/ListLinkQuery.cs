using Elf.Admin.Data;
using Elf.Admin.Models;
using LiteBus.Queries.Abstractions;
using Microsoft.EntityFrameworkCore;

namespace Elf.Admin.Features;

public record ListLinkQuery(int Offset, int Take, string NoteKeyword = null) :
    IQuery<(List<LinkModel> Links, int TotalRows)>;

public class ListLinkQueryHandler(ElfDbContext dbContext) : IQueryHandler<ListLinkQuery, (List<LinkModel> Links, int TotalRows)>
{
    public async Task<(List<LinkModel> Links, int TotalRows)> HandleAsync(ListLinkQuery request, CancellationToken ct)
    {
        var (offset, take, noteKeyword) = request;

        // Build base query with all necessary includes
        var query = dbContext.Link
            .Include(l => l.LinkTrackings)
            .Include(l => l.Tags)
            .AsQueryable();

        // Apply filtering if keyword is provided
        if (!string.IsNullOrWhiteSpace(noteKeyword))
        {
            query = query.Where(l => l.Note.Contains(noteKeyword) || l.FwToken.Contains(noteKeyword));
        }

        // Get total count asynchronously before applying pagination
        var totalRows = await query.CountAsync(ct);
        if (totalRows == 0) return (new List<LinkModel>(), 0);

        // Apply pagination and projection
        var data = await query
            .OrderByDescending(p => p.UpdateTimeUtc)
            .Skip(offset)
            .Take(take)
            .AsNoTracking()
            .Select(p => new LinkModel
            {
                Id = p.Id,
                OriginUrl = p.OriginUrl,
                Note = p.Note,
                TTL = p.TTL,
                UpdateTimeUtc = p.UpdateTimeUtc,
                AkaName = p.AkaName,
                FwToken = p.FwToken,
                IsEnabled = p.IsEnabled,
                Tags = p.Tags.ToArray(),
                Hits = p.LinkTrackings.Count
            })
            .ToListAsync(ct);

        return (data, totalRows);
    }
}