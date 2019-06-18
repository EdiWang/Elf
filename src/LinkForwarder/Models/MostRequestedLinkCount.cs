using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LinkForwarder.Models
{
    public class MostRequestedLinkCount
    {
        public string FwToken { get; set; }
        public string Note { get; set; }
        public int RequestCount { get; set; }
    }
}
