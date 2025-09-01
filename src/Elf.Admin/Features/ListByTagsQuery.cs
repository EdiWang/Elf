using Elf.Admin.Data;
using Elf.Admin.Models;
using LiteBus.Queries.Abstractions;
using Microsoft.EntityFrameworkCore;

namespace Elf.Admin.Features;

public record ListByTagsQuery(ListByTagsRequest Payload) : IQuery<(List<LinkModel> Links, int TotalRows)>;

public class ListByTagsQueryHandler(ElfDbContext dbContext) : IQueryHandler<ListByTagsQuery, (List<LinkModel> Links, int TotalRows)>
{
    public async Task<(List<LinkModel> Links, int TotalRows)> HandleAsync(ListByTagsQuery request, CancellationToken ct)
    {
        if (request.Payload.TagIds is not { Length: > 0 })
            return (new List<LinkModel>(0), 0);

        var baseQuery = dbContext.Link
            .Where(l => l.Tags.Any(t => request.Payload.TagIds.Contains(t.Id)));

        var totalRows = await baseQuery.CountAsync(ct);

        if (totalRows == 0) return (new List<LinkModel>(), 0);

        var data = await baseQuery
            .OrderByDescending(p => p.UpdateTimeUtc)
            .ThenByDescending(p => p.Id) // stable ordering for pagination
            .Skip(request.Payload.Offset)
            .Take(request.Payload.Take)
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
                // Project to lightweight TagEntity instances to avoid loading navigation graphs
                Tags = p.Tags
                    .Select(t => new TagEntity { Id = t.Id, Name = t.Name })
                    .ToArray()
            })
            .ToListAsync(ct);

        return (data, totalRows);
    }
}