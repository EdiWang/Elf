using Elf.Api.Data;

namespace Elf.Api.Features;

public record LinkTrackingRequest(string IpAddress, string UserAgent, int LinkId);

public record TrackSucessRedirectionCommand(LinkTrackingRequest Request, IPLocation Location) : IRequest;

public class TrackSucessRedirectionCommandHandler : IRequestHandler<TrackSucessRedirectionCommand>
{
    private readonly ElfDbContext _dbContext;

    public TrackSucessRedirectionCommandHandler(ElfDbContext dbContext) => _dbContext = dbContext;

    public async Task Handle(TrackSucessRedirectionCommand request, CancellationToken ct)
    {
        var ((ipAddress, userAgent, linkId), ipLocation) = request;

        var lt = new LinkTrackingEntity
        {
            Id = Guid.NewGuid(),
            IpAddress = ipAddress,
            LinkId = linkId,
            RequestTimeUtc = DateTime.UtcNow,
            UserAgent = userAgent
        };

        if (null != ipLocation)
        {
            lt.IPASN = ipLocation.ASN;
            lt.IPCity = ipLocation.City;
            lt.IPCountry = ipLocation.Country;
            lt.IPOrg = ipLocation.Org;
            lt.IPRegion = ipLocation.Region;
        }

        await _dbContext.AddAsync(lt, ct);
        await _dbContext.SaveChangesAsync(ct);
    }
}