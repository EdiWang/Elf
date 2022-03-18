using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Elf.Api.Data;

public class LinkTrackingEntity
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid TenantId { get; set; }

    public int LinkId { get; set; }

    public string UserAgent { get; set; }

    public string IpAddress { get; set; }

    public string IPCountry { get; set; }

    public string IPRegion { get; set; }

    public string IPCity { get; set; }

    public string IPASN { get; set; }

    public string IPOrg { get; set; }

    public DateTime RequestTimeUtc { get; set; }

    public virtual LinkEntity Link { get; set; }
}

internal class LinkTrackingEntityConfiguration : IEntityTypeConfiguration<LinkTrackingEntity>
{
    public void Configure(EntityTypeBuilder<LinkTrackingEntity> builder)
    {
        builder.Property(e => e.UserAgent).HasMaxLength(256);
        builder.Property(e => e.IpAddress).HasMaxLength(64);
        builder.Property(e => e.IPCountry).HasMaxLength(64);
        builder.Property(e => e.IPRegion).HasMaxLength(64);
        builder.Property(e => e.IPCity).HasMaxLength(64);
        builder.Property(e => e.IPASN).HasMaxLength(16);
        builder.Property(e => e.IPOrg).HasMaxLength(64);
        builder.Property(e => e.RequestTimeUtc).HasColumnType("datetime");

        builder.HasOne(d => d.Link)
            .WithMany(p => p.LinkTrackings)
            .HasForeignKey(d => d.LinkId);
    }
}