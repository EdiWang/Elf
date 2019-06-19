using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace LinkForwarder.Models
{
    public class Link
    {
        public int Id { get; set; }

        public string OriginUrl { get; set; }

        public string FwToken { get; set; }

        public string Note { get; set; }

        public bool IsEnabled { get; set; }

        public DateTime UpdateTimeUtc { get; set; }
    }
}
