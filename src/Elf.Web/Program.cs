using System;
using System.Diagnostics;
using Elf.Services.Entities;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
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

            var host = CreateHostBuilder(args).Build();

            using (var scope = host.Services.CreateScope())
            {
                var services = scope.ServiceProvider;
                var loggerFactory = services.GetRequiredService<ILoggerFactory>();
                var logger = loggerFactory.CreateLogger<Program>();

                try
                {
                    var dbConnection = services.GetRequiredService<AppDataConnection>();
                    TryInitFirstRun(dbConnection, logger);
                }
                catch (Exception ex)
                {
                    logger.LogError(ex, "Moonglade start up boom boom");
                }
            }

            host.Run();
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
                              .ConfigureAppConfiguration((hostingContext, config) =>
                              {
                                  var settings = config.Build();
                                  if (bool.Parse(settings["AppSettings:PreferAzureAppConfiguration"]))
                                  {
                                      config.AddAzureAppConfiguration(options =>
                                      {
                                          options.Connect(settings["ConnectionStrings:AzureAppConfig"])
                                              .ConfigureRefresh(refresh =>
                                              {
                                                  refresh.Register("Elf:Settings:Sentinel", refreshAll: true)
                                                      .SetCacheExpiration(TimeSpan.FromSeconds(10));
                                              })
                                              .UseFeatureFlags(o => o.Label = "Elf");
                                      });
                                  }
                              });
                });

        private static void TryInitFirstRun(AppDataConnection dbConnection, ILogger logger)
        {
            if (dbConnection.TestDatabaseConnection(ex =>
            {
                Trace.WriteLine(ex);
                Console.WriteLine(ex);
            }))
            {
                if (dbConnection.IsFirstRun())
                {
                    try
                    {
                        logger.LogInformation("Initializing first run configuration...");
                        dbConnection.SetupDatabase();
                        logger.LogInformation("Database setup successfully.");
                    }
                    catch (Exception e)
                    {
                        logger.LogCritical(e, e.Message);
                    }
                }
            }
        }
    }
}
