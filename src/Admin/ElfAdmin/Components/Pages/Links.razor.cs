
using System.Net.Http.Json;
using ElfAdmin.Models;
using Microsoft.AspNetCore.Components;
using Microsoft.Fast.Components.FluentUI;
using Microsoft.JSInterop;

namespace ElfAdmin.Components.Pages;

public partial class Links
{
    public string SearchTerm { get; set; }

    public bool IsBusy { get; set; }

    [Inject]
    public HttpClient Http { get; set; }

    [Inject]
    public IJSRuntime JavaScriptRuntime { get; set; }

    [Inject]
    public IMessageService MessageService { get; set; }

    [Inject]
    public IDialogService DialogService { get; set; }

    public IQueryable<LinkModel> LinkItems { get; set; } = default;

    public PaginationState Pagination { get; set; } = new PaginationState { ItemsPerPage = 10 };

    public int Offset { get; set; }

    protected override async Task OnInitializedAsync()
    {
        Pagination.TotalItemCountChanged += (sender, eventArgs) => StateHasChanged();

        await GetData();
    }

    private async Task GetData()
    {
        IsBusy = true;

        var apiUrl = $"api/link/list?take={Pagination.ItemsPerPage}&offset={Offset}";

        if (!string.IsNullOrEmpty(SearchTerm))
        {
            apiUrl += $"&term={SearchTerm}";
        }

        var result = await Http.GetFromJsonAsync<PagedLinkResult>(apiUrl);
        LinkItems = result.Links.AsQueryable();

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
        Pagination = new PaginationState { ItemsPerPage = 10 };
        LinkItems = new List<LinkModel>().AsQueryable();
        Offset = 0;

        await GetData();
    }

    private async Task HandleSearchInput(string value)
    {
        await Refresh();
    }

    private async Task SetEnableValue(LinkModel link, bool value)
    {
        link.IsEnabled = value;

        try
        {
            var result = await Http.PutAsync($"api/link/{link.Id}/enable?isEnabled={value}", null);
            if (result.IsSuccessStatusCode)
            {
                await ShowMessage("Link updated successfully", MessageIntent.Success);
            }
        }
        catch (Exception e)
        {
            link.IsEnabled = !value;

            await ShowMessage($"Error updating link: {e.Message}", MessageIntent.Error);
        }
    }

    #region Action Buttons

    private async Task Copy(string fwToken)
    {
        var fwUrl = $"{Constants.APIAddress}/fw/{fwToken}";
        await JavaScriptRuntime.InvokeVoidAsync("clipboardCopy.copyText", fwUrl);
    }

    private async Task Delete(LinkModel link)
    {
        var isConfirmed = await ShowDeleteConfirmationAsync();
        if (isConfirmed)
        {
            try
            {
                var result = await Http.DeleteAsync($"api/link/{link.Id}");
                if (result.IsSuccessStatusCode)
                {
                    await ShowMessage("Link deleted successfully", MessageIntent.Success);
                    await Refresh();
                }
            }
            catch (Exception e)
            {
                await ShowMessage($"Error deleting link: {e.Message}", MessageIntent.Error);
            }
        }
    }

    private async Task<bool> ShowDeleteConfirmationAsync()
    {
        var dialog = await DialogService.ShowConfirmationAsync("Do you want to delete this link?", "Yes", "No", "Delete confirmation");
        var result = await dialog.Result;
        return !result.Cancelled;
    }

    #endregion

    private async Task ShowMessage(string message, MessageIntent messageIntent)
    {
        await MessageService.ShowMessageBarAsync(options =>
            {
                options.Title = message;
                options.Intent = messageIntent;
                options.Section = "MESSAGES_BOTTOM";
                options.Timeout = 3;
            });
    }
}