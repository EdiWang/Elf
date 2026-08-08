using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace Elf.Shared;

public enum LinkVerifyResult
{
    Valid,
    InvalidFormat,
    InvalidLocal,
    InvalidSelfReference
}

public interface ILinkVerifier
{
    LinkVerifyResult Verify(string url, IUrlHelper urlHelper, HttpRequest currentRequest, bool allowSelfRedirection = false);
}

public class LinkVerifier : ILinkVerifier
{
    private static readonly string[] ForwardEndpoints = ["fw", "fw/", "aka", "aka/"];

    public LinkVerifyResult Verify(string url, IUrlHelper urlHelper, HttpRequest currentRequest, bool allowSelfRedirection = false)
    {
        if (string.IsNullOrWhiteSpace(url))
        {
            return LinkVerifyResult.InvalidFormat;
        }

        if (!url.IsValidUrl() || !Uri.TryCreate(url, UriKind.Absolute, out var uri))
        {
            return LinkVerifyResult.InvalidFormat;
        }

        if (urlHelper.IsLocalUrl(url) || IsLocalOrPrivateTarget(uri))
        {
            return LinkVerifyResult.InvalidLocal;
        }

        if (!allowSelfRedirection && IsSelfReference(uri, currentRequest))
        {
            return LinkVerifyResult.InvalidSelfReference;
        }

        return LinkVerifyResult.Valid;
    }

    private static bool IsLocalOrPrivateTarget(Uri uri)
    {
        var host = uri.Host.Trim('[', ']').TrimEnd('.');

        if (string.Equals(host, "localhost", StringComparison.OrdinalIgnoreCase) ||
            host.EndsWith(".localhost", StringComparison.OrdinalIgnoreCase))
        {
            return true;
        }

        return IPAddress.TryParse(host, out var ipAddress) && Utils.IsPrivateIP(ipAddress);
    }

    private static bool IsSelfReference(Uri uri, HttpRequest currentRequest)
    {
        var isSameHost = string.Equals(uri.Authority, currentRequest.Host.ToString(), StringComparison.OrdinalIgnoreCase);
        var isSameScheme = string.Equals(uri.Scheme, currentRequest.Scheme, StringComparison.OrdinalIgnoreCase);

        return isSameHost && isSameScheme && IsForwardEndpoint(uri);
    }

    public static bool IsForwardEndpoint(Uri uri)
    {
        ArgumentNullException.ThrowIfNull(uri);

        if (uri.AbsolutePath == "/" || uri.Segments.Length <= 1)
        {
            return false;
        }

        var firstSegment = uri.Segments[1];
        if (firstSegment == "/")
        {
            return false;
        }

        return ForwardEndpoints.Any(endpoint =>
            string.Equals(firstSegment, endpoint, StringComparison.OrdinalIgnoreCase));
    }
}
