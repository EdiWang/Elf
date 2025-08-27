using Elf.Admin.Data;
using Elf.Admin.Models;
using LiteBus.Queries.Abstractions;
using Microsoft.EntityFrameworkCore;

namespace Elf.Admin.Features;

public record GetMostRequestedLinkCountQuery(DateRangeRequest Request) : IQuery<List<MostRequestedLinkCount>>;

public class GetMostRequestedLinkCountQueryHandler(ElfDbContext dbContext) :
    IQueryHandler<GetMostRequestedLinkCountQuery, List<MostRequestedLinkCount>>
{
    public async Task<List<MostRequestedLinkCount>> HandleAsync(GetMostRequestedLinkCountQuery request, CancellationToken ct)
    {
        var data = await dbContext.LinkTracking
                        .Where(p => p.RequestTimeUtc <= request.Request.EndDateUtc.Date &&
                                    p.RequestTimeUtc >= request.Request.StartDateUtc.Date)
                        .GroupBy(lt => new { lt.Link.FwToken, lt.Link.Note })
                        .Select(g => new MostRequestedLinkCount
                        {
                            Note = g.Key.Note,
                            FwToken = g.Key.FwToken,
                            RequestCount = g.Count()
                        })
                        .AsNoTracking()
                        .ToListAsync(ct);

        return data;
    }
}