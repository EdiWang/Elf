using System;
using System.Diagnostics.CodeAnalysis;
using Elf.Web;
using NUnit.Framework;

namespace Elf.Tests
{
    [TestFixture]
    [ExcludeFromCodeCoverage]
    public class UtilsTests
    {
        [Test]
        public void AppVersion()
        {
            Assert.IsNotNull(Utils.AppVersion);
        }

        [Test]
        public void IsValidUrl_UnknownSchema()
        {
            Assert.Throws(typeof(ArgumentOutOfRangeException), () =>
            {
                "https://996.icu".IsValidUrl((Utils.UrlScheme)4);
            });
        }

        [TestCase("https://996.icu", ExpectedResult = true)]
        [TestCase("http://996.rip", ExpectedResult = false)]
        public bool IsValidUrl_Https(string str)
        {
            return str.IsValidUrl(Utils.UrlScheme.Https);
        }

        [TestCase("https://996.icu", ExpectedResult = false)]
        [TestCase("http://996.rip", ExpectedResult = true)]
        public bool IsValidUrl_Http(string str)
        {
            return str.IsValidUrl(Utils.UrlScheme.Http);
        }
    }
}
