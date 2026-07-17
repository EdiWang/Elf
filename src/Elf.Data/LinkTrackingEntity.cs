using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System.ComponentModel.DataAnnotations;

namespace Elf.Data;

public class LinkTrackingEntity
{
    [Key]
    public Guid Id { get; set; }

    public int LinkId { get; set; }

    [MaxLength(256)]
    public string UserAgent { get; set; }

    [MaxLength(64)]
    public string IpAddress { get; set; }

    [MaxLength(64)]
    public string IPCountry { get; set; }

    [MaxLength(64)]
    public string IPRegion { get; set; }

    [MaxLength(64)]
    public string IPCity { get; set; }

    [MaxLength(16)]
    public string IPASN { get; set; }

    [MaxLength(64)]
    public string IPOrg { get; set; }

    public DateTime RequestTimeUtc { get; set; }

    public virtual LinkEntity Link { get; set; }
}

internal class LinkTrackingEntityConfiguration(string providerName) : IEntityTypeConfiguration<LinkTrackingEntity>
{
    public void Configure(EntityTypeBuilder<LinkTrackingEntity> builder)
    {
        builder.Property(e => e.Id).ValueGeneratedNever();
        builder.Property(e => e.IpAddress).HasMaxLength(64).IsUnicode(false);
        builder.Property(e => e.IPASN).HasMaxLength(16).IsUnicode(false);
        builder.Property(e => e.IPOrg).HasMaxLength(64).IsUnicode(false);

        if (EfProviderNames.IsSqlServer(providerName))
        {
            builder.Property(e => e.RequestTimeUtc).HasColumnType("datetime");
        }

        builder.HasIndex(e => new { e.LinkId, e.RequestTimeUtc });
        builder.HasIndex(e => e.RequestTimeUtc);

        builder.HasOne(d => d.Link)
            .WithMany(p => p.LinkTrackings)
            .HasForeignKey(d => d.LinkId);
    }
}
