using System;
using LinqToDB.Mapping;

namespace Elf.Services.Entities
{
    public class LinkTracking
    {
        [PrimaryKey]
        public Guid Id { get; set; } = Guid.NewGuid();

        public int LinkId { get; set; }

        public string UserAgent { get; set; }

        public string IpAddress { get; set; }

        public DateTime RequestTimeUtc { get; set; }
    }
}
