using ElfAdmin.Components;
using Microsoft.FluentUI.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Components.WebAssembly.Authentication;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using ElfAdmin;

var builder = WebAssemblyHostBuilder.CreateDefault(args);
builder.RootComponents.Add<App>("#app");
builder.RootComponents.Add<HeadOutlet>("head::after");

builder.Services.AddFluentUIComponents();

builder.Services.AddScoped<ElfAuthorizationMessageHandler>();

// builder.HostEnvironment.BaseAddress
builder.Services.AddHttpClient("ElfAPI", client => client.BaseAddress = new Uri(Constants.APIAddress))
    .AddHttpMessageHandler<ElfAuthorizationMessageHandler>();

// Supply HttpClient instances that include access tokens when making requests to the server project
builder.Services.AddScoped(sp => sp.GetRequiredService<IHttpClientFactory>().CreateClient("ElfAPI"));

builder.Services.AddMsalAuthentication(options =>
{
    builder.Configuration.Bind("AzureAd", options.ProviderOptions.Authentication);
    options.ProviderOptions.DefaultAccessTokenScopes.Add($"api://{Constants.APIAppUrlGuid}/access_as_user");
});

await builder.Build().RunAsync();
