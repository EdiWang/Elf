using System.ComponentModel.DataAnnotations;

namespace Elf.Admin.Models;

public class UpdateTagRequest
{
    [Required]
    [MaxLength(32)]
    public string Name { get; set; }
}