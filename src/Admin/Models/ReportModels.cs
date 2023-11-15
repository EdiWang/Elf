namespace ElfAdmin.Models;

public class MostRequestedLinkCount
{
    public string FwToken { get; set; }
    public string Note { get; set; }
    public int RequestCount { get; set; }
}

public class LinkTrackingDateCount
{
    public int RequestCount { get; set; }

    public DateTime TrackingDateUtc { get; set; }
}
