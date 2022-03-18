using Elf.Api.Data;

namespace Elf.Api.Features;

public record LinkTrackingRequest(string IpAddress, string UserAgent, int LinkId);

public record TrackSucessRedirectionCommand(LinkTrackingRequest Request, IPLocation Location) : IRequest;

public class TrackSucessRedirectionCommandHandler : AsyncRequestHandler<TrackSucessRedirectionCommand>
{
    private readonly ElfDbContext _dbContext;

    public TrackSucessRedirectionCommandHandler(ElfDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    protected override async Task Handle(TrackSucessRedirectionCommand request, CancellationToken cancellationToken)
    {
        var (trackingRequest, ipLocation) = request;

        var lt = new LinkTrackingEntity
        {
            IpAddress = trackingRequest.IpAddress,
            LinkId = trackingRequest.LinkId,
            RequestTimeUtc = DateTime.UtcNow,
            UserAgent = trackingRequest.UserAgent
        };

        if (null != ipLocation)
        {
            lt.IPASN = ipLocation.ASN;
            lt.IPCity = ipLocation.City;
            lt.IPCountry = ipLocation.Country;
            lt.IPOrg = ipLocation.Org;
            lt.IPRegion = ipLocation.Region;
        }

        await _dbContext.AddAsync(lt, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }
}