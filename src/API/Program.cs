using Elf.Api;
using Elf.Api.Services;
using Elf.Shared;
using Elf.TokenGenerator;
using LiteBus.Commands.Extensions.MicrosoftDependencyInjection;
using LiteBus.Messaging.Extensions.MicrosoftDependencyInjection;
using LiteBus.Queries.Extensions.MicrosoftDependencyInjection;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.FeatureManagement;
using Polly;
using System.Data;
using System.Globalization;
using System.Net;
using System.Threading.RateLimiting;

Encoding.RegisterProvider(CodePagesEncodingProvider.Instance);

var builder = WebApplication.CreateBuilder(args);
builder.Logging.AddAzureWebAppDiagnostics();

ConfigureServices(builder.Services);

var app = builder.Build();

ConfigureMiddleware();
ConfigureEndpoints();

app.Run();

void ConfigureServices(IServiceCollection services)
{
    builder.Services.AddLiteBus(liteBus =>
    {
        liteBus.AddCommandModule(module =>
        {
            module.RegisterFromAssembly(typeof(Program).Assembly);
        });

        liteBus.AddQueryModule(module =>
        {
            module.RegisterFromAssembly(typeof(Program).Assembly);
        });
    });

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

    services.AddControllers();
    services.Configure<RouteOptions>(options =>
    {
        options.LowercaseUrls = true;
        options.LowercaseQueryStrings = true;
        options.AppendTrailingSlash = false;
    });

    // Elf
    services.AddSingleton<CannonService>();

    services.AddSingleton<ITokenGenerator, ShortGuidTokenGenerator>();
    services.AddScoped<ILinkVerifier, LinkVerifier>();

    services.AddHttpClient<IIPLocationService, IPLocationService>()
            .AddTransientHttpErrorPolicy(x => x.WaitAndRetryAsync(3, retryCount => TimeSpan.FromSeconds(Math.Pow(2, retryCount))));
    services.AddScoped<IDbConnection>(provider =>
    {
        var connectionString = builder.Configuration.GetConnectionString("ElfDatabase");
        return new SqlConnection(connectionString);
    });
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
        RequestIpAddress = context.Connection.RemoteIpAddress?.ToString()
    };

    return context.Response.WriteAsJsonAsync(obj);
}