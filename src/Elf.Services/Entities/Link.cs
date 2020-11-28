using System;
using LinqToDB.Mapping;

namespace Elf.Services.Entities
{
    [Table]
    public class Link
    {
        [PrimaryKey, Identity]
        public int Id { get; set; }

        [Column]
        public string OriginUrl { get; set; }

        [Column]
        public string FwToken { get; set; }

        [Column]
        public string Note { get; set; }

        [Column]
        public string AkaName { get; set; }

        [Column]
        public bool IsEnabled { get; set; }

        [Column]
        public DateTime UpdateTimeUtc { get; set; }

        [Column]
        public int? TTL { get; set; }
    }
}
