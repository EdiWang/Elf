using System.ComponentModel.DataAnnotations;

namespace Elf.Api.Data;

public class LinkEntity
{
    [Key]
    public int Id { get; set; } // int
    public string OriginUrl { get; set; } // nvarchar(256)
    public string FwToken { get; set; } // varchar(32)
    public string Note { get; set; } // nvarchar(max)
    public bool IsEnabled { get; set; } // bit
    public DateTime UpdateTimeUtc { get; set; } // datetime
    public string AkaName { get; set; } // varchar(32)
    public int? TTL { get; set; } // int
}
