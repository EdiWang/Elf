using Elf.Shared;
using Microsoft.Net.Http.Headers;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Elf.Api.Services;

public interface IIPLocationService
{
    Task<IPLocation> GetLocationAsync(string ip, string userAgent);
}

public class IPLocationService : IIPLocationService
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<IPLocationService> _logger;

    public IPLocationService(HttpClient httpClient, ILogger<IPLocationService> logger)
    {
        // or http://ip-api.com/json/x.x.x.x
        httpClient.BaseAddress = new("https://ipapi.co");
        httpClient.DefaultRequestHeaders.Add(HeaderNames.Accept, "application/json");

        _httpClient = httpClient;

        _logger = logger;
    }

    public async Task<IPLocation> GetLocationAsync(string ip, string userAgent)
    {
        if (string.IsNullOrWhiteSpace(ip) || Utils.IsPrivateIP(ip) || ip == "::1")
        {
            return null;
        }

        _httpClient.DefaultRequestHeaders.Add(HeaderNames.UserAgent, userAgent);

        _logger.LogInformation($"Requesting IP Location: {_httpClient.BaseAddress}/{ip}/json");

        var response = await _httpClient.GetAsync($"{ip}/json");
        if (!response.IsSuccessStatusCode) return null;

        var json = await response.Content.ReadAsStringAsync();
        var obj = JsonSerializer.Deserialize<IPLocation>(json, new JsonSerializerOptions(JsonSerializerDefaults.Web));

        return obj;
    }
}

public class IPLocation
{
    public string Ip { get; set; }

    public string City { get; set; }

    public string Region { get; set; }

    [JsonPropertyName("country_name")]
    public string Country { get; set; }

    public string ASN { get; set; }

    public string Org { get; set; }
}