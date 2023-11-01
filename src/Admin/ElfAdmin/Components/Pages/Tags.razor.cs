using System.Net.Http.Json;
using ElfAdmin.Models;
using Microsoft.AspNetCore.Components;
using Microsoft.Fast.Components.FluentUI;

namespace ElfAdmin.Components.Pages;

public partial class Tags
{
    public bool IsBusy { get; set; }

    [Inject]
    public HttpClient Http { get; set; }

    [Inject]
    public IMessageService MessageService { get; set; }

    public List<Tag> TagItems { get; set; }

    protected override async Task OnInitializedAsync()
    {
        await GetData();
    }

    private async Task GetData()
    {
        IsBusy = true;

        TagItems?.Clear();

        try
        {
            var apiUrl = $"api/tag/list";
            TagItems = await Http.GetFromJsonAsync<List<Tag>>(apiUrl);
        }
        catch (Exception e)
        {
            await MessageService.ShowMessage($"Error getting data: {e.Message}", MessageIntent.Error);
        }

        IsBusy = false;
    }

    private async Task Edit(Tag tag)
    {
        tag.InEditMode = true;
    }
}