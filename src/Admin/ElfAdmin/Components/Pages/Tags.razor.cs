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

    [Inject]
    public IDialogService DialogService { get; set; }

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
        if (!tag.InEditMode)
        {
            tag.InEditMode = true;
        }
        else
        {
            if (string.IsNullOrWhiteSpace(tag.Name))
            {
                await MessageService.ShowMessage("Tag name cannot be empty", MessageIntent.Warning);
                return;
            }

            try
            {
                var result = await Http.PutAsJsonAsync($"api/tag/{tag.Id}", new UpdateTagRequest { Name = tag.Name });
                if (result.IsSuccessStatusCode)
                {
                    await MessageService.ShowMessage("Tag updated successfully", MessageIntent.Success);
                }
            }
            catch (Exception e)
            {
                await MessageService.ShowMessage($"Error getting data: {e.Message}", MessageIntent.Error);
            }

            tag.InEditMode = false;
        }
    }

    private async Task Delete(Tag tag)
    {
        tag.InEditMode = false;

        var isConfirmed = await ShowDeleteConfirmationAsync();
        if (isConfirmed)
        {
            try
            {
                var result = await Http.DeleteAsync($"api/tag/{tag.Id}");
                if (result.IsSuccessStatusCode)
                {
                    await MessageService.ShowMessage("Tag deleted successfully", MessageIntent.Success);
                    await GetData();
                }
            }
            catch (Exception e)
            {
                await MessageService.ShowMessage($"Error deleting tag: {e.Message}", MessageIntent.Error);
            }
        }
    }

    private async Task<bool> ShowDeleteConfirmationAsync()
    {
        var dialog = await DialogService.ShowConfirmationAsync("Do you want to delete this tag?", "Yes", "No", "Delete confirmation");
        var result = await dialog.Result;
        return !result.Cancelled;
    }
}