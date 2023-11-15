using System.ComponentModel.DataAnnotations;

namespace Elf.Shared;

public class UpdateTagRequest
{
    [Required]
    [MaxLength(32)]
    public string Name { get; set; }
}