namespace LinkForwarder.Web.Models
{
    public class ClientTypeCount
    {
        public string ClientTypeName { get; set; }
        public int Count { get; set; }
    }

    public class UserAgentCount
    {
        public string UserAgent { get; set; }
        public int RequestCount { get; set; }
    }
}
