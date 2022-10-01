using Elf.Api.Data;
using Microsoft.EntityFrameworkCore;

namespace Elf.Api.Features;

public record ListLinkQuery(int Offset, int Take, string NoteKeyword = null) :
    IRequest<(IReadOnlyList<LinkModel> Links, int TotalRows)>;

public class ListLinkQueryHandler : IRequestHandler<ListLinkQuery, (IReadOnlyList<LinkModel> Links, int TotalRows)>
{
    private readonly ElfDbContext _dbContext;

    public ListLinkQueryHandler(ElfDbContext dbContext) => _dbContext = dbContext;

    public async Task<(IReadOnlyList<LinkModel> Links, int TotalRows)> Handle(ListLinkQuery request, CancellationToken ct)
    {
        var query = from l in _dbContext.Link
                    select l;

        var (offset, take, noteKeyword) = request;
        if (noteKeyword is not null)
        {
            query = _dbContext.Link
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
                Tags = p.Tags.ToArray()
            })
            .ToListAsync(ct);

        return (data, totalRows);
    }
}