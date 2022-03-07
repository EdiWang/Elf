using Elf.Api.Models;
using Elf.Api.TokenGenerator;
using Elf.Services.Entities;
using LinqToDB;
using UAParser;

namespace Elf.Api.Features;

public class LinkForwarderService : ILinkForwarderService
{
    private readonly ILogger<LinkForwarderService> _logger;
    private readonly ITokenGenerator _tokenGenerator;
    private readonly AppDataConnection _connection;

    public LinkForwarderService(
        ILogger<LinkForwarderService> logger,
        ITokenGenerator tokenGenerator,
        AppDataConnection connection)
    {
        _logger = logger;
        _tokenGenerator = tokenGenerator;
        _connection = connection;
    }

    public async Task<string> CreateLinkAsync(CreateLinkRequest createLinkRequest)
    {
        var l = await _connection.Link.FirstOrDefaultAsync(p => p.OriginUrl == createLinkRequest.OriginUrl);
        var tempToken = l?.FwToken;
        if (tempToken is not null)
        {
            if (_tokenGenerator.TryParseToken(tempToken, out var tk))
            {
                _logger.LogInformation($"Link already exists for token '{tk}'");
                return tk;
            }

            string message = $"Invalid token '{tempToken}' found for existing url '{createLinkRequest.OriginUrl}'";
            _logger.LogError(message);
        }

        string token;
        do
        {
            token = _tokenGenerator.GenerateToken();
        } while (await _connection.Link.AnyAsync(p => p.FwToken == token));

        _logger.LogInformation($"Generated Token '{token}' for url '{createLinkRequest.OriginUrl}'");

        var link = new Link
        {
            FwToken = token,
            IsEnabled = createLinkRequest.IsEnabled,
            Note = createLinkRequest.Note,
            AkaName = createLinkRequest.AkaName,
            OriginUrl = createLinkRequest.OriginUrl,
            UpdateTimeUtc = DateTime.UtcNow,
            TTL = createLinkRequest.TTL,
            TenantId = createLinkRequest.TenantId
        };

        await _connection.InsertAsync(link);
        return link.FwToken;
    }

    public async Task SetEnableAsync(int id, bool isEnabled)
    {
        var link = await _connection.Link.FirstOrDefaultAsync(p => p.Id == id);
        if (link is null) return;

        link.IsEnabled = isEnabled;
        await _connection.UpdateAsync(link);
    }

    public async Task<IReadOnlyList<LinkTrackingDateCount>> GetLinkTrackingDateCount(int daysFromNow)
    {
        var utc = DateTime.UtcNow;

        var data = await (from lt in _connection.LinkTracking
                          where lt.RequestTimeUtc < utc && lt.RequestTimeUtc > utc.AddDays(-1 * daysFromNow)
                          group lt by lt.RequestTimeUtc.Date into g
                          select new LinkTrackingDateCount
                          {
                              TrackingDateUtc = g.Key,
                              RequestCount = g.Count()
                          }).ToListAsync();

        return data;
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
