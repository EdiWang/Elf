
using Microsoft.AspNetCore.Components;

namespace ElfAdmin.Components.Pages;

public partial class Report
{
    [Inject]
    public HttpClient Http { get; set; }
}