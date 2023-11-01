
using System.Net.Http.Json;
using System.Text.Json;
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

        try
        {
            var apiUrl = $"api/link/list?take={Pagination.ItemsPerPage}&offset={Offset}";

            if (!string.IsNullOrEmpty(SearchTerm))
            {
                apiUrl += $"&term={SearchTerm}";
            }

            var result = await Http.GetFromJsonAsync<PagedLinkResult>(apiUrl);
            LinkItems = result.Links.AsQueryable();

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
        Pagination = new PaginationState { ItemsPerPage = 10 };
        LinkItems = new List<LinkModel>().AsQueryable();
        Offset = 0;

        await GetData();
    }

    private async Task HandleSearchInput(string value)
    {
        await Refresh();
    }

    private async Task New()
    {
        DialogParameters parameters = new()
        {
            Title = $"Create link",
            PrimaryAction = "Save",
            SecondaryAction = "Cancel",
            Width = "600px",
            Modal = true,
            PreventScroll = true
        };

        var editModel = new LinkEditModel() { IsEnabled = true, TTL = 3600 };

        IDialogReference dialog = await DialogService.ShowDialogAsync<EditLinkDialog>(editModel, parameters);
        DialogResult result = await dialog.Result;

        if (result.Data is not null)
        {
            var diagResult = result.Data as LinkEditModel;

            IsBusy = true;

            if (diagResult.SelectedTags.Any())
            {
                diagResult.Tags = diagResult.SelectedTags.Select(t => t.Name).ToArray();
            }
            else
            {
                diagResult.Tags = null;
            }

            try
            {
                IsBusy = true;

                var response = await Http.PostAsJsonAsync($"api/link/create", diagResult);
                if (response.IsSuccessStatusCode)
                {
                    await MessageService.ShowMessage("Link created successfully", MessageIntent.Success);
                    await GetData();
                }
            }
            catch (Exception e)
            {
                await MessageService.ShowMessage($"Error creating link: {e.Message}", MessageIntent.Error);
            }

            IsBusy = false;
        }
    }

    private async Task SetEnableValue(LinkModel link, bool value)
    {
        link.IsEnabled = value;

        try
        {
            var result = await Http.PutAsync($"api/link/{link.Id}/enable?isEnabled={value}", null);
            if (result.IsSuccessStatusCode)
            {
                await MessageService.ShowMessage("Link updated successfully", MessageIntent.Success);
            }
        }
        catch (Exception e)
        {
            link.IsEnabled = !value;

            await MessageService.ShowMessage($"Error updating link: {e.Message}", MessageIntent.Error);
        }
    }

    #region Action Buttons

    private async Task Copy(string fwToken)
    {
        var fwUrl = $"{Constants.APIAddress}/fw/{fwToken}";
        await JavaScriptRuntime.InvokeVoidAsync("clipboardCopy.copyText", fwUrl);
    }

    private async Task Share(LinkModel link)
    {
        DialogParameters parameters = new()
        {
            Title = $"Share link",
            Width = "400px",
            Modal = true,
            PreventScroll = true
        };

        IDialogReference dialog = await DialogService.ShowDialogAsync<ShareDialog>(link, parameters);
    }

    private async Task Edit(LinkModel link)
    {
        DialogParameters parameters = new()
        {
            Title = $"Edit link",
            PrimaryAction = "Save",
            SecondaryAction = "Cancel",
            Width = "600px",
            Modal = true,
            PreventScroll = true
        };

        var editModel = new LinkEditModel()
        {
            OriginUrl = link.OriginUrl,
            Note = link.Note,
            AkaName = link.AkaName,
            IsEnabled = link.IsEnabled,
            TTL = link.TTL.GetValueOrDefault(),
            Tags = link.Tags.Select(t => t.Name).ToArray(),
            SelectedTags = link.Tags
        };

        IDialogReference dialog = await DialogService.ShowDialogAsync<EditLinkDialog>(editModel, parameters);
        DialogResult result = await dialog.Result;
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
                    await MessageService.ShowMessage("Link deleted successfully", MessageIntent.Success);
                    await Refresh();
                }
            }
            catch (Exception e)
            {
                await MessageService.ShowMessage($"Error deleting link: {e.Message}", MessageIntent.Error);
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
}