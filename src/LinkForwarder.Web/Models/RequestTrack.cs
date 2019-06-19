using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LinkForwarder.Models
{
    public class RequestTrack
    {
        public string FwToken { get; set; }

        public string Note { get; set; }

        public string UserAgent { get; set; }

        public string IpAddress { get; set; }

        public DateTime RequestTimeUtc { get; set; }
    }
}
