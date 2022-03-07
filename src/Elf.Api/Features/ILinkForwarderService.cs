using Elf.Api.Models;

namespace Elf.Api.Features;

public interface ILinkForwarderService
{
    Task TrackSucessRedirectionAsync(LinkTrackingRequest request);
    Task ClearTrackingDataAsync();
    //Task<IReadOnlyList<LinkTracking>> GetTrackingRecords(int linkId, int top = 100);
    Task<string> CreateLinkAsync(CreateLinkRequest createLinkRequest);
    Task SetEnableAsync(int id, bool isEnabled);
    Task DeleteLink(int linkId);
    Task<IReadOnlyList<LinkTrackingDateCount>> GetLinkTrackingDateCount(int daysFromNow);
    Task<IReadOnlyList<ClientTypeCount>> GetClientTypeCounts(int daysFromNow, int topTypes);
}