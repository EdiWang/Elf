using System;
using System.Data;
using System.Data.SqlClient;
using System.Text;
using AspNetCoreRateLimit;
using Elf.Services;
using Elf.Services.TokenGenerator;
using Elf.Setup;
using Elf.Web.Authentication;
using Elf.Web.Extensions;
using Elf.Web.Models;
using Microsoft.ApplicationInsights.Extensibility;
using Microsoft.ApplicationInsights.Extensibility.Implementation;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Rewrite;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace Elf.Web
{
    public class Startup
    {
        private ILogger<Startup> _logger;

        public IWebHostEnvironment Environment { get; }

        public Startup(IConfiguration configuration, IWebHostEnvironment env)
        {
            Configuration = configuration;
            Environment = env;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddRateLimit(Configuration.GetSection("IpRateLimiting"));

            services.AddSession(options =>
            {
                options.IdleTimeout = TimeSpan.FromMinutes(20);
                options.Cookie.HttpOnly = true;
            });

            services.Configure<AppSettings>(Configuration.GetSection(nameof(AppSettings)));

            var authentication = new AuthenticationSettings();
            Configuration.Bind(nameof(Authentication), authentication);
            services.AddElfAuthenticaton(authentication);

            services.AddAntiforgery(options =>
            {
                const string cookieBaseName = "CSRF-TOKEN-LFWDR";
                options.Cookie.Name = $"X-{cookieBaseName}";
                options.FormFieldName = $"{cookieBaseName}-FORM";
            });

            var conn = Configuration.GetConnectionString(Constants.DbName);
            services.AddTransient<IDbConnection>(c => new SqlConnection(conn));
            services.AddSingleton<ITokenGenerator, ShortGuidTokenGenerator>();
            services.AddTransient<ILinkForwarderService, LinkForwarderService>();
            services.AddTransient<ILinkVerifier, LinkVerifier>();

            services.AddApplicationInsightsTelemetry();

            services.AddControllersWithViews();
            services.AddRazorPages();
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, ILogger<Startup> logger, TelemetryConfiguration configuration)
        {
            _logger = logger;
            _logger.LogInformation($"Elf Version {Utils.AppVersion}\n" +
                   "--------------------------------------------------------\n" +
                   $" Directory: {System.Environment.CurrentDirectory} \n" +
                   $" x64Process: {System.Environment.Is64BitProcess} \n" +
                   $" OSVersion: {System.Runtime.InteropServices.RuntimeInformation.OSDescription} \n" +
                   $" UserName: {System.Environment.UserName} \n" +
                   "--------------------------------------------------------");

            if (!env.IsProduction())
            {
                _logger.LogWarning("Application is running under DEBUG mode. Application Insights disabled.");

                configuration.DisableTelemetry = true;
                TelemetryDebugWriter.IsTracingDisabled = true;
            }

            if (env.IsDevelopment())
            {
                _logger.LogWarning("Elf is running in DEBUG.");
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseStatusCodePages();
                app.UseHsts();
                app.UseHttpsRedirection();
            }

            TryAddUrlRewrite(app);

            app.UseStaticFiles();

            var conn = Configuration.GetConnectionString(Constants.DbName);
            var setupHelper = new SetupHelper(conn);

            if (!setupHelper.TestDatabaseConnection(exception =>
            {
                _logger.LogCritical(exception, $"Error {nameof(SetupHelper.TestDatabaseConnection)}, connection string: {conn}");
            }))
            {
                app.Run(async context =>
                {
                    context.Response.StatusCode = StatusCodes.Status500InternalServerError;
                    await context.Response.WriteAsync("Database connection failed. Please see error log, fix it and RESTART this application.");
                });
            }
            else
            {
                if (setupHelper.IsFirstRun())
                {
                    try
                    {
                        setupHelper.SetupDatabase();
                    }
                    catch (Exception e)
                    {
                        _logger.LogCritical(e, e.Message);
                        app.Run(async context =>
                        {
                            context.Response.StatusCode = StatusCodes.Status500InternalServerError;
                            await context.Response.WriteAsync("Error initializing first run, please check error log.");
                        });
                    }
                }

                app.UseIpRateLimiting();

                app.MapWhen(context => context.Request.Path == "/", builder =>
                {
                    builder.Run(async context =>
                    {
                        await context.Response.WriteAsync($"Elf Version: {Utils.AppVersion} | {Environment.EnvironmentName}, .NET Core {System.Environment.Version}", Encoding.UTF8);
                    });
                });

                app.Map("/accessdenied", builder =>
                {
                    builder.Run(async context =>
                    {
                        context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                        await context.Response.WriteAsync("Access Denied");
                    });
                });

                app.UseRouting();

                app.UseAuthentication();
                app.UseAuthorization();

                app.UseEndpoints(endpoints =>
                {
                    endpoints.MapControllerRoute(
                        name: "default",
                        pattern: "{controller=Home}/{action=Index}/{id?}");
                    endpoints.MapRazorPages();
                });
            }
        }

        private void TryAddUrlRewrite(IApplicationBuilder app)
        {
            try
            {
                var options = new RewriteOptions()
                    .AddRedirect("(.*)/$", "$1")
                    .AddRedirect("(index|default).(aspx?|htm|s?html|php|pl|jsp|cfm)", "/");
                app.UseRewriter(options);
            }
            catch (Exception e)
            {
                // URL Rewrite is non-fatal error, continue running the application.
                _logger.LogError(e, nameof(TryAddUrlRewrite));
            }
        }
    }
}
