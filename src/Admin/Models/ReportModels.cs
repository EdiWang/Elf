namespace ElfAdmin.Models;

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
