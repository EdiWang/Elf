using Elf.Api;
using Elf.Api.Services;
using Elf.Api.Setup;
using Elf.Shared;
using Elf.TokenGenerator;
using LiteBus.Commands.Extensions.MicrosoftDependencyInjection;
using LiteBus.Messaging.Extensions.MicrosoftDependencyInjection;
using LiteBus.Queries.Extensions.MicrosoftDependencyInjection;
using Microsoft.Data.SqlClient;
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

await app.InitStartUp();
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

    AddRateLimit(builder);

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

    services.AddScoped<IDatabaseSchemaRunner, DatabaseSchemaRunner>();
    services.AddScoped<IStartUpInitializer, StartUpInitializer>();
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
    bool useXFFHeaders = app.Configuration.GetValue<bool>("ForwardedHeaders:Enabled");
    if (useXFFHeaders) app.UseSmartXFFHeader();

    var policyCollection = new HeaderPolicyCollection()
        .AddFrameOptionsDeny()
        .AddContentTypeOptionsNoSniff()
        .RemoveServerHeader();

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
        ResponseWriter = PingEndpoint.WriteResponse
    });

    app.MapControllers();
}

static void AddRateLimit(WebApplicationBuilder builder)
{
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
            context.HttpContext.Response.Headers["x-ratelimit-remaining"] = "0";
            context.HttpContext.Response.Headers["x-ratelimit-reset"] = DateTimeOffset.UtcNow.AddSeconds(rateLimitOptions.WindowSeconds).ToUnixTimeSeconds().ToString();

            context.HttpContext.Response.StatusCode = StatusCodes.Status429TooManyRequests;
            await context.HttpContext.Response.WriteAsync("Too Many Requests", ct);
        };

        limiterOptions.AddPolicy("fixed-ip", context =>
        {
            var remoteIpAddress = context.Connection.RemoteIpAddress;
            if (remoteIpAddress != null && !IPAddress.IsLoopback(remoteIpAddress))
            {
                // For IPv6, consider using subnet prefix instead of full address
                var partitionKey = remoteIpAddress.AddressFamily == System.Net.Sockets.AddressFamily.InterNetworkV6
                    ? GetIPv6Subnet(remoteIpAddress)
                    : remoteIpAddress.ToString();

                return RateLimitPartition.GetFixedWindowLimiter
                    (partitionKey, _ => new()
                    {
                        AutoReplenishment = rateLimitOptions.AutoReplenishment,
                        PermitLimit = rateLimitOptions.PermitLimit,
                        Window = TimeSpan.FromSeconds(rateLimitOptions.WindowSeconds),
                        QueueLimit = rateLimitOptions.QueueLimit
                    });
            }

            return RateLimitPartition.GetNoLimiter(IPAddress.Loopback.ToString());
        });
    });
}

static string GetIPv6Subnet(IPAddress ipv6Address)
{
    if (ipv6Address.AddressFamily != System.Net.Sockets.AddressFamily.InterNetworkV6)
    {
        throw new ArgumentException("Address must be IPv6", nameof(ipv6Address));
    }

    var addressBytes = ipv6Address.GetAddressBytes();
    
    // Use /64 subnet for rate limiting (first 8 bytes)
    // This is a common IPv6 subnet boundary that groups related addresses
    // while still providing reasonable granularity for rate limiting
    var subnetBytes = new byte[16];
    Array.Copy(addressBytes, 0, subnetBytes, 0, 8);
    // Fill remaining bytes with zeros (already done by default)
    
    var subnetAddress = new IPAddress(subnetBytes);
    return $"{subnetAddress}/64";
}