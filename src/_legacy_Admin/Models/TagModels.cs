using System.Text.Json.Serialization;

namespace ElfAdmin.Models;

public class Tag
{
    public int Id { get; set; }

    public string Name { get; set; }

    [JsonIgnore]
    public bool InEditMode { get; set; }
}