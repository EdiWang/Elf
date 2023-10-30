namespace ElfAdmin.Models;

public class PagedResult
{
    public int TotalRows { get; set; }

    public int PageSize { get; set; }
}

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
    public TagEntity[] Tags { get; set; }
    public int Hits { get; set; }
}

public class TagEntity
{
    public int Id { get; set; }

    public string Name { get; set; }
}