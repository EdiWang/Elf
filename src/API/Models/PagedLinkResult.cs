using Elf.Shared;

namespace Elf.Api.Models;

public class PagedLinkResult : PagedResult
{
    public List<LinkModel> Links { get; set; }
}