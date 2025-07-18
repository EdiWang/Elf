﻿using Elf.Api.Data;
using LiteBus.Commands.Abstractions;

namespace Elf.Api.Features;

public record LinkTrackingRequest(string IpAddress, string UserAgent, int LinkId);

public record TrackSucessRedirectionCommand(LinkTrackingRequest Request, IPLocation Location) : ICommand;

public class TrackSucessRedirectionCommandHandler(ElfDbContext dbContext) : ICommandHandler<TrackSucessRedirectionCommand>
{
    public async Task HandleAsync(TrackSucessRedirectionCommand request, CancellationToken ct)
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

        await dbContext.AddAsync(lt, ct);
        await dbContext.SaveChangesAsync(ct);
    }
}