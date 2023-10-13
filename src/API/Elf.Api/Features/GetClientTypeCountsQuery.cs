using Elf.Api.Data;
using Microsoft.EntityFrameworkCore;
using UAParser;

namespace Elf.Api.Features;

public record GetClientTypeCountsQuery(DateRangeRequest Request, int TopTypes) : IRequest<IReadOnlyList<ClientTypeCount>>;

public class GetClientTypeCountsQueryHandler(ElfDbContext dbContext) : IRequestHandler<GetClientTypeCountsQuery, IReadOnlyList<ClientTypeCount>>
{
    public async Task<IReadOnlyList<ClientTypeCount>> Handle(GetClientTypeCountsQuery request, CancellationToken ct)
    {
        var uaParser = Parser.GetDefault();

        string GetClientTypeName(string userAgent)
        {
            if (string.IsNullOrWhiteSpace(userAgent)) return "N/A";

            var c = uaParser.Parse(userAgent);
            return $"{c.OS.Family}-{c.UA.Family}";
        }

        var utc = DateTime.UtcNow;
        var uac = await dbContext.LinkTracking
                .Where(p =>
                    p.RequestTimeUtc <= request.Request.EndDateUtc.Date &&
                    p.RequestTimeUtc >= request.Request.StartDateUtc.Date)
                .GroupBy(p => p.UserAgent)
                .Select(p => new UserAgentCount
                {
                    RequestCount = p.Count(),
                    UserAgent = p.Key
                }).AsNoTracking().ToListAsync(ct);

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