using Elf.Admin.Models;
using Elf.Data;
using LiteBus.Queries.Abstractions;
using Microsoft.EntityFrameworkCore;

namespace Elf.Admin.Features;

public record GetLinkTrackingDateCountQuery(DateRangeRequest Request) : IQuery<List<LinkTrackingDateCount>>;

public class GetLinkTrackingDateCountQueryHandler(ElfDbContext dbContext) :
        IQueryHandler<GetLinkTrackingDateCountQuery, List<LinkTrackingDateCount>>
{
    public async Task<List<LinkTrackingDateCount>> HandleAsync(GetLinkTrackingDateCountQuery request, CancellationToken ct)
    {
        var startDateUtc = request.Request.StartDateInclusiveUtc;
        var endDateUtc = request.Request.EndDateExclusiveUtc;

        var data = await dbContext.LinkTracking
            .AsNoTracking()
            .Where(lt =>
                lt.RequestTimeUtc >= startDateUtc &&
                lt.RequestTimeUtc < endDateUtc)
            .GroupBy(lt => lt.RequestTimeUtc.Date)
            .Select(g => new LinkTrackingDateCount
            {
                TrackingDateUtc = g.Key,
                RequestCount = g.Count()
            })
            .OrderBy(g => g.TrackingDateUtc)
            .ToListAsync(ct);

        return data;
    }
}