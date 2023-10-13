using Elf.Api.Data;
using Microsoft.EntityFrameworkCore;

namespace Elf.Api.Features;

public record GetMostRequestedLinkCountQuery(DateRangeRequest Request) : IRequest<IReadOnlyList<MostRequestedLinkCount>>;

public class GetMostRequestedLinkCountQueryHandler(ElfDbContext dbContext) :
    IRequestHandler<GetMostRequestedLinkCountQuery, IReadOnlyList<MostRequestedLinkCount>>
{
    public async Task<IReadOnlyList<MostRequestedLinkCount>> Handle(GetMostRequestedLinkCountQuery request, CancellationToken ct)
    {
        var utc = DateTime.UtcNow;

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