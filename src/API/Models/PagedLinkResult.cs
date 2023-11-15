namespace Elf.Api.Models;

public class PagedLinkResult : PagedResult
{
    public IReadOnlyList<LinkModel> Links { get; set; }
}