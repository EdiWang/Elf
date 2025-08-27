using System.ComponentModel.DataAnnotations;

namespace Elf.Admin.Models;

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