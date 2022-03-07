using Elf.Api.Data;

namespace Elf.Api.Models;

public class PagedLinkResult
{
    public IReadOnlyList<LinkEntity> Links { get; set; }

    public int TotalRows { get; set; }

    public int PageSize { get; set; }
}