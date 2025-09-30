using Elf.Admin.Data;
using Elf.Admin.Models;
using LiteBus.Queries.Abstractions;
using Microsoft.EntityFrameworkCore;

namespace Elf.Admin.Features;

public record GetRecentRequestsQuery(int Offset, int Take, int? LinkId) : IQuery<(List<RequestTrack>, int TotalRows)>;

public class GetRecentRequestsQueryHandler(ElfDbContext dbContext) : IQueryHandler<GetRecentRequestsQuery, (List<RequestTrack>, int TotalRows)>
{
    public async Task<(List<RequestTrack>, int TotalRows)> HandleAsync(GetRecentRequestsQuery request, CancellationToken ct)
    {
        var (offset, take, id) = request;
        var query = dbContext.LinkTracking.Where(p => id == null || p.LinkId == id.Value);

        var totalRows = query.Count();

        var result = await query
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
                    .Skip(offset)
                    .Take(take)
                    .AsNoTracking()
                    .ToListAsync(ct);

        return (result, totalRows);
    }
}