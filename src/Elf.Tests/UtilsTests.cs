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
        public void TestAppVersion()
        {
            Assert.IsNotNull(Utils.AppVersion);
        }

        [Test]
        public void TestIsValidUrlUnknownSchema()
        {
            Assert.Throws(typeof(ArgumentOutOfRangeException), () =>
            {
                "https://996.icu".IsValidUrl((Utils.UrlScheme)4);
            });
        }

        [TestCase("https://996.icu", ExpectedResult = true)]
        [TestCase("http://996.rip", ExpectedResult = false)]
        public bool TestIsValidUrlHttps(string str)
        {
            return str.IsValidUrl(Utils.UrlScheme.Https);
        }

        [TestCase("https://996.icu", ExpectedResult = false)]
        [TestCase("http://996.rip", ExpectedResult = true)]
        public bool TestIsValidUrlHttp(string str)
        {
            return str.IsValidUrl(Utils.UrlScheme.Http);
        }
    }
}
