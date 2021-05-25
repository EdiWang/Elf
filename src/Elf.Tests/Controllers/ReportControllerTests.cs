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
        private MockRepository _mockRepository;

        private Mock<IOptions<AppSettings>> _mockOptions;
        private Mock<ILinkForwarderService> _mockLinkForwarderService;

        [SetUp]
        public void SetUp()
        {
            _mockRepository = new(MockBehavior.Default);

            _mockOptions = _mockRepository.Create<IOptions<AppSettings>>();
            _mockLinkForwarderService = _mockRepository.Create<ILinkForwarderService>();
        }

        private ReportController CreateReportController()
        {
            _mockOptions.Setup(p => p.Value).Returns(new AppSettings { TopClientTypes = 251 });

            return new(
                _mockOptions.Object,
                _mockLinkForwarderService.Object);
        }

        [Test]
        public async Task RecentRequests_OK()
        {
            var reportController = CreateReportController();

            IReadOnlyList<RequestTrack> list = new List<RequestTrack>()
            {
               new()
               {
                   FwToken = "996",
                   IpAddress = "007",
                   Note = "251",
                   RequestTimeUtc = new(2000, 1, 1),
                   UserAgent = "404"
               }
            };
            _mockLinkForwarderService.Setup(p => p.GetRecentRequests(It.IsAny<int>()))
                .Returns(Task.FromResult(list));

            var result = await reportController.RecentRequests();
            Assert.IsInstanceOf<OkObjectResult>(result);
            Assert.IsNotNull((result as OkObjectResult).Value);

            _mockRepository.VerifyAll();
        }

        [Test]
        public async Task MostRequestedLinksPastMonth_OK()
        {
            var reportController = CreateReportController();

            IReadOnlyList<MostRequestedLinkCount> list = new List<MostRequestedLinkCount>()
            {
               new()
               {
                   FwToken = "996",
                   Note = "251",
                   RequestCount = 404
               }
            };

            _mockLinkForwarderService.Setup(p => p.GetMostRequestedLinkCount(It.IsAny<int>()))
               .Returns(Task.FromResult(list));

            var result = await reportController.MostRequestedLinksPastMonth();
            Assert.IsInstanceOf<OkObjectResult>(result);
            Assert.IsNotNull((result as OkObjectResult).Value);

            _mockRepository.VerifyAll();
        }

        [Test]
        public async Task ClientTypePastMonth_OK()
        {
            var reportController = CreateReportController();

            IReadOnlyList<ClientTypeCount> list = new List<ClientTypeCount>()
            {
               new()
               {
                   ClientTypeName = "ICU",
                   Count = 996
               }
            };

            _mockLinkForwarderService.Setup(p => p.GetClientTypeCounts(It.IsAny<int>(), It.IsAny<int>()))
               .Returns(Task.FromResult(list));

            var result = await reportController.ClientTypePastMonth();
            Assert.IsInstanceOf<OkObjectResult>(result);
            Assert.IsNotNull((result as OkObjectResult).Value);

            _mockRepository.VerifyAll();
        }

        [Test]
        public async Task TrackingCountPastWeek_OK()
        {
            var reportController = CreateReportController();

            IReadOnlyList<LinkTrackingDateCount> list = new List<LinkTrackingDateCount>()
            {
               new()
               {
                   RequestCount = 996,
                   TrackingDateUtc = DateTime.Now
               }
            };

            _mockLinkForwarderService.Setup(p => p.GetLinkTrackingDateCount(It.IsAny<int>()))
               .Returns(Task.FromResult(list));

            var result = await reportController.TrackingCountPastWeek();
            Assert.IsInstanceOf<OkObjectResult>(result);
            Assert.IsNotNull((result as OkObjectResult).Value);

            this._mockRepository.VerifyAll();
        }

        [Test]
        public async Task ClearTrackingData_OK()
        {
            var reportController = CreateReportController();

            _mockLinkForwarderService.Setup(p => p.ClearTrackingDataAsync());

            var result = await reportController.ClearTrackingData();
            Assert.IsInstanceOf<OkResult>(result);

            this._mockRepository.VerifyAll();
        }
    }
}
