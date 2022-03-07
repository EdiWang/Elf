using Elf.Api.Models;
using Elf.Api.TokenGenerator;
using Elf.Services.Entities;
using LinqToDB;
using UAParser;

namespace Elf.Api.Features;

public class LinkForwarderService : ILinkForwarderService
{
    private readonly AppDataConnection _connection;

    public LinkForwarderService(AppDataConnection connection)
    {
        _connection = connection;
    }

    public async Task<IReadOnlyList<ClientTypeCount>> GetClientTypeCounts(int daysFromNow, int topTypes)
    {
        var uaParser = Parser.GetDefault();

        string GetClientTypeName(string userAgent)
        {
            if (string.IsNullOrWhiteSpace(userAgent)) return "N/A";

            ClientInfo c = uaParser.Parse(userAgent);
            return $"{c.OS.Family}-{c.UA.Family}";
        }

        var utc = DateTime.UtcNow;
        var uac = await _connection.LinkTracking
                                    .Where(p =>
                                       p.RequestTimeUtc < utc &&
                                       p.RequestTimeUtc > utc.AddDays(-1 * daysFromNow))
                                    .GroupBy(p => p.UserAgent)
                                    .Select(p => new UserAgentCount
                                    {
                                        RequestCount = p.Count(),
                                        UserAgent = p.Key
                                    }).ToListAsync();

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

            if (topTypes > 0) q = q.OrderByDescending(p => p.Count).Take(topTypes);
            return q.ToList();
        }
        return new List<ClientTypeCount>();
    }

    public Task TrackSucessRedirectionAsync(LinkTrackingRequest request)
    {
        var lt = new LinkTracking
        {
            IpAddress = request.IpAddress,
            LinkId = request.LinkId,
            RequestTimeUtc = DateTime.UtcNow,
            UserAgent = request.UserAgent
        };

        return _connection.InsertAsync(lt);
    }
}
