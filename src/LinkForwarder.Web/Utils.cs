using System;
using System.Reflection;

namespace LinkForwarder.Web
{
    public static class Utils
    {
        public static string AppVersion =>
            Assembly.GetEntryAssembly().GetCustomAttribute<AssemblyInformationalVersionAttribute>()
                .InformationalVersion;

        public enum UrlScheme
        {
            Http,
            Https,
            All
        }

        public static bool IsValidUrl(this string url, UrlScheme urlScheme = UrlScheme.All)
        {
            bool isValidUrl = Uri.TryCreate(url, UriKind.Absolute, out var uriResult);
            if (!isValidUrl)
            {
                return false;
            }

            switch (urlScheme)
            {
                case UrlScheme.All:
                    isValidUrl &= uriResult.Scheme == Uri.UriSchemeHttps || uriResult.Scheme == Uri.UriSchemeHttp;
                    break;
                case UrlScheme.Https:
                    isValidUrl &= uriResult.Scheme == Uri.UriSchemeHttps;
                    break;
                case UrlScheme.Http:
                    isValidUrl &= uriResult.Scheme == Uri.UriSchemeHttp;
                    break;
            }

            return isValidUrl;
        }
    }
}