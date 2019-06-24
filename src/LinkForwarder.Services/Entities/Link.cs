using System;

namespace LinkForwarder.Services.Entities
{
    public class Link
    {
        public int Id { get; set; }

        public string OriginUrl { get; set; }

        public string FwToken { get; set; }

        public string Note { get; set; }

        public string AkaName { get; set; }

        public bool IsEnabled { get; set; }

        public DateTime UpdateTimeUtc { get; set; }
    }
}
