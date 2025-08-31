using System.Net;
using System.Reflection;

namespace Elf.Shared;

public static class Utils
{
    public static bool IsRunningInDocker() => Environment.GetEnvironmentVariable("DOTNET_RUNNING_IN_CONTAINER") == "true";

    public static void SetAppDomainData(string key, object value)
    {
        AppDomain.CurrentDomain.SetData(key, value);
    }

    public static T GetAppDomainData<T>(string key, T defaultValue = default(T))
    {
        object data = AppDomain.CurrentDomain.GetData(key);
        if (data == null)
        {
            return defaultValue;
        }

        return (T)data;
    }

    public static string AppVersion
    {
        get
        {
            var asm = Assembly.GetEntryAssembly();
            if (null == asm) return "N/A";

            var fileVersion = asm.GetCustomAttribute<AssemblyFileVersionAttribute>()?.Version;
            var version = asm.GetCustomAttribute<AssemblyInformationalVersionAttribute>()?.InformationalVersion;
            if (!string.IsNullOrWhiteSpace(version) && version.IndexOf('+') > 0)
            {
                var gitHash = version[(version.IndexOf('+') + 1)..];
                var prefix = version[..version.IndexOf('+')];

                if (gitHash.Length <= 6) return version;

                var gitHashShort = gitHash.Substring(gitHash.Length - 6, 6);
                return !string.IsNullOrWhiteSpace(gitHashShort) ? $"{prefix} ({gitHashShort})" : fileVersion;
            }

            return version ?? fileVersion;
        }
    }

    public static bool IsPrivateIP(string ip) => IPAddress.Parse(ip).GetAddressBytes() switch
    {
        // Regex.IsMatch(ip, @"(^127\.)|(^10\.)|(^172\.1[6-9]\.)|(^172\.2[0-9]\.)|(^172\.3[0-1]\.)|(^192\.168\.)")
        // Regex has bad performance, this is better

        var x when x[0] is 192 && x[1] is 168 => true,
        var x when x[0] is 10 => true,
        var x when x[0] is 127 => true,
        var x when x[0] is 172 && x[1] is >= 16 and <= 31 => true,
        _ => false
    };

    public enum UrlScheme
    {
        Http,
        Https,
        All
    }

    public static bool IsValidUrl(this string url, UrlScheme urlScheme = UrlScheme.All)
    {
        var isValidUrl = Uri.TryCreate(url, UriKind.Absolute, out var uriResult);
        if (!isValidUrl) return false;

        isValidUrl &= urlScheme switch
        {
            UrlScheme.All => uriResult.Scheme == Uri.UriSchemeHttps || uriResult.Scheme == Uri.UriSchemeHttp,
            UrlScheme.Https => uriResult.Scheme == Uri.UriSchemeHttps,
            UrlScheme.Http => uriResult.Scheme == Uri.UriSchemeHttp,
            _ => throw new ArgumentOutOfRangeException(nameof(urlScheme), urlScheme, null),
        };
        return isValidUrl;
    }
}
