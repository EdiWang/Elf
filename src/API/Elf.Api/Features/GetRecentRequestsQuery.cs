using Elf.Api.Data;
using Microsoft.EntityFrameworkCore;

namespace Elf.Api.Features;

public record GetRecentRequestsQuery(int Top) : IRequest<IReadOnlyList<RequestTrack>>;

public class GetRecentRequestsQueryHandler : IRequestHandler<GetRecentRequestsQuery, IReadOnlyList<RequestTrack>>
{
    private readonly ElfDbContext _dbContext;

    public GetRecentRequestsQueryHandler(ElfDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IReadOnlyList<RequestTrack>> Handle(GetRecentRequestsQuery request, CancellationToken cancellationToken)
    {
        var result = await _dbContext.LinkTracking
                    .Select(p => new RequestTrack
                    {
                        FwToken = p.Link.FwToken,
                        Note = p.Link.Note,
                        RequestTimeUtc = p.RequestTimeUtc,
                        IpAddress = p.IpAddress,
                        UserAgent = p.UserAgent,
                        IPASN = p.IPASN,
                        IPCity = p.IPCity,
                        IPCountry = p.IPCountry,
                        IPOrg = p.IPOrg,
                        IPRegion = p.IPRegion
                    })
                    .OrderByDescending(lt => lt.RequestTimeUtc)
                    .Take(request.Top)
                    .AsNoTracking()
                    .ToListAsync(cancellationToken);

        return result;
    }
}