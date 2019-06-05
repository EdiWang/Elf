using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LinkForwarder.Authentication
{
    public class AzureAdOption
    {
        public string ClientId { get; set; }

        public string Instance { get; set; }

        public string Domain { get; set; }

        public string TenantId { get; set; }

        public string CallbackPath { get; set; }
    }
}
