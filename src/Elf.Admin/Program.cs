using Edi.AspNetCore.Utils;
using Elf.Admin.Auth;
using Elf.Admin.Services;
using Elf.Data;
using Elf.Shared;
using Elf.TokenGenerator;
using LiteBus.Commands;
using LiteBus.Extensions.Microsoft.DependencyInjection;
using LiteBus.Messaging;
using LiteBus.Queries;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.ResponseCompression;
using Microsoft.EntityFrameworkCore;
using Microsoft.FeatureManagement;
using System.Globalization;
using System.IO.Compression;
using System.Net;
using System.Net.Sockets;
using System.Threading.RateLimiting;

namespace Elf.Admin;

public class Program
{
    private const int AuthRateLimitPermitLimit = 8;
    private static readonly TimeSpan AuthRateLimitWindow = TimeSpan.FromMinutes(5);

    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        ConfigureLogging(builder);
        ConfigureServices(builder.Services, builder.Configuration);

        var app = builder.Build();

        ConfigureMiddleware(app);

        app.Run();
    }

    private static void ConfigureLogging(WebApplicationBuilder builder)
    {
        if (EnvironmentHelper.IsRunningOnAzureAppService())
        {
            builder.Logging.AddAzureWebAppDiagnostics();
        }
    }

    private static void ConfigureServices(IServiceCollection services, IConfiguration configuration)
    {
        services.AddLiteBus(liteBus =>
        {
            liteBus.AddMessaging(_ => { });

            liteBus.AddCommands(module =>
            {
                module.RegisterFromAssembly(typeof(Program).Assembly);
            });

            liteBus.AddQueries(module =>
            {
                module.RegisterFromAssembly(typeof(Program).Assembly);
            });
        });

        services.AddRazorPages();
        services.AddControllers(options =>
        {
            options.Filters.Add(new AutoValidateAntiforgeryTokenAttribute());
        });
        services.AddAntiforgery(options =>
        {
            options.HeaderName = "RequestVerificationToken";
        });
        services.AddElfAdminAuthentication(configuration);
        services.AddRateLimiter(options =>
        {
            options.OnRejected = async (context, ct) =>
            {
                if (context.Lease.TryGetMetadata(MetadataName.RetryAfter, out var retryAfter))
                {
                    context.HttpContext.Response.Headers.RetryAfter =
                        ((int)retryAfter.TotalSeconds).ToString(NumberFormatInfo.InvariantInfo);
                }

                context.HttpContext.Response.Headers["x-ratelimit-limit"] = AuthRateLimitPermitLimit.ToString(NumberFormatInfo.InvariantInfo);
                context.HttpContext.Response.Headers["x-ratelimit-remaining"] = "0";
                context.HttpContext.Response.Headers["x-ratelimit-reset"] = DateTimeOffset.UtcNow.Add(AuthRateLimitWindow).ToUnixTimeSeconds().ToString(NumberFormatInfo.InvariantInfo);

                context.HttpContext.Response.StatusCode = StatusCodes.Status429TooManyRequests;
                await context.HttpContext.Response.WriteAsync("Too Many Requests", ct);
            };

            options.AddPolicy(ElfRateLimitPolicies.Auth, httpContext =>
                RateLimitPartition.GetFixedWindowLimiter(
                    GetRateLimitPartitionKey(httpContext),
                    _ => new FixedWindowRateLimiterOptions
                    {
                        PermitLimit = AuthRateLimitPermitLimit,
                        Window = AuthRateLimitWindow,
                        QueueLimit = 0
                    }));
        });
        services.AddHealthChecks();
        services.AddOptions();
        services.Configure<LinkTrackingCleanupOptions>(configuration.GetSection("LinkTrackingCleanup"));
        if (configuration.GetValue("LinkTrackingCleanup:RetentionDays", 365) > 0)
        {
            services.AddHostedService<LinkTrackingCleanupService>();
        }
        services.AddFeatureManagement();

        var redisConn = configuration.GetConnectionString("RedisConnection");
        if (!string.IsNullOrWhiteSpace(redisConn))
        {
            services.AddStackExchangeRedisCache(options => options.Configuration = redisConn);
        }
        else
        {
            services.AddDistributedMemoryCache();
        }

        services.AddSingleton<ITokenGenerator, ShortGuidTokenGenerator>();
        services.AddScoped<ILinkVerifier, LinkVerifier>();

        var databaseProvider = GetDatabaseProvider(configuration);
        services.AddDbContext<ElfDbContext>(options =>
        {
            options.UseLazyLoadingProxies();

            var connectionString = configuration.GetConnectionString("ElfDatabase");
            switch (databaseProvider)
            {
                case ElfDatabaseProvider.SqlServer:
                    options.UseSqlServer(connectionString);
                    break;
                case ElfDatabaseProvider.PostgreSql:
                    options.UseNpgsql(connectionString);
                    break;
                default:
                    throw new NotSupportedException($"Unsupported database provider: {databaseProvider}");
            }

            options.EnableDetailedErrors();
        });

        // Add response compression with GZIP
        services.AddResponseCompression(options =>
        {
            options.EnableForHttps = true;
            options.Providers.Add<GzipCompressionProvider>();
        });

        services.Configure<GzipCompressionProviderOptions>(options =>
        {
            options.Level = CompressionLevel.Fastest;
        });
    }

    private static void ConfigureMiddleware(WebApplication app)
    {
        bool useXFFHeaders = app.Configuration.GetValue<bool>("ForwardedHeaders:Enabled");
        if (useXFFHeaders) app.UseSmartXFFHeader();

        // Configure the HTTP request pipeline.
        if (!app.Environment.IsDevelopment())
        {
            app.UseExceptionHandler("/Error");
        }

        // Use response compression (must be before UseStaticFiles)
        app.UseResponseCompression();

        app.UseHttpsRedirection();
        app.UseStaticFiles();

        app.UseRouting();
        app.UseAuthentication();
        app.UseAuthorization();
        app.UseRateLimiter();

        var razorPages = app.MapRazorPages();
        var controllers = app.MapControllers();

        if (UseInAppAuthorization(app.Configuration))
        {
            razorPages.RequireAuthorization();
            controllers.RequireAuthorization();
        }

        app.MapHealthChecks("/health", new()
        {
            ResponseWriter = PingEndpoint.WriteResponse
        });
    }

    private static bool UseInAppAuthorization(IConfiguration configuration)
    {
        var provider = configuration.GetValue("Authentication:Provider", AuthenticationProvider.Local);
        return provider != AuthenticationProvider.External;
    }

    private static string GetRateLimitPartitionKey(HttpContext httpContext)
    {
        var ipAddress = httpContext.Connection.RemoteIpAddress;
        if (ipAddress is null)
        {
            return "unknown";
        }

        return ipAddress.AddressFamily == AddressFamily.InterNetworkV6
            ? GetIPv6Subnet(ipAddress)
            : ipAddress.ToString();
    }

    private static string GetIPv6Subnet(IPAddress ipv6Address)
    {
        if (ipv6Address.AddressFamily != AddressFamily.InterNetworkV6)
        {
            throw new ArgumentException("Address must be IPv6", nameof(ipv6Address));
        }

        var addressBytes = ipv6Address.GetAddressBytes();
        var subnetBytes = new byte[16];
        Array.Copy(addressBytes, 0, subnetBytes, 0, 8);

        return $"{new IPAddress(subnetBytes)}/64";
    }

    private static ElfDatabaseProvider GetDatabaseProvider(IConfiguration configuration)
    {
        var configuredProvider = configuration["Database:Provider"];
        if (string.IsNullOrWhiteSpace(configuredProvider))
        {
            return ElfDatabaseProvider.SqlServer;
        }

        if (string.Equals(configuredProvider, "Postgres", StringComparison.OrdinalIgnoreCase) ||
            string.Equals(configuredProvider, "PostgreSQL", StringComparison.OrdinalIgnoreCase))
        {
            return ElfDatabaseProvider.PostgreSql;
        }

        return Enum.TryParse<ElfDatabaseProvider>(configuredProvider, ignoreCase: true, out var provider)
            ? provider
            : throw new InvalidOperationException($"Unsupported database provider: {configuredProvider}");
    }
}
