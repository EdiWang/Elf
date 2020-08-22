using System;
using System.Collections.Generic;
using System.Text;
using Elf.Web;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using NUnit.Framework;

namespace Elf.Tests
{
    [TestFixture]
    public class LinkVerifierTest
    {
        private readonly LinkVerifier _linkVerifier = new LinkVerifier();

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

        [Test]
        public void TestVerifyInvalidFormat()
        {
            var urlHelperMock = new Mock<IUrlHelper>();
            var result = _linkVerifier.Verify("996", urlHelperMock.Object, null);
            Assert.AreEqual(LinkVerifyResult.InvalidFormat, result);
        }

        [Test]
        public void TestVerifyInvalidLocal()
        {
            var urlHelperMock = new Mock<IUrlHelper>();
            urlHelperMock.Setup(p => p.IsLocalUrl(It.IsAny<string>())).Returns(true);

            var result = _linkVerifier.Verify("https://localhost/996", urlHelperMock.Object, null);
            Assert.AreEqual(LinkVerifyResult.InvalidLocal, result);
        }

        [Test]
        public void TestSelfReferenceNoForwardEndpoint()
        {
            var urlHelperMock = new Mock<IUrlHelper>();
            urlHelperMock.Setup(p => p.IsLocalUrl(It.IsAny<string>())).Returns(false);

            var reqMock = new Mock<HttpRequest>();
            reqMock.SetupGet(r => r.Host).Returns(new HostString("edi.wang"));
            reqMock.SetupGet(r => r.Scheme).Returns("https");

            var result = _linkVerifier.Verify("https://edi.wang/1055", urlHelperMock.Object, reqMock.Object);
            Assert.AreEqual(LinkVerifyResult.Valid, result);
        }

        [Test]
        public void TestSelfReferenceForwardEndpoint()
        {
            var urlHelperMock = new Mock<IUrlHelper>();
            urlHelperMock.Setup(p => p.IsLocalUrl(It.IsAny<string>())).Returns(false);

            var reqMock = new Mock<HttpRequest>();
            reqMock.SetupGet(r => r.Host).Returns(new HostString("go.edi.wang"));
            reqMock.SetupGet(r => r.Scheme).Returns("https");

            var result = _linkVerifier.Verify("https://go.edi.wang/fw/1055", urlHelperMock.Object, reqMock.Object);
            Assert.AreEqual(LinkVerifyResult.InvalidSelfReference, result);
        }
    }
}
