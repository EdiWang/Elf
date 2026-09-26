using Elf.App.Services;
using Elf.Data;
using LiteBus.Commands.Abstractions;

namespace Elf.App.Features;

public record LinkTrackingRequest(string IpAddress, string UserAgent, int LinkId);

public record TrackSuccessRedirectionCommand(LinkTrackingRequest Request, IPLocation Location) : ICommand;

public class TrackSuccessRedirectionCommandHandler(ElfDbContext dbContext) : ICommandHandler<TrackSuccessRedirectionCommand>
{
    public async Task HandleAsync(TrackSuccessRedirectionCommand request, CancellationToken ct)
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
