using Elf.Admin.Models;
using Elf.Data;
using LiteBus.Queries.Abstractions;
using Microsoft.EntityFrameworkCore;

namespace Elf.Admin.Features;

public record GetLinkTrackingDateCountByLinkIdQuery(int LinkId, DateRangeRequest Request = null) : IQuery<List<LinkTrackingDateCount>>;

public class GetLinkTrackingDateCountByLinkIdQueryHandler(ElfDbContext dbContext) :
    IQueryHandler<GetLinkTrackingDateCountByLinkIdQuery, List<LinkTrackingDateCount>>
{
    public async Task<List<LinkTrackingDateCount>> HandleAsync(GetLinkTrackingDateCountByLinkIdQuery request, CancellationToken ct)
    {
        var query = dbContext.LinkTracking.Where(lt => lt.LinkId == request.LinkId);

        if (request.Request is not null)
        {
            var startDateUtc = request.Request.StartDateInclusiveUtc;
            var endDateUtc = request.Request.EndDateExclusiveUtc;

            query = query.Where(lt =>
                lt.RequestTimeUtc >= startDateUtc &&
                lt.RequestTimeUtc < endDateUtc);
        }

        var data = await query
            .AsNoTracking()
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