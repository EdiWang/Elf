using System.Net;
using System.Net.Sockets;

namespace Elf.Shared;

public static class Utils
{
    public static bool IsPrivateIP(string ip) =>
        IPAddress.TryParse(ip, out var ipAddress) && IsPrivateIP(ipAddress);

    public static bool IsPrivateIP(IPAddress ipAddress)
    {
        ArgumentNullException.ThrowIfNull(ipAddress);

        if (ipAddress.IsIPv4MappedToIPv6)
        {
            ipAddress = ipAddress.MapToIPv4();
        }

        return ipAddress.AddressFamily switch
        {
            AddressFamily.InterNetwork => IsPrivateIPv4(ipAddress.GetAddressBytes()),
            AddressFamily.InterNetworkV6 => IsPrivateIPv6(ipAddress.GetAddressBytes()),
            _ => false
        };
    }

    private static bool IsPrivateIPv4(byte[] bytes) =>
        IPAddress.IsLoopback(new IPAddress(bytes)) ||
        bytes[0] == 0 ||
        bytes[0] == 10 ||
        bytes[0] == 100 && bytes[1] is >= 64 and <= 127 ||
        bytes[0] == 169 && bytes[1] == 254 ||
        bytes[0] == 172 && bytes[1] is >= 16 and <= 31 ||
        bytes[0] == 192 && bytes[1] == 168 ||
        bytes[0] == 198 && bytes[1] is 18 or 19 ||
        bytes[0] >= 224;

    private static bool IsPrivateIPv6(byte[] bytes) =>
        bytes.All(b => b == 0) ||
        IPAddress.IsLoopback(new IPAddress(bytes)) ||
        bytes[0] == 0xff ||
        bytes[0] is 0xfc or 0xfd ||
        bytes[0] == 0xfe && bytes[1] is >= 0x80 and <= 0xbf;

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
