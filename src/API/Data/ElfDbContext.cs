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

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfiguration(new LinkEntityConfiguration());
    }
}