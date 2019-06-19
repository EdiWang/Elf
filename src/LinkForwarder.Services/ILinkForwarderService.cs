using System.Collections.Generic;
using System.Threading.Tasks;
using Edi.Practice.RequestResponseModel;

namespace LinkForwarder.Services
{
    public interface ILinkForwarderService
    {
        Task<Response<(IReadOnlyList<Link> Links, int TotalRows)>> GetPagedLinksAsync(int offset, int pageSize, string noteKeyword = null);
        Task<Response<bool>> IsLinkExistsAsync(string token);
        Task<Response> TrackSucessRedirectionAsync(string ipAddress, string userAgent, int linkId);
        Task<Response<IReadOnlyList<LinkTracking>>> GetTrackingRecords(int linkId, int top = 100);
        Task<Response<string>> CreateLinkAsync(string originUrl, string note, bool isEnabled);
        Task<Response<string>> EditLinkAsync(int linkId, string newUrl, string note, bool isEnabled);
        Task<Response<int>> CountLinksAsync();
        Task<Response<Link>> GetLinkAsync(int id);
        Task<Response<Link>> GetLinkAsync(string token);
        Task<Response<int>> GetClickCount(int linkId);
        Task<Response> DeleteLink(int linkId);
        Task<Response<IReadOnlyList<LinkTrackingDateCount>>> GetLinkTrackingDateCount(int daysFromNow);
        Task<Response<IReadOnlyList<ClientTypeCount>>> GetClientTypeCounts(int daysFromNow);
        Task<Response<IReadOnlyList<MostRequestedLinkCount>>> GetMostRequestedLinkCount(int daysFromNow);
        Task<Response<IReadOnlyList<RequestTrack>>> GetRecentRequests(int top);
    }
}