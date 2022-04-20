using Elf.Api.Data;
using Microsoft.EntityFrameworkCore;

namespace Elf.Api.Features;

public record GetMostRequestedLinkCountQuery(DateRangeRequest Request) : IRequest<IReadOnlyList<MostRequestedLinkCount>>;

public class GetMostRequestedLinkCountQueryHandler :
    IRequestHandler<GetMostRequestedLinkCountQuery, IReadOnlyList<MostRequestedLinkCount>>
{
    private readonly ElfDbContext _dbContext;

    public GetMostRequestedLinkCountQueryHandler(ElfDbContext dbContext) => _dbContext = dbContext;

    public async Task<IReadOnlyList<MostRequestedLinkCount>> Handle(GetMostRequestedLinkCountQuery request, CancellationToken cancellationToken)
    {
        var utc = DateTime.UtcNow;

        var data = await _dbContext.LinkTracking
                        .Where(p => p.RequestTimeUtc <= request.Request.EndDateUtc.Date &&
                                    p.RequestTimeUtc >= request.Request.StartDateUtc.Date)
                        .GroupBy(lt => new { lt.Link.FwToken, lt.Link.Note })
                        .Select(g => new MostRequestedLinkCount
                        {
                            Note = g.Key.Note,
                            FwToken = g.Key.FwToken,
                            RequestCount = g.Count()
                        }).AsNoTracking().ToListAsync(cancellationToken);

        return data;
    }
}