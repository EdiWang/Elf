using Elf.Services.Entities;

namespace Elf.Api.Models;

public class PagedLinkResult
{
    public IReadOnlyList<Link> Links { get; set; }

    public int TotalRows { get; set; }

    public int PageSize { get; set; }

    public int PageIndex { get; set; }
}