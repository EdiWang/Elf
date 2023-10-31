
using System.ComponentModel.DataAnnotations;

namespace ElfAdmin.Models;

public class Tag
{
    public int Id { get; set; }

    public string Name { get; set; }
}

public class UpdateTagRequest
{
    [Required]
    [MaxLength(32)]
    public string Name { get; set; }
}