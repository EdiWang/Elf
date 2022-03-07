using Elf.Api.Models;

namespace Elf.Api.Features;

public interface ILinkForwarderService
{
    Task TrackSucessRedirectionAsync(LinkTrackingRequest request);
    Task<IReadOnlyList<ClientTypeCount>> GetClientTypeCounts(int daysFromNow, int topTypes);
}