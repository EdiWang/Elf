using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Elf.Api.Data;

public class LinkTrackingEntity
{
    public Guid Id { get; set; } = Guid.NewGuid(); // uniqueidentifier

    public Guid TenantId { get; set; } // uniqueidentifier

    public int LinkId { get; set; } // int

    public string UserAgent { get; set; } // nvarchar(256)

    public string IpAddress { get; set; } // varchar(64)

    public DateTime RequestTimeUtc { get; set; } // datetime

    public virtual LinkEntity Link { get; set; }
}

internal class LinkTrackingEntityConfiguration : IEntityTypeConfiguration<LinkTrackingEntity>
{
    public void Configure(EntityTypeBuilder<LinkTrackingEntity> builder)
    {
        builder.Property(e => e.UserAgent).HasMaxLength(256);
        builder.Property(e => e.IpAddress).HasMaxLength(64);
        builder.Property(e => e.RequestTimeUtc).HasColumnType("datetime");

        builder.HasOne(d => d.Link)
            .WithMany(p => p.LinkTrackings)
            .HasForeignKey(d => d.LinkId);
    }
}