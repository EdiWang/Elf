using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System.Text.Json.Serialization;

namespace Elf.Admin.Data;

public class LinkEntity
{
    public LinkEntity()
    {
        LinkTrackings = new HashSet<LinkTrackingEntity>();
        Tags = new HashSet<TagEntity>();
    }

    public int Id { get; set; }
    public string OriginUrl { get; set; }
    public string FwToken { get; set; }
    public string Note { get; set; }
    public bool IsEnabled { get; set; }
    public DateTime UpdateTimeUtc { get; set; }
    public string AkaName { get; set; }
    public int? TTL { get; set; }

    [JsonIgnore]
    public virtual ICollection<LinkTrackingEntity> LinkTrackings { get; set; }

    [JsonIgnore]
    public virtual ICollection<TagEntity> Tags { get; set; }
}

internal class LinkEntityConfiguration : IEntityTypeConfiguration<LinkEntity>
{
    public void Configure(EntityTypeBuilder<LinkEntity> builder)
    {
        builder.Property(e => e.OriginUrl).HasMaxLength(256);
        builder.Property(e => e.FwToken).HasMaxLength(32);
        builder.Property(e => e.AkaName).HasMaxLength(32);
        builder.Property(e => e.UpdateTimeUtc).HasColumnType("datetime");

        builder.HasIndex(e => e.FwToken).IsUnique().HasFilter("[FwToken] IS NOT NULL");
        builder.HasIndex(e => e.AkaName).IsUnique().HasFilter("[AkaName] IS NOT NULL");
        builder.HasIndex(e => e.UpdateTimeUtc);
    }
}