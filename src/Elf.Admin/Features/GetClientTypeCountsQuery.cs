using Elf.Admin.Data;
using Elf.Admin.Models;
using LiteBus.Queries.Abstractions;
using Microsoft.EntityFrameworkCore;
using UAParser;

namespace Elf.Admin.Features;

public record GetClientTypeCountsQuery(DateRangeRequest Request, int TopTypes) : IQuery<List<ClientTypeCount>>;

public class GetClientTypeCountsQueryHandler(ElfDbContext dbContext) : IQueryHandler<GetClientTypeCountsQuery, List<ClientTypeCount>>
{
    public async Task<List<ClientTypeCount>> HandleAsync(GetClientTypeCountsQuery request, CancellationToken ct)
    {
        var uaParser = Parser.GetDefault();
        var startDateUtc = request.Request.StartDateInclusiveUtc;
        var endDateUtc = request.Request.EndDateExclusiveUtc;

        string GetClientTypeName(string userAgent)
        {
            if (string.IsNullOrWhiteSpace(userAgent)) return "N/A";

            var c = uaParser.Parse(userAgent);
            return $"{c.OS.Family}-{c.UA.Family}";
        }

        IQueryable<UserAgentCount> query = dbContext.LinkTracking
                .AsNoTracking()
                .Where(p =>
                    p.RequestTimeUtc >= startDateUtc &&
                    p.RequestTimeUtc < endDateUtc)
                .GroupBy(p => p.UserAgent)
                .Select(p => new UserAgentCount
                {
                    RequestCount = p.Count(),
                    UserAgent = p.Key
                })
                .OrderByDescending(p => p.RequestCount);

        if (request.TopTypes > 0)
        {
            query = query.Take(Math.Max(request.TopTypes * 20, 100));
        }

        var uac = await query.ToListAsync(ct);

        if (uac.Any())
        {
            var q =
                 uac.GroupBy(d => GetClientTypeName(d.UserAgent))
                    .Select(g => new ClientTypeCount
                    {
                        ClientTypeName = g.Key,
                        Count = g.Sum(gp => gp.RequestCount)
                    });

            if (request.TopTypes > 0) q = q.OrderByDescending(p => p.Count).Take(request.TopTypes);
            return q.ToList();
        }

        return new List<ClientTypeCount>();
    }
}