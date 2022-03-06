using Elf.Services.Entities;
using Elf.Services.Models;

namespace Elf.Api.Features;

public interface ILinkForwarderService
{
    Task<(IReadOnlyList<Link> Links, int TotalRows)> GetPagedLinksAsync(int offset, int pageSize, string noteKeyword = null);
    Task<bool> IsLinkExistsAsync(string token);
    Task TrackSucessRedirectionAsync(LinkTrackingRequest request);
    Task ClearTrackingDataAsync();
    //Task<IReadOnlyList<LinkTracking>> GetTrackingRecords(int linkId, int top = 100);
    Task<string> CreateLinkAsync(CreateLinkRequest createLinkRequest);
    Task<string> EditLinkAsync(EditLinkRequest editLinkRequest);
    Task SetEnableAsync(int id, bool isEnabled);
    Task<int> CountLinksAsync();
    Task<Link> GetLinkAsync(int id);
    Task<Link> GetLinkAsync(Guid tenantId, string token);
    Task<string> GetTokenByAkaNameAsync(Guid tenantId, string akaName);
    Task DeleteLink(int linkId);
    Task<IReadOnlyList<LinkTrackingDateCount>> GetLinkTrackingDateCount(int daysFromNow);
    Task<IReadOnlyList<ClientTypeCount>> GetClientTypeCounts(int daysFromNow, int topTypes);
    Task<IReadOnlyList<MostRequestedLinkCount>> GetMostRequestedLinkCount(int daysFromNow);
    Task<IReadOnlyList<RequestTrack>> GetRecentRequests(int top);
}