
using System.Net.Http.Json;
using ElfAdmin.Models;
using Microsoft.AspNetCore.Components;
using Microsoft.Fast.Components.FluentUI;
using Microsoft.JSInterop;

namespace ElfAdmin.Components.Pages;

public partial class Links
{
    public string searchBy { get; set; }

    public bool IsBusy { get; set; }

    [Inject]
    public HttpClient Http { get; set; }

    [Inject]
    public IJSRuntime JavaScriptRuntime { get; set; }

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

        var result = await Http.GetFromJsonAsync<PagedLinkResult>($"api/link/list?take={Pagination.ItemsPerPage}&offset={Offset}");
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

    private async Task SetEnableValue(LinkModel link, bool value)
    {
        link.IsEnabled = value;

        // var result = await Http.PostAsJsonAsync($"api/link/setenable?id={id}&value={value}", null);
        // if (result.IsSuccessStatusCode)
        // {
        //     await Refresh();
        // }
    }

    #region Action Buttons

    private async Task Copy(string fwToken)
    {
        var fwUrl = $"{Constants.APIAddress}/fw/{fwToken}";
        await JavaScriptRuntime.InvokeVoidAsync("clipboardCopy.copyText", fwUrl);
    }

    #endregion
}