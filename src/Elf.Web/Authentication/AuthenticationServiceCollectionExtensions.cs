﻿using System;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;

namespace Elf.Web.Authentication
{
    public static class AuthenticationServiceCollectionExtensions
    {
        public static void AddElfAuthenticaton(this IServiceCollection services, AzureAdOption aadOption)
        {
            services.Configure<AzureAdOption>(option =>
            {
                option.CallbackPath = aadOption.CallbackPath;
                option.ClientId = aadOption.ClientId;
                option.Domain = aadOption.Domain;
                option.Instance = aadOption.Instance;
                option.TenantId = aadOption.TenantId;
            }).AddSingleton<IConfigureOptions<OpenIdConnectOptions>, ConfigureAzureOptions>();

            services.AddAuthentication(sharedOptions =>
            {
                sharedOptions.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                sharedOptions.DefaultChallengeScheme = OpenIdConnectDefaults.AuthenticationScheme;
            }).AddOpenIdConnect().AddCookie();
        }

        private class ConfigureAzureOptions : IConfigureNamedOptions<OpenIdConnectOptions>
        {
            private readonly AzureAdOption _azureOptions;

            public ConfigureAzureOptions(IOptions<AzureAdOption> azureOptions)
            {
                _azureOptions = azureOptions.Value;
            }

            public void Configure(string name, OpenIdConnectOptions options)
            {
                options.ClientId = _azureOptions.ClientId;
                options.Authority = $"{_azureOptions.Instance}{_azureOptions.TenantId}";
                options.UseTokenLifetime = true;
                options.CallbackPath = _azureOptions.CallbackPath;
                options.RequireHttpsMetadata = false;
            }

            public void Configure(OpenIdConnectOptions options)
            {
                Configure(Options.DefaultName, options);
            }
        }
    }
}
