using Microsoft.EntityFrameworkCore;

namespace Elf.Data;

public class ElfDbContext : DbContext
{
    public ElfDbContext()
    {
    }

    public ElfDbContext(DbContextOptions options)
        : base(options)
    {
    }

    public virtual DbSet<LinkEntity> Link { get; set; }

    public virtual DbSet<TagEntity> Tag { get; set; }

    public virtual DbSet<LinkTagEntity> LinkTag { get; set; }

    public virtual DbSet<LinkTrackingEntity> LinkTracking { get; set; }

    public virtual DbSet<ElfConfigurationEntity> ElfConfiguration { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        var providerName = Database.ProviderName ?? string.Empty;

        modelBuilder.ApplyConfiguration(new LinkEntityConfiguration(providerName));
        modelBuilder.ApplyConfiguration(new TagEntityConfiguration());
        modelBuilder.ApplyConfiguration(new LinkTrackingEntityConfiguration(providerName));
        modelBuilder.ApplyConfiguration(new ElfConfigurationEntityConfiguration(providerName));

        modelBuilder
            .Entity<LinkEntity>()
            .HasMany(p => p.Tags)
            .WithMany(p => p.Links)
            .UsingEntity<LinkTagEntity>(
                j => j
                    .HasOne(pt => pt.Tag)
                    .WithMany()
                    .HasForeignKey(pt => pt.TagId),
                j => j
                    .HasOne(pt => pt.Link)
                    .WithMany()
                    .HasForeignKey(pt => pt.LinkId));
    }
}
