using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LinkForwarder.Models
{
    public class ClientTypeCount
    {
        public string ClientTypeName { get; set; }
        public int Count { get; set; }
    }

    public class UserAgentCount
    {
        public string UserAgent { get; set; }
        public int RequestCount { get; set; }
    }
}
