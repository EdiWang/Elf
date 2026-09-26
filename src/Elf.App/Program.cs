using Edi.AspNetCore.Utils;
using Elf.App.Auth;
using Elf.App.Services;
using Elf.App.Setup;
using Elf.Data;
using Elf.Shared;
using Elf.TokenGenerator;
using LiteBus.Commands;
using LiteBus.Extensions.Microsoft.DependencyInjection;
using LiteBus.Messaging;
using LiteBus.Queries;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.AspNetCore.ResponseCompression;
using Microsoft.EntityFrameworkCore;
using Microsoft.FeatureManagement;
using Polly;
using System.Globalization;
using System.IO.Compression;
using System.Net;
using System.Net.Sockets;
using System.Threading.RateLimiting;

namespace Elf.App;

public class Program
{
    private const int AuthRateLimitPermitLimit = 8;
    private static readonly TimeSpan AuthRateLimitWindow = TimeSpan.FromMinutes(5);

    public static async Task Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);
        builder.WebHost.ConfigureKestrel(options => options.AddServerHeader = false);

        ConfigureServices(builder.Services, builder.Configuration, builder.Environment);

        var app = builder.Build();

        await app.InitStartUp();
        ConfigureMiddleware(app);

        app.Run();
    }

    private static void ConfigureServices(IServiceCollection services, IConfiguration configuration, IWebHostEnvironment environment)
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

        services.AddRazorPages(options =>
        {
            options.Conventions.AuthorizePage("/Index", ElfAuthorizationPolicies.Admin);
            options.Conventions.AuthorizePage("/Report", ElfAuthorizationPolicies.Admin);
            options.Conventions.AuthorizePage("/Tags", ElfAuthorizationPolicies.Admin);
            options.Conventions.AuthorizePage("/Account", ElfAuthorizationPolicies.Admin);
            options.Conventions.AuthorizePage("/Error", ElfAuthorizationPolicies.Admin);
        });
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
            var forwarderRateLimitOptions = new RateLimitOptions();
            configuration.GetSection(RateLimitOptions.RateLimit).Bind(forwarderRateLimitOptions);

            options.OnRejected = async (context, ct) =>
            {
                var isForwarderLimit = context.HttpContext.GetEndpoint()?.Metadata
                    .GetMetadata<EnableRateLimitingAttribute>()?.PolicyName == "fixed-ip";
                var permitLimit = isForwarderLimit ? forwarderRateLimitOptions.PermitLimit : AuthRateLimitPermitLimit;
                var window = isForwarderLimit
                    ? TimeSpan.FromSeconds(forwarderRateLimitOptions.WindowSeconds)
                    : AuthRateLimitWindow;

                if (context.Lease.TryGetMetadata(MetadataName.RetryAfter, out var retryAfter))
                {
                    context.HttpContext.Response.Headers.RetryAfter =
                        ((int)retryAfter.TotalSeconds).ToString(NumberFormatInfo.InvariantInfo);
                }

                context.HttpContext.Response.Headers["x-ratelimit-limit"] = permitLimit.ToString(NumberFormatInfo.InvariantInfo);
                context.HttpContext.Response.Headers["x-ratelimit-remaining"] = "0";
                context.HttpContext.Response.Headers["x-ratelimit-reset"] = DateTimeOffset.UtcNow.Add(window).ToUnixTimeSeconds().ToString(NumberFormatInfo.InvariantInfo);

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

            options.AddPolicy("fixed-ip", httpContext =>
            {
                var remoteIpAddress = httpContext.Connection.RemoteIpAddress;
                if (remoteIpAddress is null || IPAddress.IsLoopback(remoteIpAddress))
                {
                    return RateLimitPartition.GetNoLimiter(IPAddress.Loopback.ToString());
                }

                var partitionKey = remoteIpAddress.AddressFamily == AddressFamily.InterNetworkV6
                    ? GetIPv6Subnet(remoteIpAddress)
                    : remoteIpAddress.ToString();

                return RateLimitPartition.GetFixedWindowLimiter(partitionKey, _ => new FixedWindowRateLimiterOptions
                {
                    AutoReplenishment = forwarderRateLimitOptions.AutoReplenishment,
                    PermitLimit = forwarderRateLimitOptions.PermitLimit,
                    Window = TimeSpan.FromSeconds(forwarderRateLimitOptions.WindowSeconds),
                    QueueLimit = forwarderRateLimitOptions.QueueLimit
                });
            });
        });
        services.AddHealthChecks();
        services.AddOptions();
        services.Configure<LinkTrackingCleanupOptions>(configuration.GetSection("LinkTrackingCleanup"));
        if (configuration.GetValue("LinkTrackingCleanup:RetentionDays", 365) > 0)
        {
            services.AddHostedService<LinkTrackingCleanupService>();
        }
        services.AddFeatureManagement();

        services.AddMemoryCache();

        services.AddSingleton<ITokenGenerator, ShortGuidTokenGenerator>();
        services.AddScoped<ILinkVerifier, LinkVerifier>();
        services.AddSingleton<IBackgroundTaskQueue, BackgroundTaskQueue>();
        services.AddHostedService<QueuedBackgroundService>();
        services.AddHttpClient<IIPLocationService, IPLocationService>(client =>
            {
                client.Timeout = TimeSpan.FromSeconds(3);
            })
            .AddTransientHttpErrorPolicy(policy => policy.WaitAndRetryAsync(
                3,
                retryCount => TimeSpan.FromSeconds(Math.Pow(2, retryCount))));

        var databaseProvider = GetDatabaseProvider(configuration);
        services.AddSingleton(new ElfDatabaseOptions(databaseProvider));
        services.AddScoped<IDatabaseSchemaRunner, DatabaseSchemaRunner>();
        services.AddScoped<IStartUpInitializer, StartUpInitializer>();
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

            if (environment.IsDevelopment())
            {
                options.EnableDetailedErrors();
            }
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
        app.Use(async (context, next) =>
        {
            var path = context.Request.Path;
            if (path != "/" && path != "/health" &&
                !path.StartsWithSegments("/admin") &&
                !path.StartsWithSegments("/fw") &&
                !path.StartsWithSegments("/aka"))
            {
                context.Response.StatusCode = StatusCodes.Status404NotFound;
                return;
            }

            await next();
        });

        app.UsePathBase("/admin");

        bool useXFFHeaders = app.Configuration.GetValue<bool>("ForwardedHeaders:Enabled");
        if (useXFFHeaders) app.UseSmartXFFHeader();

        var policyCollection = new HeaderPolicyCollection()
            .AddFrameOptionsDeny()
            .AddContentTypeOptionsNoSniff()
            .RemoveServerHeader();
        app.UseSecurityHeaders(policyCollection);

        // Configure the HTTP request pipeline.
        if (!app.Environment.IsDevelopment())
        {
            app.UseWhen(context => context.Request.PathBase.StartsWithSegments("/admin"), branch =>
                branch.UseExceptionHandler("/Error"));
            app.UseWhen(context => !context.Request.PathBase.StartsWithSegments("/admin"), branch =>
                branch.UseExceptionHandler(error => error.Run(context =>
                {
                    context.Response.Headers.CacheControl = "no-store";
                    return Results.Problem(statusCode: StatusCodes.Status500InternalServerError).ExecuteAsync(context);
                })));
            app.UseHsts();
        }

        // Use response compression (must be before UseStaticFiles)
        app.UseResponseCompression();

        app.UseHttpsRedirection();
        app.UseWhen(context => context.Request.PathBase == PathString.Empty && context.Request.Path == "/", branch =>
            branch.UseHealthChecks("/", new HealthCheckOptions
            {
                ResponseWriter = PingEndpoint.WriteResponse
            }));

        app.UseStaticFiles();

        app.UseRouting();
        app.UseAuthentication();
        app.UseAuthorization();
        app.UseRateLimiter();

        app.MapRazorPages();
        app.MapControllers();
        app.MapHealthChecks("/health", new()
        {
            ResponseWriter = PingEndpoint.WriteResponse
        });
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
