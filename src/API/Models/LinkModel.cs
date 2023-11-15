using Elf.Api.Data;

namespace Elf.Api.Models;

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
    public TagEntity[] Tags { get; set; }
    public int Hits { get; set; }
}