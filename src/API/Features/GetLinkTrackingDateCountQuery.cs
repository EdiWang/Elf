using Elf.Api.Data;
using Elf.Shared;
using Microsoft.EntityFrameworkCore;

namespace Elf.Api.Features;

public record GetLinkTrackingDateCountQuery(DateRangeRequest Request) : IRequest<List<LinkTrackingDateCount>>;

public class GetLinkTrackingDateCountQueryHandler(ElfDbContext dbContext) :
        IRequestHandler<GetLinkTrackingDateCountQuery, List<LinkTrackingDateCount>>
{
    public async Task<List<LinkTrackingDateCount>> Handle(GetLinkTrackingDateCountQuery request, CancellationToken ct)
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