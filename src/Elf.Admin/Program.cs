using Edi.AspNetCore.Utils;
using Elf.Admin.Data;
using Elf.Shared;
using Elf.TokenGenerator;
using LiteBus.Commands;
using LiteBus.Extensions.Microsoft.DependencyInjection;
using LiteBus.Queries;
using Microsoft.EntityFrameworkCore;
using Microsoft.FeatureManagement;

namespace Elf.Admin;

public class Program
{
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
            liteBus.AddCommandModule(module =>
            {
                module.RegisterFromAssembly(typeof(Program).Assembly);
            });

            liteBus.AddQueryModule(module =>
            {
                module.RegisterFromAssembly(typeof(Program).Assembly);
            });
        });

        services.AddRazorPages();
        services.AddControllers();
        services.AddHealthChecks();
        services.AddOptions();
        services.AddFeatureManagement();

        services.AddSingleton<ITokenGenerator, ShortGuidTokenGenerator>();
        services.AddScoped<ILinkVerifier, LinkVerifier>();

        services.AddDbContext<ElfDbContext>(options => options.UseLazyLoadingProxies()
            .UseSqlServer(configuration.GetConnectionString("ElfDatabase"))
            .EnableDetailedErrors());
    }

    private static void ConfigureMiddleware(WebApplication app)
    {
        bool useXFFHeaders = app.Configuration.GetValue<bool>("ForwardedHeaders:Enabled");
        if (useXFFHeaders) app.UseSmartXFFHeader();

        // Configure the HTTP request pipeline.
        if (!app.Environment.IsDevelopment())
        {
            app.UseExceptionHandler("/Error");
            // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
            app.UseHsts();
        }

        app.UseHttpsRedirection();
        app.UseStaticFiles();

        app.UseRouting();
        app.MapRazorPages();

        app.MapHealthChecks("/health", new()
        {
            ResponseWriter = PingEndpoint.WriteResponse
        });

        app.MapControllers();
    }
}
