using System;

namespace LinkForwarder.Web.Models
{
    public class LinkTrackingDateCount
    {
        public int RequestCount { get; set; }

        public DateTime TrackingDateUtc { get; set; }
    }
}
