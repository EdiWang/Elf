using Elf.Api.Data;
using Microsoft.EntityFrameworkCore;
using UAParser;

namespace Elf.Api.Features;

public record GetClientTypeCountsQuery(int DaysFromNow, int TopTypes) : IRequest<IReadOnlyList<ClientTypeCount>>;

public class GetClientTypeCountsQueryHandler : IRequestHandler<GetClientTypeCountsQuery, IReadOnlyList<ClientTypeCount>>
{
    private readonly ElfDbContext _dbContext;

    public GetClientTypeCountsQueryHandler(ElfDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IReadOnlyList<ClientTypeCount>> Handle(GetClientTypeCountsQuery request, CancellationToken cancellationToken)
    {
        var uaParser = Parser.GetDefault();

        string GetClientTypeName(string userAgent)
        {
            if (string.IsNullOrWhiteSpace(userAgent)) return "N/A";

            ClientInfo c = uaParser.Parse(userAgent);
            return $"{c.OS.Family}-{c.UA.Family}";
        }

        var utc = DateTime.UtcNow;
        var uac = await _dbContext.LinkTracking
                .Where(p =>
                    p.RequestTimeUtc < utc &&
                    p.RequestTimeUtc > utc.AddDays(-1 * request.DaysFromNow))
                .GroupBy(p => p.UserAgent)
                .Select(p => new UserAgentCount
                {
                    RequestCount = p.Count(),
                    UserAgent = p.Key
                }).AsNoTracking().ToListAsync(cancellationToken);

        if (uac.Any())
        {
            var q = from d in uac
                    group d by GetClientTypeName(d.UserAgent)
                into g
                    select new ClientTypeCount
                    {
                        ClientTypeName = g.Key,
                        Count = g.Sum(gp => gp.RequestCount)
                    };

            if (request.TopTypes > 0) q = q.OrderByDescending(p => p.Count).Take(request.TopTypes);
            return q.ToList();
        }
        return new List<ClientTypeCount>();
    }
}