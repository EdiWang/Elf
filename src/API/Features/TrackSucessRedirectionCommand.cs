using Dapper;
using LiteBus.Commands.Abstractions;
using System.Data;

namespace Elf.Api.Features;

public record LinkTrackingRequest(string IpAddress, string UserAgent, int LinkId);

public record TrackSucessRedirectionCommand(LinkTrackingRequest Request, IPLocation Location) : ICommand;

public class TrackSucessRedirectionCommandHandler(IDbConnection dbConnection) : ICommandHandler<TrackSucessRedirectionCommand>
{
    public async Task HandleAsync(TrackSucessRedirectionCommand request, CancellationToken ct)
    {
        var ((ipAddress, userAgent, linkId), ipLocation) = request;

        const string sql = @"
            INSERT INTO LinkTracking (Id, LinkId, UserAgent, IpAddress, IPCountry, IPRegion, IPCity, IPASN, IPOrg, RequestTimeUtc)
            VALUES (@Id, @LinkId, @UserAgent, @IpAddress, @IPCountry, @IPRegion, @IPCity, @IPASN, @IPOrg, @RequestTimeUtc)";

        var parameters = new
        {
            Id = Guid.NewGuid(),
            LinkId = linkId,
            UserAgent = userAgent,
            IpAddress = ipAddress,
            IPCountry = ipLocation?.Country,
            IPRegion = ipLocation?.Region,
            IPCity = ipLocation?.City,
            IPASN = ipLocation?.ASN,
            IPOrg = ipLocation?.Org,
            RequestTimeUtc = DateTime.UtcNow
        };

        await dbConnection.ExecuteAsync(sql, parameters);
    }
}