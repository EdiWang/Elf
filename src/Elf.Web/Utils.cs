using System;
using System.Collections.Generic;
using System.Reflection;
using System.Text.RegularExpressions;

namespace Elf.Web
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

        /// <summary>
        /// Get values from `ELF_TAGS` Environment Variable
        /// </summary>
        /// <returns>string values</returns>
        public static IEnumerable<string> GetEnvironmentTags()
        {
            var tagsEnv = Environment.GetEnvironmentVariable("ELF_TAGS");
            if (string.IsNullOrWhiteSpace(tagsEnv))
            {
                yield return string.Empty;
                yield break;
            }

            var tagRegex = new Regex(@"^[a-zA-Z0-9-#@$()\[\]/]+$");
            var tags = tagsEnv.Split(',');
            foreach (string tag in tags)
            {
                var t = tag.Trim();
                if (tagRegex.IsMatch(t))
                {
                    yield return t;
                }
            }
        }
    }
}