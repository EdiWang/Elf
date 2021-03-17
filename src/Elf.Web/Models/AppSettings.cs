namespace Elf.Web.Models
{
    public class AppSettings
    {
        public int TopClientTypes { get; set; }
    }

    public enum FeatureFlags
    {
        HonorDNT,
        AllowSelfRedirection
    }
}
