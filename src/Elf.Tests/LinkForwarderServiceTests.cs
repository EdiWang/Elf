using System.Diagnostics.CodeAnalysis;
using Elf.Services;
using Elf.Services.Entities;
using Elf.Services.TokenGenerator;
using Microsoft.Extensions.Logging;
using Moq;
using NUnit.Framework;

namespace Elf.Tests
{
    [TestFixture]
    [ExcludeFromCodeCoverage]
    public class LinkForwarderServiceTests
    {
        private MockRepository mockRepository;

        private Mock<ILogger<LinkForwarderService>> mockLogger;
        private Mock<ITokenGenerator> mockTokenGenerator;
        private Mock<AppDataConnection> mockDbConnection;

        [SetUp]
        public void SetUp()
        {
            this.mockRepository = new MockRepository(MockBehavior.Default);

            this.mockLogger = mockRepository.Create<ILogger<LinkForwarderService>>();
            this.mockTokenGenerator = mockRepository.Create<ITokenGenerator>();
            this.mockDbConnection = mockRepository.Create<AppDataConnection>();
        }

        private LinkForwarderService CreateService()
        {
            return new LinkForwarderService(
                mockLogger.Object,
                mockTokenGenerator.Object,
                mockDbConnection.Object);
        }

        //[Test]
        //public async Task IsLinkExistsAsync_EmptyToken()
        //{
        //    var service = CreateService();
        //    var result = await service.IsLinkExistsAsync(string.Empty);
        //    Assert.AreEqual(result, false);
        //}

        //[Test]
        //public async Task IsLinkExistsAsync_Yes()
        //{
        //    mockDbConnection.SetupDapperAsync(c => c.ExecuteScalarAsync<object>(It.IsAny<string>(), It.IsAny<object>(), null, null, null))
        //                    .ReturnsAsync(1);

        //    var service = CreateService();
        //    var result = await service.IsLinkExistsAsync("996");

        //    Assert.AreEqual(result, true);
        //}

        //[Test]
        //public async Task IsLinkExistsAsync_No()
        //{
        //    mockDbConnection.SetupDapperAsync(c => c.ExecuteScalarAsync<object>(It.IsAny<string>(), It.IsAny<object>(), null, null, null))
        //                    .ReturnsAsync(0);

        //    var service = CreateService();
        //    var result = await service.IsLinkExistsAsync("996");

        //    Assert.AreEqual(result, false);
        //}

        //[TestCase(0)]
        //[TestCase(-1)]
        //public void GetPagedLinksAsync_Invalid_PageSize(int pageSize)
        //{
        //    var service = CreateService();

        //    Assert.ThrowsAsync<ArgumentOutOfRangeException>(async () =>
        //    {
        //        await service.GetPagedLinksAsync(0, pageSize);
        //    });
        //}

        //[Test]
        //public void GetPagedLinksAsync_Invalid_Offset()
        //{
        //    var service = CreateService();

        //    Assert.ThrowsAsync<ArgumentOutOfRangeException>(async () =>
        //    {
        //        await service.GetPagedLinksAsync(-1, 10);
        //    });
        //}

        //[Test]
        //public async Task GetPagedLinksAsync_Happy()
        //{
        //    var links = new List<Link>
        //    {
        //        new Link
        //        {
        //            AkaName = "007", FwToken = "251", Id = 404,
        //            IsEnabled = true, Note = "35", OriginUrl = "https://996.icu",
        //            TTL = 3500, UpdateTimeUtc = DateTime.UtcNow
        //        }
        //    };

        //    mockDbConnection.SetupDapperAsync(c => c.QueryAsync<Link>(It.IsAny<string>(), It.IsAny<object>(), null, null, null))
        //                    .ReturnsAsync(links);

        //    var service = CreateService();
        //    var result = await service.GetPagedLinksAsync(0, 10);

        //    Assert.IsNotNull(result.Links);
        //}

        //[Test]
        //public async Task GetRecentRequests_OK()
        //{
        //    mockDbConnection.SetupDapperAsync(c => c.QueryAsync<RequestTrack>(It.IsAny<string>(), It.IsAny<object>(), null, null, null))
        //                    .ReturnsAsync(new List<RequestTrack>());

        //    var service = CreateService();
        //    var result = await service.GetRecentRequests(996);

        //    Assert.IsNotNull(result);
        //}

        //[Test]
        //public async Task ClearTrackingDataAsync_OK()
        //{
        //    mockDbConnection.SetupDapperAsync(c => c.ExecuteAsync(It.IsAny<string>(), null, null, null, null));

        //    var service = CreateService();
        //    await service.ClearTrackingDataAsync();

        //    mockDbConnection.Verify();
        //}
    }
}
