using Elf.Admin.Data;
using Elf.Shared;
using LiteBus.Queries.Abstractions;
using Microsoft.EntityFrameworkCore;

namespace Elf.Admin.Features;

public record GetLinkTrackingDateCountQuery(DateRangeRequest Request) : IQuery<List<LinkTrackingDateCount>>;

public class GetLinkTrackingDateCountQueryHandler(ElfDbContext dbContext) :
        IQueryHandler<GetLinkTrackingDateCountQuery, List<LinkTrackingDateCount>>
{
    public async Task<List<LinkTrackingDateCount>> HandleAsync(GetLinkTrackingDateCountQuery request, CancellationToken ct)
    {
        var data = await dbContext.LinkTracking
            .Where(lt =>
                lt.RequestTimeUtc <= request.Request.EndDateUtc.Date &&
                lt.RequestTimeUtc >= request.Request.StartDateUtc.Date)
            .GroupBy(lt => lt.RequestTimeUtc.Date)
            .Select(g => new LinkTrackingDateCount
            {
                TrackingDateUtc = g.Key,
                RequestCount = g.Count()
            })
            .AsNoTracking()
            .ToListAsync(ct);

        return data;
    }
}