using Elf.Api.Data;
using Elf.Api.Models;
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
                        UserAgent = p.UserAgent
                    })
                    .OrderByDescending(lt => lt.RequestTimeUtc)
                    .Take(request.Top)
                    .AsNoTracking()
                    .ToListAsync(cancellationToken);

        return result;
    }
}