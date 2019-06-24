using System;
using System.Collections.Generic;
using System.Text;

namespace LinkForwarder.Services
{
    public class LinkTrackingRequest
    {
        public string IpAddress { get; set; }
        public string UserAgent { get; set; }
        public int LinkId { get; set; }

        public LinkTrackingRequest(string ipAddress, string userAgent, int linkId)
        {
            IpAddress = ipAddress;
            UserAgent = userAgent;
            LinkId = linkId;
        }
    }
}
