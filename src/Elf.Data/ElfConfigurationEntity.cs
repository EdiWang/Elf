using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System.ComponentModel.DataAnnotations;

namespace Elf.Data;

public class ElfConfigurationEntity
{
    [Key]
    [MaxLength(64)]
    public string CfgKey { get; set; }

    public string CfgValue { get; set; }

    public DateTime? LastModifiedTimeUtc { get; set; }
}

internal class ElfConfigurationEntityConfiguration(string providerName) : IEntityTypeConfiguration<ElfConfigurationEntity>
{
    public void Configure(EntityTypeBuilder<ElfConfigurationEntity> builder)
    {
        builder.ToTable("ElfConfiguration");
        builder.Property(e => e.CfgKey).HasMaxLength(64).IsUnicode(false);

        if (EfProviderNames.IsSqlServer(providerName))
        {
            builder.Property(e => e.LastModifiedTimeUtc).HasColumnType("datetime");
        }
        else if (EfProviderNames.IsPostgreSql(providerName))
        {
            builder.Property(e => e.LastModifiedTimeUtc).HasColumnType("timestamp with time zone");
        }
    }
}
