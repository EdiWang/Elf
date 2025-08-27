using Elf.Shared;

namespace Elf.Admin.Models;

public class PagedLinkResult : PagedResult
{
    public List<LinkModel> Links { get; set; }
}