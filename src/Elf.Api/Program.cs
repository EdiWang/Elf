using AspNetCoreRateLimit;
using Elf.Api;
using Elf.Api.Features;
using Elf.Api.TokenGenerator;
using Elf.MultiTenancy;
using Elf.Services.Entities;
using LinqToDB.AspNet;
using LinqToDB.AspNet.Logging;
using LinqToDB.Configuration;
using LinqToDB.DataProvider.SqlServer;
using Microsoft.ApplicationInsights.Extensibility;
using Microsoft.ApplicationInsights.Extensibility.Implementation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
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

builder.Host.ConfigureAppConfiguration(config =>
{
    if (bool.Parse(builder.Configuration["AppSettings:PreferAzureAppConfiguration"]))
    {
        config.AddAzureAppConfiguration(options =>
        {
            options.Connect(builder.Configuration["ConnectionStrings:AzureAppConfig"])
                .ConfigureRefresh(refresh =>
                {
                    refresh.Register("Elf:Settings:Sentinel", refreshAll: true)
                        .SetCacheExpiration(TimeSpan.FromSeconds(10));
                })
                .UseFeatureFlags(o => o.Label = "Elf");
        });
    }
});

ConfigureServices(builder.Services);

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

ConfigureMiddleware(app);
ConfigureEndpoints(app);

app.Run();

void ConfigureServices(IServiceCollection services)
{
    // Fix docker deployments on Azure App Service blows up with Azure AD authentication
    // https://docs.microsoft.com/en-us/aspnet/core/host-and-deploy/proxy-load-balancer?view=aspnetcore-6.0
    // "Outside of using IIS Integration when hosting out-of-process, Forwarded Headers Middleware isn't enabled by default."
    services.Configure<ForwardedHeadersOptions>(options =>
    {
        options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
    });

    services.AddOptions();
    services.Configure<List<Tenant>>(builder.Configuration.GetSection("Tenants"));
    services.AddMultiTenancy()
            .WithResolutionStrategy<HostResolutionStrategy>()
            .WithStore<AppSettingsTenantStore>();
    services.AddFeatureManagement();

    bool useRedis = builder.Configuration.GetSection("AppSettings:UseRedis").Get<bool>();
    if (useRedis)
    {
        services.AddStackExchangeRedisCache(options =>
        {
            options.Configuration = builder.Configuration.GetConnectionString("RedisConnection");
        });
    }
    else
    {
        services.AddDistributedMemoryCache();
    }

    services.Configure<IpRateLimitOptions>(builder.Configuration.GetSection("IpRateLimiting"));
    services.AddDistributedRateLimiting();
    services.AddSingleton<IRateLimitConfiguration, RateLimitConfiguration>();
    services.AddControllers();
    services.AddEndpointsApiExplorer();
    services.AddSwaggerGen();
    services.Configure<RouteOptions>(options =>
    {
        options.LowercaseUrls = true;
        options.LowercaseQueryStrings = true;
        options.AppendTrailingSlash = false;
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

        options.UseSqlServer(builder.Configuration.GetConnectionString("ElfDatabase"))
               .UseDefaultLogging(provider);
    });

    // Azure
    if (bool.Parse(builder.Configuration["AppSettings:PreferAzureAppConfiguration"]))
    {
        services.AddAzureAppConfiguration();
    }
    services.AddApplicationInsightsTelemetry();
    services.AddAzureAppConfiguration();

    // Elf
    services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddMicrosoftIdentityWebApi(builder.Configuration.GetSection("AzureAd"));

    services.AddAuthorization();

    services.AddScoped<IDbConnection>(_ => new SqlConnection(builder.Configuration.GetConnectionString("ElfDatabase")));
    services.AddSingleton<ITokenGenerator, ShortGuidTokenGenerator>();
    services.AddScoped<ILinkForwarderService, LinkForwarderService>();
    services.AddScoped<ILinkVerifier, LinkVerifier>();

    services.AddCors(o => o.AddPolicy("local", x =>
    {
        x.AllowAnyOrigin()
         .AllowAnyMethod()
         .AllowAnyHeader();
    }));
}

void ConfigureMiddleware(IApplicationBuilder appBuilder)
{
    if (app.Environment.IsDevelopment())
    {
        app.UseCors("local");
        app.UseSwagger();
        app.UseSwaggerUI();
    }

    appBuilder.UseForwardedHeaders();

    appBuilder.UseMultiTenancy();

    if (!app.Environment.IsProduction())
    {
        var tc = app.Services.GetRequiredService<TelemetryConfiguration>();
        tc.DisableTelemetry = true;
        TelemetryDebugWriter.IsTracingDisabled = true;
    }

    if (app.Environment.IsDevelopment())
    {
        appBuilder.UseDeveloperExceptionPage();
    }
    else
    {
        appBuilder.UseStatusCodePages();
        appBuilder.UseHsts();
        appBuilder.UseHttpsRedirection();
    }

    if (bool.Parse(app.Configuration["AppSettings:PreferAzureAppConfiguration"]))
    {
        appBuilder.UseAzureAppConfiguration();
    }

    appBuilder.UseStaticFiles();

    appBuilder.UseIpRateLimiting();

    app.MapGet("/", (HttpContext httpContext) =>
    {
        httpContext.Response.Headers.Add("X-Elf-Version", Utils.AppVersion);
        var obj = new
        {
            ElfVersion = Utils.AppVersion,
            DotNetVersion = Environment.Version.ToString(),
            EnvironmentTags = Utils.GetEnvironmentTags(),
            TenantId = httpContext.GetTenant().Id
        };

        return obj;
    });

    appBuilder.UseRouting();

    appBuilder.UseAuthentication();
    appBuilder.UseAuthorization();
}

void ConfigureEndpoints(IEndpointRouteBuilder endpoints)
{
    endpoints.MapGet("/accessdenied", async context =>
    {
        context.Response.StatusCode = StatusCodes.Status401Unauthorized;
        await context.Response.WriteAsync("Access Denied");
    });

    endpoints.MapControllers();
}