using System;
using System.Collections.Generic;
using System.Text;

namespace LinkForwarder.Services
{
    public class CreateLinkRequest
    {
        public string OriginUrl { get; set; }

        public string Note { get; set; }

        public string AkaName { get; set; }

        public bool IsEnabled { get; set; }
    }
}
