using Elf.Admin.Data;
using Elf.Shared;
using Elf.TokenGenerator;
using LiteBus.Commands.Extensions.MicrosoftDependencyInjection;
using LiteBus.Messaging.Extensions.MicrosoftDependencyInjection;
using LiteBus.Queries.Extensions.MicrosoftDependencyInjection;
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
        if (IsRunningOnAzureAppService())
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
        app.MapControllers();
    }

    private static bool IsRunningOnAzureAppService() => !string.IsNullOrWhiteSpace(Environment.GetEnvironmentVariable("WEBSITE_SITE_NAME"));
}
