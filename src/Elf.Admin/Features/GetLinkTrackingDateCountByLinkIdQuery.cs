using Elf.Admin.Data;
using Elf.Admin.Models;
using LiteBus.Queries.Abstractions;
using Microsoft.EntityFrameworkCore;

namespace Elf.Admin.Features;

public record GetLinkTrackingDateCountByLinkIdQuery(int LinkId, DateRangeRequest Request = null) : IQuery<List<LinkTrackingDateCount>>;

public class GetLinkTrackingDateCountByLinkIdQueryHandler(ElfDbContext dbContext) :
    IQueryHandler<GetLinkTrackingDateCountByLinkIdQuery, List<LinkTrackingDateCount>>
{
    public async Task<List<LinkTrackingDateCount>> HandleAsync(GetLinkTrackingDateCountByLinkIdQuery request, CancellationToken ct)
    {
        // Build base query filtered by LinkId
        var query = dbContext.LinkTracking.Where(lt => lt.LinkId == request.LinkId);

        // Apply date range filter if provided
        if (request.Request is not null)
        {
            query = query.Where(lt =>
                lt.RequestTimeUtc <= request.Request.EndDateUtc.Date &&
                lt.RequestTimeUtc >= request.Request.StartDateUtc.Date);
        }

        var data = await query
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