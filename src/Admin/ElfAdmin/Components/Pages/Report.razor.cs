
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

    [Inject]
    public IDialogService DialogService { get; set; }

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
}