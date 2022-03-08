using Elf.Api.Data;
using Microsoft.EntityFrameworkCore;

namespace Elf.Api.Features;

public record GetLinkTrackingDateCountQuery(int DaysFromNow) : IRequest<IReadOnlyList<LinkTrackingDateCount>>;

public class GetLinkTrackingDateCountQueryHandler :
        IRequestHandler<GetLinkTrackingDateCountQuery, IReadOnlyList<LinkTrackingDateCount>>
{
    private readonly ElfDbContext _dbContext;

    public GetLinkTrackingDateCountQueryHandler(ElfDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IReadOnlyList<LinkTrackingDateCount>> Handle(GetLinkTrackingDateCountQuery request, CancellationToken cancellationToken)
    {
        var utc = DateTime.UtcNow;

        var data = await (from lt in _dbContext.LinkTracking
                          where lt.RequestTimeUtc < utc && lt.RequestTimeUtc > utc.AddDays(-1 * request.DaysFromNow)
                          group lt by lt.RequestTimeUtc.Date into g
                          select new LinkTrackingDateCount
                          {
                              TrackingDateUtc = g.Key,
                              RequestCount = g.Count()
                          }).AsNoTracking().ToListAsync(cancellationToken);

        return data;
    }
}