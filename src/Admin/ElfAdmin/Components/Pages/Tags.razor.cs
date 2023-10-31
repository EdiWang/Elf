
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

    protected override async Task OnInitializedAsync()
    { 
        await GetData();
    }

    private async Task GetData()
    {
        IsBusy = true;

        

        IsBusy = false;
    }
}