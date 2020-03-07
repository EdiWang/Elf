using System;

namespace Elf.Services.Entities
{
    public class LinkTracking
    {
        public Guid Id { get; set; }

        public int LinkId { get; set; }

        public string UserAgent { get; set; }

        public string IpAddress { get; set; }

        public DateTime RequestTimeUtc { get; set; }
    }
}
