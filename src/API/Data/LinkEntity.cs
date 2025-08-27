using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Elf.Api.Data;

public class LinkEntity
{
    public int Id { get; set; } // int
    public string OriginUrl { get; set; } // nvarchar(256)
    public string FwToken { get; set; } // varchar(32)
    public string Note { get; set; } // nvarchar(max)
    public bool IsEnabled { get; set; } // bit
    public DateTime UpdateTimeUtc { get; set; } // datetime
    public string AkaName { get; set; } // varchar(32)
    public int? TTL { get; set; } // int
}

internal class LinkEntityConfiguration : IEntityTypeConfiguration<LinkEntity>
{
    public void Configure(EntityTypeBuilder<LinkEntity> builder)
    {
        builder.Property(e => e.OriginUrl).HasMaxLength(256);
        builder.Property(e => e.FwToken).HasMaxLength(32);
        builder.Property(e => e.AkaName).HasMaxLength(32);
        builder.Property(e => e.UpdateTimeUtc).HasColumnType("datetime");
    }
}