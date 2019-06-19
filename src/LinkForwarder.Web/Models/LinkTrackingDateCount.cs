using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LinkForwarder.Models
{
    public class LinkTrackingDateCount
    {
        public int RequestCount { get; set; }

        public DateTime TrackingDateUtc { get; set; }
    }
}
