using System.Collections.Generic;
using System.Threading.Tasks;
using Edi.Practice.RequestResponseModel;
using LinkForwarder.Models;

namespace LinkForwarder.Services
{
    public interface ILinkForwarderService
    {
        Task<Response<IReadOnlyList<RecentRequest>>> GetRecentRequestsAsync(int top);
        Task<Response<IReadOnlyList<Link>>> GetPagedLinksAsync(int pageIndex, int pageSize, int take);
        Task<Response<bool>> IsLinkExistsAsync(string token);
        Task<Response> TrackSucessRedirectionAsync(string ipAddress, string userAgent, int linkId);
        Task<Response<string>> CreateLinkAsync(string originUrl, string note, bool isEnabled);
        Task<Response<int>> CountLinksAsync();
        Task<Response<Link>> GetLinkAsync(string token);
        Task<Response> DeleteLink(int linkId);
    }
}