using System;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Elf.Web
{
    public enum LinkVerifyResult
    {
        Valid,
        InvalidFormat,
        InvalidLocal,
        InvalidSelfReference
    }

    public interface ILinkVerifier
    {
        LinkVerifyResult Verify(string url, IUrlHelper urlHelper, HttpRequest currentRequest);
    }

    public class LinkVerifier : ILinkVerifier
    {
        public LinkVerifyResult Verify(string url, IUrlHelper urlHelper, HttpRequest currentRequest)
        {
            if (!url.IsValidUrl())
            {
                return LinkVerifyResult.InvalidFormat;
            }

            if (urlHelper.IsLocalUrl(url))
            {
                return LinkVerifyResult.InvalidLocal;
            }

            if (Uri.TryCreate(url, UriKind.Absolute, out var testUri))
            {
                if (string.Compare(testUri.Authority, currentRequest.Host.ToString(), StringComparison.OrdinalIgnoreCase) == 0
                    && string.Compare(testUri.Scheme, currentRequest.Scheme, StringComparison.OrdinalIgnoreCase) == 0
                    && testUri.AbsolutePath != "/")
                {
                    return LinkVerifyResult.InvalidSelfReference;
                }
            }

            return LinkVerifyResult.Valid;
        }
    }
}
