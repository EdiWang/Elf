using System;
using LinqToDB.Mapping;

namespace Elf.Services.Entities
{
    [Table]
    public class LinkTracking
    {
        [PrimaryKey]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Column]
        public int LinkId { get; set; }

        [Column]
        public string UserAgent { get; set; }

        [Column]
        public string IpAddress { get; set; }

        [Column]
        public DateTime RequestTimeUtc { get; set; }
    }
}
