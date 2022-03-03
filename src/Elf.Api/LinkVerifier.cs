using Microsoft.AspNetCore.Mvc;

namespace Elf.Api;

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
    public LinkVerifyResult Verify(string url, IUrlHelper urlHelper, HttpRequest currentRequest, bool allowSelfRedirection = false)
    {
        if (!url.IsValidUrl())
        {
            return LinkVerifyResult.InvalidFormat;
        }

        if (urlHelper.IsLocalUrl(url))
        {
            return LinkVerifyResult.InvalidLocal;
        }

        if (!allowSelfRedirection && Uri.TryCreate(url, UriKind.Absolute, out var testUri))
        {
            if (string.Compare(testUri.Authority, currentRequest.Host.ToString(), StringComparison.OrdinalIgnoreCase) == 0
                && string.Compare(testUri.Scheme, currentRequest.Scheme, StringComparison.OrdinalIgnoreCase) == 0
                && IsForwardEndpoint(testUri))
            {
                return LinkVerifyResult.InvalidSelfReference;
            }
        }

        return LinkVerifyResult.Valid;
    }

    // Check only for Forward endpoints (fw, aka) as suggested in #10
    public bool IsForwardEndpoint(Uri uri)
    {
        var endpoints = new[] { "fw", "fw/", "aka", "aka/" };

        if (uri.AbsolutePath != "/" && uri.Segments.Length > 1)
        {

            for (var i = 1; i < uri.Segments.Length; i++)
            {
                if (uri.Segments[i] == "/") continue;

                if (endpoints.Any(endpoint =>
                    string.Compare(uri.Segments[i], endpoint, StringComparison.OrdinalIgnoreCase) == 0))
                {
                    return true;
                }
                break;
            }
        }

        return false;
    }
}