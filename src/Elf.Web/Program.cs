using System;
using System.Diagnostics;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace Elf.Web
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var info = $"Elf Version {Utils.AppVersion}\n" +
                       $"Directory: {Environment.CurrentDirectory} \n" +
                       $"OS: {Environment.OSVersion.VersionString} \n" +
                       $"Machine Name: {Environment.MachineName} \n" +
                       $"User Name: {Environment.UserName}";
            Trace.WriteLine(info);
            Console.WriteLine(info);

            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.CaptureStartupErrors(true)
                              .ConfigureKestrel(c => c.AddServerHeader = false)
                              .UseStartup<Startup>()
                              .ConfigureLogging(logging =>
                              {
                                  logging.AddAzureWebAppDiagnostics();
                              })
                              .ConfigureAppConfiguration((hostingContext, config) => {
                                  var settings = config.Build();
                                  if (bool.Parse(settings["AppSettings:PreferAzureAppConfiguration"]))
                                  {
                                      config.AddAzureAppConfiguration(options => {
                                          options.Connect(settings["ConnectionStrings:AzureAppConfig"])
                                                 .UseFeatureFlags();
                                      });
                                  }
                              });
                });
    }
}
