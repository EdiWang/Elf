using System;
using System.Collections.Generic;

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
        public Guid Id { get; set; }

        /// <summary>
        /// The tenant identifier
        /// </summary>
        public string Identifier { get; set; }

        public bool IsDefault { get; set; }

        /// <summary>
        /// Tenant items
        /// </summary>
        public Dictionary<string, object> Items { get; set; } = new();
    }
}
