using Elf.Shared;
using System.ComponentModel.DataAnnotations;

namespace ElfAdmin.Models;

public class RequestTrack
{
    public string FwToken { get; set; }

    public string Note { get; set; }

    public string UserAgent { get; set; }

    public string IpAddress { get; set; }

    public DateTime RequestTimeUtc { get; set; }

    public string IPCountry { get; set; }

    public string IPRegion { get; set; }

    public string IPCity { get; set; }

    public string IPASN { get; set; }

    public string IPOrg { get; set; }
}

public class PagedRequestTrack : PagedResult
{
    public IReadOnlyList<RequestTrack> RequestTracks { get; set; }
}

public class DateRangeRequest : IValidatableObject
{
    [Required]
    public DateTime StartDateUtc { get; set; } = DateTime.UtcNow.Date;

    [Required]
    public DateTime EndDateUtc { get; set; } = DateTime.UtcNow.Date;

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if (EndDateUtc < StartDateUtc)
        {
            yield return new("EndDateUtc must be greater than StartDateUtc", new[] { nameof(StartDateUtc), nameof(EndDateUtc) });
        }
    }
}

public class MostRequestedLinkCount
{
    public string FwToken { get; set; }
    public string Note { get; set; }
    public int RequestCount { get; set; }
}

public class ClientTypeCount
{
    public string ClientTypeName { get; set; }
    public int Count { get; set; }
}

public class LinkTrackingDateCount
{
    public int RequestCount { get; set; }

    public DateTime TrackingDateUtc { get; set; }
}
