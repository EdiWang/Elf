
using System.Net.Http.Json;
using ElfAdmin.Models;
using Microsoft.AspNetCore.Components;
using Microsoft.Fast.Components.FluentUI;

namespace ElfAdmin.Components.Pages;

public partial class Index
{
    public string searchBy { get; set; }

    [Inject]
    public HttpClient Http { get; set; }

    public IQueryable<LinkModel> Links { get; set; } = default;

    public PaginationState Pagination { get; set; } = new PaginationState { ItemsPerPage = 10 };

    protected override async Task OnInitializedAsync()
    {
        var result = await Http.GetFromJsonAsync<PagedLinkResult>($"api/link/list?take={Pagination.ItemsPerPage}&offset=0");

        Links = result.Links.AsQueryable();

        Pagination.TotalItemCountChanged += (sender, eventArgs) => StateHasChanged();
    }

    private async Task GoToPageAsync(int pageIndex)
    {
        await Pagination.SetCurrentPageIndexAsync(pageIndex);
    }

    private Appearance PageButtonAppearance(int pageIndex)
        => Pagination.CurrentPageIndex == pageIndex ? Appearance.Accent : Appearance.Neutral;

    private string AriaCurrentValue(int pageIndex)
        => Pagination.CurrentPageIndex == pageIndex ? "page" : null;

    private string AriaLabel(int pageIndex)
        => $"Go to page {pageIndex}";
}