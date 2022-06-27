namespace Elf.Api.Models;

public class PagedLinkResult
{
    public IReadOnlyList<LinkModel> Links { get; set; }

    public int TotalRows { get; set; }

    public int PageSize { get; set; }
}