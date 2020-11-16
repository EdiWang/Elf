using Elf.Setup;
using Moq;
using NUnit.Framework;
using System;
using System.Data;
using System.Diagnostics.CodeAnalysis;
using Dapper;
using Moq.Dapper;
using Microsoft.Data.SqlClient;

namespace Elf.Tests
{
    [TestFixture]
    [ExcludeFromCodeCoverage]
    public class SetupHelperTests
    {
        private MockRepository mockRepository;

        private Mock<IDbConnection> mockDbConnection;

        [SetUp]
        public void SetUp()
        {
            mockRepository = new MockRepository(MockBehavior.Default);
            mockDbConnection = mockRepository.Create<IDbConnection>();
        }

        [Test]
        public void IsFirstRun_Yes()
        {
            mockDbConnection.SetupDapper(c => c.ExecuteScalar<int>(It.IsAny<string>(), null, null, null, null)).Returns(0);
            var setupHelper = new SetupHelper(mockDbConnection.Object);

            var result = setupHelper.IsFirstRun();
            Assert.IsTrue(result);
        }

        [Test]
        public void IsFirstRun_No()
        {
            mockDbConnection.SetupDapper(c => c.ExecuteScalar<int>(It.IsAny<string>(), null, null, null, null)).Returns(1);
            var setupHelper = new SetupHelper(mockDbConnection.Object);

            var result = setupHelper.IsFirstRun();
            Assert.IsFalse(result);
        }

        [Test]
        public void SetupDatabase_OK()
        {
            mockDbConnection.SetupDapper(c => c.Execute(It.IsAny<string>(), null, null, null, null)).Returns(996);
            var setupHelper = new SetupHelper(mockDbConnection.Object);

            Assert.DoesNotThrow(() =>
            {
                setupHelper.SetupDatabase();
            });
        }

        [Test]
        public void TestDatabaseConnection_OK()
        {
            mockDbConnection.SetupDapper(c => c.ExecuteScalar<int>(It.IsAny<string>(), null, null, null, null)).Returns(1);
            var setupHelper = new SetupHelper(mockDbConnection.Object);

            var result = setupHelper.TestDatabaseConnection();
            Assert.IsTrue(result);
        }

        [Test]
        public void TestDatabaseConnection_Fail_NoLog()
        {
            mockDbConnection.SetupDapper(c => c.ExecuteScalar<int>(It.IsAny<string>(), null, null, null, null)).Throws(new Exception("996"));
            var setupHelper = new SetupHelper(mockDbConnection.Object);

            var result = setupHelper.TestDatabaseConnection();
            Assert.IsFalse(result);
        }

        [Test]
        public void TestDatabaseConnection_Fail_Log()
        {
            mockDbConnection.SetupDapper(c => c.ExecuteScalar<int>(It.IsAny<string>(), null, null, null, null)).Throws(new Exception("996"));
            var setupHelper = new SetupHelper(mockDbConnection.Object);

            var result = setupHelper.TestDatabaseConnection(e =>
            {
                Console.WriteLine(e.Message);
            });

            Assert.IsFalse(result);
        }
    }
}
