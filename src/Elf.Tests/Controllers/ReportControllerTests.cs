using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Threading.Tasks;
using Elf.Services;
using Elf.Services.Models;
using Elf.Web.Controllers;
using Elf.Web.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Moq;
using NUnit.Framework;

namespace Elf.Tests.Controllers
{
    [TestFixture]
    [ExcludeFromCodeCoverage]
    public class ReportControllerTests
    {
        private MockRepository mockRepository;

        private Mock<IOptions<AppSettings>> mockOptions;
        private Mock<ILinkForwarderService> mockLinkForwarderService;

        [SetUp]
        public void SetUp()
        {
            mockRepository = new MockRepository(MockBehavior.Default);

            mockOptions = mockRepository.Create<IOptions<AppSettings>>();
            mockLinkForwarderService = mockRepository.Create<ILinkForwarderService>();
        }

        private ReportController CreateReportController()
        {
            mockOptions.Setup(p => p.Value).Returns(new AppSettings { TopClientTypes = 251 });

            return new ReportController(
                mockOptions.Object,
                mockLinkForwarderService.Object);
        }

        [Test]
        public async Task RecentRequests_OK()
        {
            var reportController = CreateReportController();

            IReadOnlyList<RequestTrack> list = new List<RequestTrack>()
            {
               new RequestTrack
               {
                   FwToken = "996",
                   IpAddress = "007",
                   Note = "251",
                   RequestTimeUtc = new DateTime(2000, 1, 1),
                   UserAgent = "404"
               }
            };
            mockLinkForwarderService.Setup(p => p.GetRecentRequests(It.IsAny<int>()))
                .Returns(Task.FromResult(list));

            var result = await reportController.RecentRequests();
            Assert.IsInstanceOf<OkObjectResult>(result);
            Assert.IsNotNull((result as OkObjectResult).Value);

            mockRepository.VerifyAll();
        }

        [Test]
        public async Task MostRequestedLinksPastMonth_OK()
        {
            var reportController = CreateReportController();

            IReadOnlyList<MostRequestedLinkCount> list = new List<MostRequestedLinkCount>()
            {
               new MostRequestedLinkCount
               {
                   FwToken = "996",
                   Note = "251",
                   RequestCount = 404
               }
            };

            mockLinkForwarderService.Setup(p => p.GetMostRequestedLinkCount(It.IsAny<int>()))
               .Returns(Task.FromResult(list));

            var result = await reportController.MostRequestedLinksPastMonth();
            Assert.IsInstanceOf<OkObjectResult>(result);
            Assert.IsNotNull((result as OkObjectResult).Value);

            mockRepository.VerifyAll();
        }

        [Test]
        public async Task ClientTypePastMonth_OK()
        {
            var reportController = CreateReportController();

            IReadOnlyList<ClientTypeCount> list = new List<ClientTypeCount>()
            {
               new ClientTypeCount
               {
                   ClientTypeName = "ICU",
                   Count = 996
               }
            };

            mockLinkForwarderService.Setup(p => p.GetClientTypeCounts(It.IsAny<int>(), It.IsAny<int>()))
               .Returns(Task.FromResult(list));

            var result = await reportController.ClientTypePastMonth();
            Assert.IsInstanceOf<OkObjectResult>(result);
            Assert.IsNotNull((result as OkObjectResult).Value);

            mockRepository.VerifyAll();
        }

        [Test]
        public async Task TrackingCountPastWeek_OK()
        {
            var reportController = CreateReportController();

            IReadOnlyList<LinkTrackingDateCount> list = new List<LinkTrackingDateCount>()
            {
               new LinkTrackingDateCount
               {
                   RequestCount = 996,
                   TrackingDateUtc = DateTime.Now
               }
            };

            mockLinkForwarderService.Setup(p => p.GetLinkTrackingDateCount(It.IsAny<int>()))
               .Returns(Task.FromResult(list));

            var result = await reportController.TrackingCountPastWeek();
            Assert.IsInstanceOf<OkObjectResult>(result);
            Assert.IsNotNull((result as OkObjectResult).Value);

            this.mockRepository.VerifyAll();
        }

        [Test]
        public async Task ClearTrackingData_OK()
        {
            var reportController = CreateReportController();

            mockLinkForwarderService.Setup(p => p.ClearTrackingDataAsync());

            var result = await reportController.ClearTrackingData();
            Assert.IsInstanceOf<OkResult>(result);

            this.mockRepository.VerifyAll();
        }
    }
}
