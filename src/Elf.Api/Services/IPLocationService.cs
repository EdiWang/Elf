using Elf.Shared;
using Microsoft.Net.Http.Headers;
using System.Net;
using System.Text.Json.Serialization;

namespace Elf.Api.Services;

public interface IIPLocationService
{
    Task<IPLocation> GetLocationAsync(string ip, string userAgent, CancellationToken ct = default);
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

    public async Task<IPLocation> GetLocationAsync(string ip, string userAgent, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(ip) ||
            !IPAddress.TryParse(ip, out var ipAddress) ||
            IPAddress.IsLoopback(ipAddress) ||
            Utils.IsPrivateIP(ip))
        {
            return null;
        }

        using var request = new HttpRequestMessage(HttpMethod.Get, $"{Uri.EscapeDataString(ip)}/json");
        if (!string.IsNullOrWhiteSpace(userAgent))
        {
            request.Headers.TryAddWithoutValidation(HeaderNames.UserAgent, userAgent);
        }

        _logger.LogInformation("Requesting IP location for {IP}", ip);

        using var response = await _httpClient.SendAsync(request, HttpCompletionOption.ResponseHeadersRead, ct);
        if (!response.IsSuccessStatusCode) return null;

        return await response.Content.ReadFromJsonAsync<IPLocation>(cancellationToken: ct);
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