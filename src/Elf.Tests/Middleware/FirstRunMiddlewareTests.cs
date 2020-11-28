﻿using System;
using System.Data;
using System.Diagnostics.CodeAnalysis;
using System.Threading.Tasks;
using Elf.Web.Middleware;
using Microsoft.AspNetCore.Http;
using Moq;
using NUnit.Framework;

namespace Elf.Tests.Middleware
{
    [TestFixture]
    [ExcludeFromCodeCoverage]
    public class FirstRunMiddlewareTests
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
        public async Task FirstRun_HasToken()
        {
            var ctx = new DefaultHttpContext();
            AppDomain.CurrentDomain.SetData("FIRSTRUN_INIT_SUCCESS", true);

            static Task RequestDelegate(HttpContext context) => Task.CompletedTask;
            var middleware = new FirstRunMiddleware(RequestDelegate);
            await middleware.Invoke(ctx, null, null, null);

            Assert.Pass();
        }

        //[Test]
        //public async Task FirstRun_DbConnection_Fail_NullLogger()
        //{
        //    var ctx = new DefaultHttpContext();
        //    mockDbConnection.SetupDapper(c => c.ExecuteScalar<int>(It.IsAny<string>(), null, null, null, null)).Throws(new Exception("996"));

        //    static Task RequestDelegate(HttpContext context) => Task.CompletedTask;
        //    var middleware = new FirstRunMiddleware(RequestDelegate);
        //    await middleware.Invoke(ctx, mockDbConnection.Object, null, null);

        //    Assert.AreEqual(ctx.Response.StatusCode, 500);
        //}
    }
}
