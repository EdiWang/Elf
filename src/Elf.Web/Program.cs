using AspNetCoreRateLimit;
using Elf.MultiTenancy;
using Elf.Services;
using Elf.Services.Entities;
using Elf.Services.TokenGenerator;
using Elf.Web;
using Elf.Web.Models;
using LinqToDB.AspNet;
using LinqToDB.AspNet.Logging;
using LinqToDB.Configuration;
using LinqToDB.DataProvider.SqlServer;
using Microsoft.ApplicationInsights.Extensibility;
using Microsoft.ApplicationInsights.Extensibility.Implementation;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.Data.SqlClient;
using Microsoft.FeatureManagement;
using Microsoft.Identity.Web;
using System.Data;
using System.Diagnostics;
using System.Text;

Encoding.RegisterProvider(CodePagesEncodingProvider.Instance);

var builder = WebApplication.CreateBuilder(args);
builder.Logging.AddAzureWebAppDiagnostics();

builder.Host.ConfigureAppConfiguration((hostingContext, config) =>
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

#region DI

// Fix docker deployments on Azure App Service blows up with Azure AD authentication
// https://docs.microsoft.com/en-us/aspnet/core/host-and-deploy/proxy-load-balancer?view=aspnetcore-6.0
// "Outside of using IIS Integration when hosting out-of-process, Forwarded Headers Middleware isn't enabled by default."
builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
});

builder.Services.AddOptions();
builder.Services.Configure<AppSettings>(builder.Configuration.GetSection(nameof(AppSettings)));
builder.Services.Configure<List<Tenant>>(builder.Configuration.GetSection("Tenants"));
builder.Services.AddMultiTenancy()
        .WithResolutionStrategy<HostResolutionStrategy>()
        .WithStore<AppSettingsTenantStore>();
builder.Services.AddFeatureManagement();

bool useRedis = builder.Configuration.GetSection("AppSettings:UseRedis").Get<bool>();
if (useRedis)
{
    builder.Services.AddStackExchangeRedisCache(options =>
    {
        options.Configuration = builder.Configuration.GetConnectionString("RedisConnection");
    });
}
else
{
    builder.Services.AddDistributedMemoryCache();
}

builder.Services.Configure<IpRateLimitOptions>(builder.Configuration.GetSection("IpRateLimiting"));
builder.Services.AddInMemoryRateLimiting();
builder.Services.AddSingleton<IRateLimitConfiguration, RateLimitConfiguration>();
builder.Services.AddControllers();
builder.Services.Configure<RouteOptions>(options =>
{
    options.LowercaseUrls = true;
    options.LowercaseQueryStrings = true;
    options.AppendTrailingSlash = false;
});
builder.Services.AddRazorPages().AddRazorPagesOptions(options =>
{
    options.Conventions.AuthorizeFolder("/");
});

builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(20);
    options.Cookie.HttpOnly = true;
});

builder.Services.AddAntiforgery(options =>
{
    const string cookieBaseName = "CSRF-TOKEN-ELF";
    options.Cookie.Name = $"X-{cookieBaseName}";
    options.FormFieldName = $"{cookieBaseName}-FORM";
    options.HeaderName = "XSRF-TOKEN";
});

builder.Services.AddLinqToDbContext<AppDataConnection>((provider, options) =>
{
    SqlServerTools.Provider = SqlServerProvider.MicrosoftDataSqlClient;

    options.UseSqlServer(builder.Configuration.GetConnectionString("ElfDatabase"))
           .UseDefaultLogging(provider);
});

// Azure
if (bool.Parse(builder.Configuration["AppSettings:PreferAzureAppConfiguration"]))
{
    builder.Services.AddAzureAppConfiguration();
}
builder.Services.AddApplicationInsightsTelemetry();
builder.Services.AddAzureAppConfiguration();

// Elf
builder.Services.AddAuthentication(OpenIdConnectDefaults.AuthenticationScheme)
                .AddMicrosoftIdentityWebApp(builder.Configuration.GetSection("AzureAd"));
builder.Services.AddScoped<IDbConnection>(_ => new SqlConnection(builder.Configuration.GetConnectionString("ElfDatabase")));
builder.Services.AddSingleton<ITokenGenerator, ShortGuidTokenGenerator>();
builder.Services.AddScoped<ILinkForwarderService, LinkForwarderService>();
builder.Services.AddScoped<ILinkVerifier, LinkVerifier>();

#endregion

var app = builder.Build();

#region First Run

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;

    var dbConnection = services.GetRequiredService<AppDataConnection>();
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
                app.Logger.LogInformation("Initializing first run configuration...");
                dbConnection.SetupDatabase();
                app.Logger.LogInformation("Database setup successfully.");
            }
            catch (Exception e)
            {
                app.Logger.LogCritical(e, e.Message);
            }
        }
    }
}

#endregion

#region Middleware

app.UseForwardedHeaders();

app.UseMultiTenancy();

if (!app.Environment.IsProduction())
{
    var tc = app.Services.GetRequiredService<TelemetryConfiguration>();
    tc.DisableTelemetry = true;
    TelemetryDebugWriter.IsTracingDisabled = true;
}

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}
else
{
    app.UseStatusCodePages();
    app.UseHsts();
    app.UseHttpsRedirection();
}

if (bool.Parse(app.Configuration["AppSettings:PreferAzureAppConfiguration"]))
{
    app.UseAzureAppConfiguration();
}

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

#endregion

app.Run();