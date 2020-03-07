using System;

namespace Elf.Services.Models
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
