
using System.Net.Http.Json;
using ElfAdmin.Models;
using Microsoft.AspNetCore.Components;
using Microsoft.Fast.Components.FluentUI;

namespace ElfAdmin.Components.Pages;

public partial class Report
{
    public bool IsBusy { get; set; }

    [Inject]
    public HttpClient Http { get; set; }

    [Inject]
    public IMessageService MessageService { get; set; }

    public IQueryable<RequestTrack> RequestTrackItems { get; set; } = default;

    public PaginationState Pagination { get; set; } = new PaginationState { ItemsPerPage = 5 };

    public int Offset { get; set; }

    protected override async Task OnInitializedAsync()
    {
        Pagination.TotalItemCountChanged += (sender, eventArgs) => StateHasChanged();

        await GetData();
    }

    private async Task GetData()
    {
        IsBusy = true;

        var apiUrl = $"api/report/requests?take={Pagination.ItemsPerPage}&offset={Offset}";

        var result = await Http.GetFromJsonAsync<PagedRequestTrack>(apiUrl);
        RequestTrackItems = result.RequestTracks.AsQueryable();

        await Pagination.SetTotalItemCountAsync(result.TotalRows);

        IsBusy = false;
    }

    private async Task CurrentPageIndexChanged()
    {
        Offset = Pagination.CurrentPageIndex * Pagination.ItemsPerPage;
        await GetData();
    }

    private async Task Refresh()
    {
        Pagination = new PaginationState { ItemsPerPage = 5 };
        RequestTrackItems = new List<RequestTrack>().AsQueryable();
        Offset = 0;

        await GetData();
    }

}