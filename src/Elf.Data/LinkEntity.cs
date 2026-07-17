using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System.Text.Json.Serialization;

namespace Elf.Data;

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

internal class LinkEntityConfiguration(string providerName) : IEntityTypeConfiguration<LinkEntity>
{
    public void Configure(EntityTypeBuilder<LinkEntity> builder)
    {
        builder.Property(e => e.OriginUrl).HasMaxLength(256);
        builder.Property(e => e.FwToken).HasMaxLength(32).IsUnicode(false);
        builder.Property(e => e.AkaName).HasMaxLength(32).IsUnicode(false);

        if (EfProviderNames.IsSqlServer(providerName))
        {
            builder.Property(e => e.UpdateTimeUtc).HasColumnType("datetime");
            builder.HasIndex(e => e.FwToken).IsUnique().HasFilter("[FwToken] IS NOT NULL");
            builder.HasIndex(e => e.AkaName).IsUnique().HasFilter("[AkaName] IS NOT NULL");
        }
        else if (EfProviderNames.IsPostgreSql(providerName))
        {
            builder.Property(e => e.UpdateTimeUtc).HasColumnType("timestamp with time zone");
            builder.HasIndex(e => e.FwToken).IsUnique().HasFilter("\"FwToken\" IS NOT NULL");
            builder.HasIndex(e => e.AkaName).IsUnique().HasFilter("\"AkaName\" IS NOT NULL");
        }
        else
        {
            builder.HasIndex(e => e.FwToken).IsUnique();
            builder.HasIndex(e => e.AkaName).IsUnique();
        }

        builder.HasIndex(e => e.UpdateTimeUtc);
    }
}
