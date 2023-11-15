using Elf.Shared;

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
