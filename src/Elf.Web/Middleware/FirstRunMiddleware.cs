using System;
using System.Data;
using System.Threading.Tasks;
using Elf.Services.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace Elf.Web.Middleware
{
    public class FirstRunMiddleware
    {
        private readonly RequestDelegate _next;

        private const string Token = "FIRSTRUN_INIT_SUCCESS";

        public FirstRunMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext httpContext,
            AppDataConnection dataConnection,
            IHostApplicationLifetime appLifetime,
            ILogger<FirstRunMiddleware> logger)
        {
            var initFlag = AppDomain.CurrentDomain.GetData(Token);
            if (initFlag is not null)
            {
                if ((bool)initFlag)
                {
                    await _next(httpContext);
                    return;
                }
            }

            if (!dataConnection.TestDatabaseConnection(exception =>
            {
                logger?.LogCritical(exception, $"Error {nameof(dataConnection.TestDatabaseConnection)}, connection string: {dataConnection.ConnectionString}");
            }))
            {
                httpContext.Response.StatusCode = StatusCodes.Status500InternalServerError;
                await httpContext.Response.WriteAsync("Database connection failed. Please see error log, fix it and RESTART this application.");
                appLifetime?.StopApplication();
            }
            else
            {
                if (dataConnection.IsFirstRun())
                {
                    try
                    {
                        dataConnection.SetupDatabase();
                    }
                    catch (Exception e)
                    {
                        logger.LogCritical(e, e.Message);
                        httpContext.Response.StatusCode = StatusCodes.Status500InternalServerError;
                        await httpContext.Response.WriteAsync("Error initializing first run, please check error log.");
                        appLifetime?.StopApplication();
                    }
                }

                AppDomain.CurrentDomain.SetData(Token, true);
                await _next(httpContext);
            }
        }
    }
}
