using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using LinkForwarder.Authentication;
using LinkForwarder.Models;
using LinkForwarder.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace LinkForwarder
{
    public class Startup
    {
        private readonly ILogger<Startup> _logger;

        public IHostingEnvironment Environment { get; }

        public Startup(IConfiguration configuration, ILogger<Startup> logger, IHostingEnvironment env)
        {
            Configuration = configuration;
            Environment = env;
            _logger = logger;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddDistributedMemoryCache();
            services.AddSession(options =>
            {
                options.IdleTimeout = TimeSpan.FromMinutes(20);
                options.Cookie.HttpOnly = true;
            });


            services.Configure<AppSettings>(Configuration.GetSection(nameof(AppSettings)));

            var authentication = new AzureAdOption();
            Configuration.Bind("AzureAd", authentication);
            services.AddLinkForwarderAuthenticaton(authentication);

            var conn = Configuration.GetConnectionString("LinkForwarderDatabase");
            services.AddTransient<IDbConnection>(c => new SqlConnection(conn));
            services.AddSingleton<ITokenGenerator, ShortGuidTokenGenerator>();

            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_2);
        }

        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                _logger.LogWarning("LinkForwarder is running in DEBUG.");
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseStatusCodePages();
                app.UseHsts();
                app.UseHttpsRedirection();
            }

            app.UseStaticFiles();
            app.UseAuthentication();

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");
            });
        }
    }
}
