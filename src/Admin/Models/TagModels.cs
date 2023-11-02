
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace ElfAdmin.Models;

public class Tag
{
    public int Id { get; set; }

    public string Name { get; set; }

    [JsonIgnore]
    public bool InEditMode { get; set; }
}

public class UpdateTagRequest
{
    [Required]
    [MaxLength(32)]
    public string Name { get; set; }
}