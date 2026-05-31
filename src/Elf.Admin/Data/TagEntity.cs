using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

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

internal class TagEntityConfiguration : IEntityTypeConfiguration<TagEntity>
{
    public void Configure(EntityTypeBuilder<TagEntity> builder)
    {
        builder.Property(e => e.Name).HasMaxLength(32);
        builder.HasIndex(e => e.Name).IsUnique();
    }
}