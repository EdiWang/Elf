using Elf.Api.Services;
using Elf.Data;
using LiteBus.Commands.Abstractions;

namespace Elf.Api.Features;

public record LinkTrackingRequest(string IpAddress, string UserAgent, int LinkId);

public record TrackSucessRedirectionCommand(LinkTrackingRequest Request, IPLocation Location) : ICommand;

public class TrackSucessRedirectionCommandHandler(ElfDbContext dbContext) : ICommandHandler<TrackSucessRedirectionCommand>
{
    public async Task HandleAsync(TrackSucessRedirectionCommand request, CancellationToken ct)
    {
        var ((ipAddress, userAgent, linkId), ipLocation) = request;

        dbContext.LinkTracking.Add(new LinkTrackingEntity
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
        });

        await dbContext.SaveChangesAsync(ct);
    }
}
