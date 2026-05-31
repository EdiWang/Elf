using Elf.Shared;
using System.ComponentModel.DataAnnotations;

namespace Elf.Admin.Models;

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
    [RegularExpression(IdentifierRules.AkaNamePattern,
        ErrorMessage = "Aka can only contain lowercase letters, numbers, and hyphens, and cannot start or end with a hyphen.")]
    public string AkaName { get; set; }

    [Required]
    [Display(Name = "Enable")]
    public bool IsEnabled { get; set; }

    [Display(Name = "TTL (seconds)")]
    [Range(0, 24 * 60 * 60)]
    public int TTL { get; set; }

    public string[] Tags { get; set; }
}
