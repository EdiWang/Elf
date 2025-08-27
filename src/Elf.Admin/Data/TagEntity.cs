using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Elf.Admin.Data;

public class TagEntity
{
    public TagEntity()
    {
        Links = new HashSet<LinkEntity>();
    }

    [Key]
    public int Id { get; set; }

    [MaxLength(32)]
    public string Name { get; set; }

    [JsonIgnore]
    public virtual ICollection<LinkEntity> Links { get; set; }
}