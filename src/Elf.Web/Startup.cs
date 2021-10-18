using AspNetCoreRateLimit;
using Elf.MultiTenancy;
using Elf.Services;
using Elf.Services.Entities;
using Elf.Services.TokenGenerator;
using Elf.Web.Authentication;
using Elf.Web.Middleware;
using Elf.Web.Models;
using LinqToDB.AspNet;
using LinqToDB.AspNet.Logging;
using LinqToDB.Configuration;
using LinqToDB.DataProvider.SqlServer;
using Microsoft.ApplicationInsights.Extensibility;
using Microsoft.ApplicationInsights.Extensibility.Implementation;
using Microsoft.Data.SqlClient;
using Microsoft.FeatureManagement;
using System.Data;

namespace Elf.Web;

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
        // Framework
        services.AddOptions();
        services.Configure<AppSettings>(Configuration.GetSection(nameof(AppSettings)));
        services.Configure<List<Tenant>>(Configuration.GetSection("Tenants"));
        services.AddMultiTenancy()
                .WithResolutionStrategy<HostResolutionStrategy>()
                .WithStore<AppSettingsTenantStore>();
        services.AddFeatureManagement();
        services.AddMemoryCache();
        services.Configure<IpRateLimitOptions>(Configuration.GetSection("IpRateLimiting"));
        services.AddInMemoryRateLimiting();
        services.AddSingleton<IRateLimitConfiguration, RateLimitConfiguration>();
        services.AddControllers();
        services.Configure<RouteOptions>(options =>
        {
            options.LowercaseUrls = true;
            options.LowercaseQueryStrings = true;
            options.AppendTrailingSlash = false;
        });
        services.AddRazorPages().AddRazorPagesOptions(options =>
        {
            options.Conventions.AuthorizeFolder("/");
        });

        services.AddSession(options =>
        {
            options.IdleTimeout = TimeSpan.FromMinutes(20);
            options.Cookie.HttpOnly = true;
        });

        services.AddAntiforgery(options =>
        {
            const string cookieBaseName = "CSRF-TOKEN-ELF";
            options.Cookie.Name = $"X-{cookieBaseName}";
            options.FormFieldName = $"{cookieBaseName}-FORM";
            options.HeaderName = "XSRF-TOKEN";
        });

        services.AddLinqToDbContext<AppDataConnection>((provider, options) =>
        {
            SqlServerTools.Provider = SqlServerProvider.MicrosoftDataSqlClient;

            options.UseSqlServer(Configuration.GetConnectionString("ElfDatabase"))
                   .UseDefaultLogging(provider);
        });

        // Azure
        if (bool.Parse(Configuration["AppSettings:PreferAzureAppConfiguration"]))
        {
            services.AddAzureAppConfiguration();
        }
        services.AddApplicationInsightsTelemetry();
        services.AddAzureAppConfiguration();

        // Elf
        var aadOption = Configuration.GetSection("AzureAd").Get<AzureAdOption>();
        services.AddElfAuthenticaton(aadOption);
        services.AddScoped<IDbConnection>(_ => new SqlConnection(Configuration.GetConnectionString("ElfDatabase")));
        services.AddSingleton<ITokenGenerator, ShortGuidTokenGenerator>();
        services.AddScoped<ILinkForwarderService, LinkForwarderService>();
        services.AddScoped<ILinkVerifier, LinkVerifier>();
    }

    public void Configure(IApplicationBuilder app, IWebHostEnvironment env, ILogger<Startup> logger, TelemetryConfiguration configuration)
    {
        _logger = logger;
        app.UseMultiTenancy();

        if (!env.IsProduction())
        {
            _logger.LogWarning("Application is running under DEBUG mode. Application Insights disabled.");

            configuration.DisableTelemetry = true;
            TelemetryDebugWriter.IsTracingDisabled = true;
        }

        if (env.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
        }
        else
        {
            app.UseStatusCodePages();
            app.UseHsts();
            app.UseHttpsRedirection();
        }

        if (bool.Parse(Configuration["AppSettings:PreferAzureAppConfiguration"]))
        {
            app.UseAzureAppConfiguration();
        }

        app.UseMiddleware<PoweredByMiddleware>();
        app.UseStaticFiles();

        app.UseIpRateLimiting();

        app.MapWhen(context => context.Request.Path == "/", builder =>
        {
            builder.Run(async context =>
            {
                context.Response.Headers.Add("X-Elf-Version", Utils.AppVersion);
                var obj = new
                {
                    ElfVersion = Utils.AppVersion,
                    DotNetVersion = System.Environment.Version.ToString(),
                    EnvironmentTags = Utils.GetEnvironmentTags(),
                    TenantId = context.GetTenant().Id
                };

                await context.Response.WriteAsJsonAsync(obj);
            });
        });

        app.UseRouting();

        app.UseAuthentication();
        app.UseAuthorization();

        app.UseEndpoints(endpoints =>
        {
            endpoints.MapGet("/accessdenied", async context =>
            {
                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                await context.Response.WriteAsync("Access Denied");
            });

            endpoints.MapControllers();
            endpoints.MapRazorPages();
        });
    }
}
