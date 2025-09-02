using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

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
        // Early validation for null or empty URL
        if (string.IsNullOrWhiteSpace(url))
        {
            return LinkVerifyResult.InvalidFormat;
        }

        if (!url.IsValidUrl())
        {
            return LinkVerifyResult.InvalidFormat;
        }

        if (urlHelper.IsLocalUrl(url))
        {
            return LinkVerifyResult.InvalidLocal;
        }

        if (!allowSelfRedirection && IsSelfReference(url, currentRequest))
        {
            return LinkVerifyResult.InvalidSelfReference;
        }

        return LinkVerifyResult.Valid;
    }

    private static bool IsSelfReference(string url, HttpRequest currentRequest)
    {
        if (!Uri.TryCreate(url, UriKind.Absolute, out var uri))
        {
            return false;
        }

        var isSameHost = string.Equals(uri.Authority, currentRequest.Host.ToString(), StringComparison.OrdinalIgnoreCase);
        var isSameScheme = string.Equals(uri.Scheme, currentRequest.Scheme, StringComparison.OrdinalIgnoreCase);

        return isSameHost && isSameScheme && IsForwardEndpoint(uri);
    }

    /// <summary>
    /// Checks if the URI points to a forward endpoint (fw, aka) as suggested in issue #10
    /// </summary>
    /// <param name="uri">The URI to check</param>
    /// <returns>True if the URI is a forward endpoint, false otherwise</returns>
    public static bool IsForwardEndpoint(Uri uri)
    {
        ArgumentNullException.ThrowIfNull(uri);

        if (uri.AbsolutePath == "/" || uri.Segments.Length <= 1)
        {
            return false;
        }

        // Check the first non-root segment for forward endpoints
        var firstSegment = uri.Segments[1];
        if (firstSegment == "/")
        {
            return false;
        }

        return ForwardEndpoints.Any(endpoint =>
            string.Equals(firstSegment, endpoint, StringComparison.OrdinalIgnoreCase));
    }
}