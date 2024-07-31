using Azure.Monitor.OpenTelemetry.AspNetCore;
using Elf.Api;
using Elf.Api.Auth;
using Elf.Api.Data;
using Elf.Api.Features;
using Elf.Api.TokenGenerator;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.FeatureManagement;
using Microsoft.Identity.Web;
using Polly;
using System.Globalization;
using System.Net;
using System.Threading.RateLimiting;

Encoding.RegisterProvider(CodePagesEncodingProvider.Instance);

var builder = WebApplication.CreateBuilder(args);
builder.Logging.AddAzureWebAppDiagnostics();

ConfigureServices(builder.Services);

var app = builder.Build();

await app.DetectChina();

#region First Run

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;

    var context = services.GetRequiredService<ElfDbContext>();
    var canConnect = await context.Database.CanConnectAsync();
    if (!canConnect)
    {
        app.MapGet("/", () => Results.Problem(
            detail: "Database connection test failed, please check your connection string and firewall settings, then RESTART Elf manually.",
            statusCode: 500));
        app.Run();
    }

    await context.Database.EnsureCreatedAsync();
}

#endregion

ConfigureMiddleware();
ConfigureEndpoints();

app.Run();

void ConfigureServices(IServiceCollection services)
{
    builder.Services.AddMediatR(options => options.RegisterServicesFromAssemblies(AppDomain.CurrentDomain.GetAssemblies()));

    // Fix docker deployments on Azure App Service blows up with Azure AD authentication
    // https://docs.microsoft.com/en-us/aspnet/core/host-and-deploy/proxy-load-balancer?view=aspnetcore-6.0
    // "Outside of using IIS Integration when hosting out-of-process, Forwarded Headers Middleware isn't enabled by default."
    var knownProxies = builder.Configuration.GetSection("KnownProxies").Get<string[]>();
    builder.Services.Configure<ForwardedHeadersOptions>(options =>
    {
        if (Environment.GetEnvironmentVariable("DOTNET_RUNNING_IN_CONTAINER") == "true")
        {
            // Adding KnownProxies will make Azure App Service boom boom with Azure AD redirect URL
            // Result in `https` incorrectly written into `http`.
            Console.WriteLine("Running in Docker, skip adding 'KnownProxies'.");
        }
        else
        {
            options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
            options.ForwardLimit = null;
            options.KnownProxies.Clear();
            if (knownProxies != null)
            {
                foreach (var ip in knownProxies)
                {
                    options.KnownProxies.Add(IPAddress.Parse(ip));
                }
            }
        }
    });

    var rateLimitOptions = new RateLimitOptions();
    builder.Configuration.GetSection(RateLimitOptions.RateLimit).Bind(rateLimitOptions);

    builder.Services.AddRateLimiter(limiterOptions =>
    {
        limiterOptions.OnRejected = async (context, ct) =>
        {
            if (context.Lease.TryGetMetadata(MetadataName.RetryAfter, out var retryAfter))
            {
                context.HttpContext.Response.Headers.RetryAfter =
                    ((int)retryAfter.TotalSeconds).ToString(NumberFormatInfo.InvariantInfo);
            }

            context.HttpContext.Response.Headers["x-ratelimit-limit"] = rateLimitOptions.PermitLimit.ToString();

            context.HttpContext.Response.StatusCode = StatusCodes.Status429TooManyRequests;
            await context.HttpContext.Response.WriteAsync("Too Many Requests", ct);
        };

        limiterOptions.AddPolicy("fixed-ip", context =>
        {
            var remoteIpAddress = context.Connection.RemoteIpAddress;
            if (remoteIpAddress != null && !IPAddress.IsLoopback(remoteIpAddress))
            {
                return RateLimitPartition.GetFixedWindowLimiter
                    (remoteIpAddress!, _ =>
                        new()
                        {
                            AutoReplenishment = rateLimitOptions.AutoReplenishment,
                            PermitLimit = rateLimitOptions.PermitLimit,
                            Window = TimeSpan.FromSeconds(rateLimitOptions.WindowSeconds),
                            QueueLimit = rateLimitOptions.QueueLimit
                        });
            }

            return RateLimitPartition.GetNoLimiter(IPAddress.Loopback);
        });
    });

    if (!string.IsNullOrWhiteSpace(Environment.GetEnvironmentVariable("APPLICATIONINSIGHTS_CONNECTION_STRING")))
    {
        services.AddOpenTelemetry().UseAzureMonitor();
    }

    services.AddHealthChecks();
    services.AddOptions();
    services.AddFeatureManagement();

    var redisConn = builder.Configuration.GetConnectionString("RedisConnection");
    if (!string.IsNullOrWhiteSpace(redisConn))
    {
        services.AddStackExchangeRedisCache(options => options.Configuration = redisConn);
    }
    else
    {
        services.AddDistributedMemoryCache();
    }

    services.Configure<List<ApiKey>>(builder.Configuration.GetSection("ApiKeys"));
    services.AddScoped<IGetApiKeyQuery, AppSettingsGetApiKeyQuery>();
    services.AddControllers();
    services.AddEndpointsApiExplorer();
    services.AddSwaggerGen();
    services.Configure<RouteOptions>(options =>
    {
        options.LowercaseUrls = true;
        options.LowercaseQueryStrings = true;
        options.AppendTrailingSlash = false;
    });

    services.AddDbContext<ElfDbContext>(options => options.UseLazyLoadingProxies()
            .UseSqlServer(builder.Configuration.GetConnectionString("ElfDatabase"))
            .EnableDetailedErrors());

    // Elf
    services.AddSingleton<CannonService>();
    services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddApiKeySupport(_ => { })
            .AddMicrosoftIdentityWebApi(builder.Configuration.GetSection("EntraID"));

    services.AddAuthorization();

    services.AddSingleton<ITokenGenerator, ShortGuidTokenGenerator>();
    services.AddScoped<ILinkVerifier, LinkVerifier>();

    services.AddHttpClient<IIPLocationService, IPLocationService>()
            .AddTransientHttpErrorPolicy(x => x.WaitAndRetryAsync(3, retryCount => TimeSpan.FromSeconds(Math.Pow(2, retryCount))));

    services.AddCors(o => o.AddPolicy("local", x =>
        x.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader()));
}

void ConfigureMiddleware()
{
    app.UseForwardedHeaders();

    var policyCollection = new HeaderPolicyCollection()
    .AddFrameOptionsDeny()
    .AddContentTypeOptionsNoSniff()
    .RemoveServerHeader()
    .AddContentSecurityPolicy(x =>
    {
        x.AddObjectSrc().None();
        x.AddFormAction().Self();
        x.AddFrameAncestors().None();
    });

    app.UseSecurityHeaders(policyCollection);

    if (app.Environment.IsDevelopment())
    {
        app.UseCors("local");
        app.UseSwagger();
        app.UseSwaggerUI();
        app.UseDeveloperExceptionPage();
    }
    else
    {
        app.UseStatusCodePages();
    }

    app.UseHsts();
    app.UseHttpsRedirection();

    app.UseStaticFiles();
    app.UseRouting();
    app.UseRateLimiter();

    app.UseAuthentication();
    app.UseAuthorization();
}

void ConfigureEndpoints()
{
    app.MapHealthChecks("/", new()
    {
        ResponseWriter = WriteResponse
    });

    app.MapControllers();
}

static Task WriteResponse(HttpContext context, HealthReport result)
{
    context.Response.Headers.Append("X-Elf-Version", Utils.AppVersion);

    var obj = new
    {
        Utils.AppVersion,
        DotNetVersion = Environment.Version.ToString(),
        EnvironmentTags = Utils.GetEnvironmentTags(),
        GeoMatch = context.Request.Headers["geo-match"],
        RequestIpAddress = context.Connection.RemoteIpAddress?.ToString()
    };

    return context.Response.WriteAsJsonAsync(obj);
}