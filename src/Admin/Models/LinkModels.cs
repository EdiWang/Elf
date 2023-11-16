using Elf.Shared;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace ElfAdmin.Models;

public class PagedLinkResult : PagedResult
{
    public List<LinkModel> Links { get; set; }
}

public class LinkModel
{
    public int Id { get; set; }
    public string OriginUrl { get; set; }
    public string FwToken { get; set; }
    public string Note { get; set; }
    public bool IsEnabled { get; set; }
    public DateTime UpdateTimeUtc { get; set; }
    public string AkaName { get; set; }
    public int? TTL { get; set; }
    public Tag[] Tags { get; set; }
    public int Hits { get; set; }
}

public class LinkEditModelUI : LinkEditModel
{
    [JsonIgnore]
    public IEnumerable<Tag> SelectedTags { get; set; } = Array.Empty<Tag>();
}