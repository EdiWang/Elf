using System;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Text;
using AspNetCoreRateLimit;
using LinkForwarder.Services;
using LinkForwarder.Setup;
using LinkForwarder.Web.Authentication;
using LinkForwarder.Web.Models;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Rewrite;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace LinkForwarder.Web
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
            services.AddOptions();

            services.AddMemoryCache();

            // Setup document: https://github.com/stefanprodan/AspNetCoreRateLimit/wiki/IpRateLimitMiddleware#setup
            //load general configuration from appsettings.json
            services.Configure<IpRateLimitOptions>(Configuration.GetSection("IpRateLimiting"));

            //load ip rules from appsettings.json
            // services.Configure<IpRateLimitPolicies>(Configuration.GetSection("IpRateLimitPolicies"));

            // inject counter and rules stores
            services.AddSingleton<IIpPolicyStore, MemoryCacheIpPolicyStore>();
            services.AddSingleton<IRateLimitCounterStore, MemoryCacheRateLimitCounterStore>();

            services.AddSession(options =>
            {
                options.IdleTimeout = TimeSpan.FromMinutes(20);
                options.Cookie.HttpOnly = true;
            });

            services.Configure<AppSettings>(Configuration.GetSection(nameof(AppSettings)));

            var authentication = new AuthenticationSettings();
            Configuration.Bind(nameof(Authentication), authentication);
            services.AddLinkForwarderAuthenticaton(authentication);

            services.AddAntiforgery(options =>
            {
                const string cookieBaseName = "CSRF-TOKEN-LFWDR";
                options.Cookie.Name = $"X-{cookieBaseName}";
                options.FormFieldName = $"{cookieBaseName}-FORM";
            });

            var conn = Configuration.GetConnectionString(Constants.DbName);
            services.AddTransient<IDbConnection>(c => new SqlConnection(conn));
            services.AddSingleton<ITokenGenerator, ShortGuidTokenGenerator>();
            services.AddTransient<ILinkForwarderService, LinkForwarderService>();
            services.AddTransient<ILinkVerifier, LinkVerifier>();
            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_2);

            // https://github.com/aspnet/Hosting/issues/793
            // the IHttpContextAccessor service is not registered by default.
            // the clientId/clientIp resolvers use it.
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

            // configuration (resolvers, counter key builders)
            services.AddSingleton<IRateLimitConfiguration, RateLimitConfiguration>();
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

            var baseDir = env.ContentRootPath;
            TryAddUrlRewrite(app, baseDir);

            app.UseStaticFiles();
            app.UseAuthentication();

            var conn = Configuration.GetConnectionString(Constants.DbName);
            var setupHelper = new SetupHelper(conn);

            if (!setupHelper.TestDatabaseConnection(exception =>
            {
                _logger.LogCritical(exception, $"Error {nameof(SetupHelper.TestDatabaseConnection)}, connection string: {conn}");
            }))
            {
                app.Run(async context =>
                {
                    context.Response.StatusCode = StatusCodes.Status500InternalServerError;
                    await context.Response.WriteAsync("Database connection failed. Please see error log, fix it and RESTART this application.");
                });
            }
            else
            {
                if (setupHelper.IsFirstRun())
                {
                    try
                    {
                        setupHelper.SetupDatabase();
                    }
                    catch (Exception e)
                    {
                        _logger.LogCritical(e, e.Message);
                        app.Run(async context =>
                        {
                            context.Response.StatusCode = StatusCodes.Status500InternalServerError;
                            await context.Response.WriteAsync("Error initializing first run, please check error log.");
                        });
                    }
                }

                app.UseIpRateLimiting();

                app.MapWhen(context => context.Request.Path == "/", builder =>
                {
                    builder.Run(async context =>
                    {
                        await context.Response.WriteAsync("LinkForwarder Version: " + Utils.AppVersion, Encoding.UTF8);
                    });
                });

                app.Map("/accessdenied", builder =>
                {
                    builder.Run(async context =>
                    {
                        context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                        await context.Response.WriteAsync("Access Denied");
                    });
                });

                app.UseMvc();
            }
        }

        private void TryAddUrlRewrite(IApplicationBuilder app, string baseDir)
        {
            try
            {
                var urlRewriteConfigPath = Path.Combine(baseDir, "urlrewrite.xml");
                if (File.Exists(urlRewriteConfigPath))
                {
                    using (var sr = File.OpenText(urlRewriteConfigPath))
                    {
                        var options = new RewriteOptions()
                            .AddRedirect("(.*)/$", "$1")
                            .AddIISUrlRewrite(sr);
                        app.UseRewriter(options);
                    }
                }
                else
                {
                    _logger.LogWarning($"Can not find {urlRewriteConfigPath}, skip adding url rewrite.");
                }
            }
            catch (Exception e)
            {
                // URL Rewrite is non-fatal error, continue running the application.
                _logger.LogError(e, nameof(TryAddUrlRewrite));
            }
        }
    }
}
