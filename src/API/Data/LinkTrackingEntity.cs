using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Elf.Api.Data;

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

internal class LinkTrackingEntityConfiguration : IEntityTypeConfiguration<LinkTrackingEntity>
{
    public void Configure(EntityTypeBuilder<LinkTrackingEntity> builder)
    {
        builder.Property(e => e.Id).ValueGeneratedNever();
        builder.Property(e => e.RequestTimeUtc).HasColumnType("datetime");

        builder.HasOne(d => d.Link)
            .WithMany(p => p.LinkTrackings)
            .HasForeignKey(d => d.LinkId);
    }
}