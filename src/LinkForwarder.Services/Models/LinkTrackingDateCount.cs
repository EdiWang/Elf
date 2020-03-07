using System;

namespace Elf.Services.Models
{
    public class LinkTrackingDateCount
    {
        public int RequestCount { get; set; }

        public DateTime TrackingDateUtc { get; set; }
    }
}
