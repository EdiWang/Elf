using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.VisualBasic.CompilerServices;
using NLog.Web;

namespace LinkForwarder.Web
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
            var isProd = environment == EnvironmentName.Production;
            var logger = NLogBuilder.ConfigureNLog(isProd ? "nlog.config" : "nlog.debug.config").GetCurrentClassLogger();
            try
            {
                logger.Info($"LinkForwarder Version {Utils.AppVersion}\n" +
                            "--------------------------------------------------------\n" +
                            $" Directory: {Environment.CurrentDirectory} \n" +
                            $" x64Process: {Environment.Is64BitProcess} \n" +
                            $" OSVersion: {System.Runtime.InteropServices.RuntimeInformation.OSDescription} \n" +
                            $" UserName: {Environment.UserName} \n" +
                            "--------------------------------------------------------");
                CreateWebHostBuilder(args).Build().Run();
            }
            catch (Exception ex)
            {
                logger.Error(ex, "Error starting LinkForwarder :(");
                throw;
            }
            finally
            {
                NLog.LogManager.Shutdown();
            }
        }

        public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
                .CaptureStartupErrors(true)
                .ConfigureKestrel(c => c.AddServerHeader = false)
                .UseIISIntegration()
                .UseStartup<Startup>()
                .ConfigureLogging(logging =>
                {
                    logging.ClearProviders();
                    logging.SetMinimumLevel(LogLevel.Trace);
                }).UseNLog();
    }
}
