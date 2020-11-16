using System;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
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

        [TestCase("")]
        [TestCase("DC1")]
        [TestCase("DC1,DC2")]
        [TestCase("DC1, DC2")]
        [TestCase("DC1, DC2,DC3")]
        [TestCase("DC[1], DC-2, DC#3, DC@4, DC$5, DC(6), DC/7")]
        public void GetEnvironmentTags_Valid(string tags)
        {
            Environment.SetEnvironmentVariable("ELF_TAGS", tags, EnvironmentVariableTarget.Process);
            var envTags = Utils.GetEnvironmentTags();
            Assert.IsNotNull(envTags);

            var list = tags.Split(',').Select(p => p.Trim());
            foreach (var tag in list)
            {
                Assert.IsTrue(envTags.Contains(tag));
            }
        }

        [TestCase("DC%1")]
        [TestCase("DC 1")]
        [TestCase("DC*1")]
        [TestCase("DC^1")]
        [TestCase("DC^1")]
        [TestCase("DC+1")]
        [TestCase("DC=1")]
        [TestCase("DC!1")]
        [TestCase("DC`1")]
        [TestCase("DC~1")]
        [TestCase("DC'1")]
        [TestCase("DC?1")]
        [TestCase("DC{1}")]
        public void GetEnvironmentTags_Invalid(string invalidTag)
        {
            Environment.SetEnvironmentVariable("ELF_TAGS", $"DC1, DC2, {invalidTag}", EnvironmentVariableTarget.Process);
            var envTags = Utils.GetEnvironmentTags();
            Assert.IsNotNull(envTags);

            Assert.IsTrue(envTags.Count() == 2);
            Assert.IsTrue(!envTags.Contains(invalidTag));
        }

        [Test]
        public void GetEnvironmentTags_Empty()
        {
            Environment.SetEnvironmentVariable("ELF_TAGS", string.Empty, EnvironmentVariableTarget.Process);
            var envTags = Utils.GetEnvironmentTags();
            Assert.IsNotNull(envTags);

            Assert.IsTrue(envTags.Count() == 1);
            Assert.AreEqual(envTags.First(), string.Empty);
        }
    }
}
