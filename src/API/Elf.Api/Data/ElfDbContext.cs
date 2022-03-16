using Microsoft.EntityFrameworkCore;

namespace Elf.Api.Data;

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

    public virtual DbSet<LinkTrackingEntity> LinkTracking { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfiguration(new LinkEntityConfiguration());
        modelBuilder.ApplyConfiguration(new LinkTrackingEntityConfiguration());
    }
}