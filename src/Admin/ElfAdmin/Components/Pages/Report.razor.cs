
using System.Net.Http.Json;
using ElfAdmin.Models;
using Microsoft.AspNetCore.Components;
using Microsoft.Fast.Components.FluentUI;

namespace ElfAdmin.Components.Pages;

public partial class Report
{
    public bool IsBusy { get; set; }

    public bool IsChartBusy { get; set; }

    [Inject]
    public HttpClient Http { get; set; }

    [Inject]
    public IMessageService MessageService { get; set; }

    [Inject]
    public IDialogService DialogService { get; set; }

    public IQueryable<RequestTrack> RequestTrackItems { get; set; } = default;

    public DateTime? StartDateLocal { get; set; }
    public DateTime? EndDateLocal { get; set; }

    public List<LinkTrackingDateCount> LinkTrackingDateCount { get; set; } = new();
    public List<ClientTypeCount> ClientTypeCount { get; set; } = new();
    public List<MostRequestedLinkCount> MostRequestedLinkCount { get; set; } = new();

    public PaginationState Pagination { get; set; } = new PaginationState { ItemsPerPage = 5 };

    public int Offset { get; set; }

    public Report()
    {
        StartDateLocal = DateTime.Now.Date.AddDays(-7);
        EndDateLocal = DateTime.Now.Date;
    }

    protected override async Task OnInitializedAsync()
    {
        Pagination.TotalItemCountChanged += (sender, eventArgs) => StateHasChanged();

        await GetData();
        await GetReport();
    }

    private async Task GetReport()
    {
        IsChartBusy = true;

        var t0 = GetLinkTrackingDateCount();
        var t1 = GetClientType();
        var t2 = GetMostRequestedLinks();

        await Task.WhenAll(t0, t1, t2);

        IsChartBusy = false;
    }

    private async Task GetData()
    {
        IsBusy = true;

        try
        {
            var apiUrl = $"api/report/requests?take={Pagination.ItemsPerPage}&offset={Offset}";

            var result = await Http.GetFromJsonAsync<PagedRequestTrack>(apiUrl);
            RequestTrackItems = result.RequestTracks.AsQueryable();

            await Pagination.SetTotalItemCountAsync(result.TotalRows);
        }
        catch (Exception e)
        {
            await MessageService.ShowMessage($"Error getting data: {e.Message}", MessageIntent.Error);
        }

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

    private async Task Clear()
    {
        var isConfirmed = await ShowClearDataConfirmationAsync();
        if (isConfirmed)
        {
            try
            {
                var result = await Http.DeleteAsync($"api/report/tracking/clear");
                if (result.IsSuccessStatusCode)
                {
                    await MessageService.ShowMessage("Clear data successfully", MessageIntent.Success);
                    await Refresh();
                }
            }
            catch (Exception e)
            {
                await MessageService.ShowMessage($"Error clearing data: {e.Message}", MessageIntent.Error);
            }
        }
    }

    private async Task<bool> ShowClearDataConfirmationAsync()
    {
        var dialog = await DialogService.ShowConfirmationAsync("Do you want to clear tracking data?", "Yes", "No", "Confirmation");
        var result = await dialog.Result;
        return !result.Cancelled;
    }

    #region Chart

    private async Task GetLinkTrackingDateCount()
    {
        try
        {
            var response = await Http.PostAsJsonAsync($"api/report/tracking", new DateRangeRequest
            {
                StartDateUtc = StartDateLocal.Value.ToUniversalTime(),
                EndDateUtc = EndDateLocal.Value.ToUniversalTime()
            });

            response.EnsureSuccessStatusCode();

            LinkTrackingDateCount = await response.Content.ReadFromJsonAsync<List<LinkTrackingDateCount>>();
        }
        catch (Exception e)
        {
            await MessageService.ShowMessage($"Error getting data: {e.Message}", MessageIntent.Error);
        }
    }

    private async Task GetClientType()
    {
        try
        {
            var response = await Http.PostAsJsonAsync($"api/report/requests/clienttype", new DateRangeRequest
            {
                StartDateUtc = StartDateLocal.Value.ToUniversalTime(),
                EndDateUtc = EndDateLocal.Value.ToUniversalTime()
            });

            response.EnsureSuccessStatusCode();

            ClientTypeCount = await response.Content.ReadFromJsonAsync<List<ClientTypeCount>>();
        }
        catch (Exception e)
        {
            await MessageService.ShowMessage($"Error getting data: {e.Message}", MessageIntent.Error);
        }
    }

    private async Task GetMostRequestedLinks()
    {
        try
        {
            var response = await Http.PostAsJsonAsync($"api/report/requests/link", new DateRangeRequest
            {
                StartDateUtc = StartDateLocal.Value.ToUniversalTime(),
                EndDateUtc = EndDateLocal.Value.ToUniversalTime()
            });

            response.EnsureSuccessStatusCode();

            MostRequestedLinkCount = await response.Content.ReadFromJsonAsync<List<MostRequestedLinkCount>>();
        }
        catch (Exception e)
        {
            await MessageService.ShowMessage($"Error getting data: {e.Message}", MessageIntent.Error);
        }
    }

    #endregion
}