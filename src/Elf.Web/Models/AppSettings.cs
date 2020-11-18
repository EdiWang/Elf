namespace Elf.Web.Models
{
    public class AppSettings
    {
        public string DefaultRedirectionUrl { get; set; }

        public int TopClientTypes { get; set; }
    }

    public enum FeatureFlags
    {
        HonorDNT,
        AllowSelfRedirection
    }
}
