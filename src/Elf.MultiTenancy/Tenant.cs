using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Elf.MultiTenancy
{
    /// <summary>
    /// Tenant information
    /// </summary>
    public class Tenant
    {
        /// <summary>
        /// The tenant Id
        /// </summary>
        public string Id { get; set; }

        /// <summary>
        /// The tenant identifier
        /// </summary>
        public string Identifier { get; set; }

        /// <summary>
        /// Tenant items
        /// </summary>
        public Dictionary<string, object> Items { get; set; } = new();
    }
}
