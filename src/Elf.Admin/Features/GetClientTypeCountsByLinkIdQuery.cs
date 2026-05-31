using Elf.Admin.Data;
using Elf.Admin.Models;
using LiteBus.Queries.Abstractions;
using Microsoft.EntityFrameworkCore;
using UAParser;

namespace Elf.Admin.Features;

public record GetClientTypeCountsByLinkIdQuery(int LinkId, DateRangeRequest Request = null, int TopTypes = 0) : IQuery<List<ClientTypeCount>>;

public class GetClientTypeCountsByLinkIdQueryHandler(ElfDbContext dbContext) : IQueryHandler<GetClientTypeCountsByLinkIdQuery, List<ClientTypeCount>>
{
    public async Task<List<ClientTypeCount>> HandleAsync(GetClientTypeCountsByLinkIdQuery request, CancellationToken ct)
    {
        var uaParser = Parser.GetDefault();

        string GetClientTypeName(string userAgent)
        {
            if (string.IsNullOrWhiteSpace(userAgent)) return "N/A";

            var c = uaParser.Parse(userAgent);
            return $"{c.OS.Family}-{c.UA.Family}";
        }

        // Build base query filtered by LinkId
        var query = dbContext.LinkTracking.Where(p => p.LinkId == request.LinkId);

        // Apply date range filter if provided
        if (request.Request is not null)
        {
            var startDateUtc = request.Request.StartDateInclusiveUtc;
            var endDateUtc = request.Request.EndDateExclusiveUtc;

            query = query.Where(p =>
                p.RequestTimeUtc >= startDateUtc &&
                p.RequestTimeUtc < endDateUtc);
        }

        IQueryable<UserAgentCount> userAgentQuery = query
            .AsNoTracking()
            .GroupBy(p => p.UserAgent)
            .Select(p => new UserAgentCount
            {
                RequestCount = p.Count(),
                UserAgent = p.Key
            })
            .OrderByDescending(p => p.RequestCount);

        if (request.TopTypes > 0)
        {
            userAgentQuery = userAgentQuery.Take(Math.Max(request.TopTypes * 20, 100));
        }

        var uac = await userAgentQuery.ToListAsync(ct);

        if (uac.Any())
        {
            var q = uac.GroupBy(d => GetClientTypeName(d.UserAgent))
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