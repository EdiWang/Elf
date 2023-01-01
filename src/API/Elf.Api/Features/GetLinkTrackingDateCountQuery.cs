using Elf.Api.Data;
using Microsoft.EntityFrameworkCore;

namespace Elf.Api.Features;

public record GetLinkTrackingDateCountQuery(DateRangeRequest Request) : IRequest<IReadOnlyList<LinkTrackingDateCount>>;

public class GetLinkTrackingDateCountQueryHandler :
        IRequestHandler<GetLinkTrackingDateCountQuery, IReadOnlyList<LinkTrackingDateCount>>
{
    private readonly ElfDbContext _dbContext;

    public GetLinkTrackingDateCountQueryHandler(ElfDbContext dbContext) => _dbContext = dbContext;

    public async Task<IReadOnlyList<LinkTrackingDateCount>> Handle(GetLinkTrackingDateCountQuery request, CancellationToken ct)
    {
        var data = await _dbContext.LinkTracking
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