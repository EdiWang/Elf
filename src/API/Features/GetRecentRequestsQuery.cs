﻿using Elf.Api.Data;
using Elf.Shared;
using Microsoft.EntityFrameworkCore;

namespace Elf.Api.Features;

public record GetRecentRequestsQuery(int Offset, int Take) : IRequest<(IReadOnlyList<RequestTrack>, int TotalRows)>;

public class GetRecentRequestsQueryHandler(ElfDbContext dbContext) : IRequestHandler<GetRecentRequestsQuery, (IReadOnlyList<RequestTrack>, int TotalRows)>
{
    public async Task<(IReadOnlyList<RequestTrack>, int TotalRows)> Handle(GetRecentRequestsQuery request, CancellationToken ct)
    {
        var (offset, take) = request;
        var query = dbContext.LinkTracking;
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