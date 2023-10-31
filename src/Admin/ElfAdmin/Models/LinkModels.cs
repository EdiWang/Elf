using System.ComponentModel.DataAnnotations;

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

public class LinkEditModel
{
    [Required]
    [MinLength(1)]
    [MaxLength(256)]
    [DataType(DataType.Url)]
    [Display(Name = "Origin Url")]
    public string OriginUrl { get; set; }

    [Display(Name = "Note")]
    public string Note { get; set; }

    [Display(Name = "Aka")]
    [MaxLength(32)]
    [RegularExpression("(?!-)([a-z0-9-]+)",
        ErrorMessage = "Aka can only accept lower case English letters (a-z) and numbers (0-9) with/out hyphen (-) in middle.")]
    public string AkaName { get; set; }

    [Required]
    [Display(Name = "Enable")]
    public bool IsEnabled { get; set; }

    [Display(Name = "TTL (seconds)")]
    [Range(0, 24 * 60 * 60)]
    public int TTL { get; set; }

    public string[] Tags { get; set; }
}

public class ListByTagsRequest
{
    [Required]
    [MinLength(1)]
    public int[] TagIds { get; set; }

    [Range(1, int.MaxValue)]
    public int Take { get; set; }

    [Range(0, int.MaxValue)]
    public int Offset { get; set; }
}
