using System;
using System.Collections.Generic;
using System.Text;
using Elf.Web;
using NUnit.Framework;

namespace Elf.Tests
{
    [TestFixture]
    public class LinkVerifierTest
    {
        private LinkVerifier _linkVerifier = new LinkVerifier();

        [TestCase("https://go.edi.wang", ExpectedResult = false)]
        [TestCase("https://go.edi.wang/", ExpectedResult = false)]
        [TestCase("https://go.edi.wang///", ExpectedResult = false)]
        [TestCase("https://go.edi.wang/a", ExpectedResult = false)]
        [TestCase("https://go.edi.wang/a/", ExpectedResult = false)]
        [TestCase("https://go.edi.wang//a/", ExpectedResult = false)]
        [TestCase("https://go.edi.wang//a//aka", ExpectedResult = false)]
        [TestCase("https://go.edi.wang/a//fw", ExpectedResult = false)]
        [TestCase("https://go.edi.wang/a/fw/b", ExpectedResult = false)]
        [TestCase("https://go.edi.wang/aka/b", ExpectedResult = true)]
        [TestCase("https://go.edi.wang/fw/c", ExpectedResult = true)]
        [TestCase("https://go.edi.wang///fw/c", ExpectedResult = true)]
        [TestCase("https://go.edi.wang//fw/", ExpectedResult = true)]
        [TestCase("https://go.edi.wang//fw", ExpectedResult = true)]
        [TestCase("https://go.edi.wang/fw", ExpectedResult = true)]
        [TestCase("https://go.edi.wang/aka", ExpectedResult = true)]
        public bool TestIsForwardEndpoint(string url)
        {
            return _linkVerifier.IsForwardEndpoint(new Uri(url));
        }
    }
}
