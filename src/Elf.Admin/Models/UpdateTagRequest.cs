using System.ComponentModel.DataAnnotations;

namespace Elf.Admin.Models;

public class UpdateTagRequest
{
    [Required]
    [MinLength(1)]
    [MaxLength(32)]
    public string Name { get; set; }
}