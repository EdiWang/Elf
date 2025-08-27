using Elf.Admin.Data;
using Elf.Admin.Models;
using LiteBus.Queries.Abstractions;
using Microsoft.EntityFrameworkCore;

namespace Elf.Api.Features;

public record ListLinkQuery(int Offset, int Take, string NoteKeyword = null) :
    IQuery<(List<LinkModel> Links, int TotalRows)>;

public class ListLinkQueryHandler(ElfDbContext dbContext) : IQueryHandler<ListLinkQuery, (List<LinkModel> Links, int TotalRows)>
{
    public async Task<(List<LinkModel> Links, int TotalRows)> HandleAsync(ListLinkQuery request, CancellationToken ct)
    {
        var query = from l in dbContext.Link.Include(l => l.LinkTrackings)
                    select l;

        var (offset, take, noteKeyword) = request;
        if (noteKeyword is not null)
        {
            query = dbContext.Link
                .Include(l => l.Tags)
                .Where(l => l.Note.Contains(noteKeyword) || l.FwToken.Contains(noteKeyword));
        }

        var totalRows = query.Count();
        var data = await query.OrderByDescending(p => p.UpdateTimeUtc)
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