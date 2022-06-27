using Microsoft.Extensions.Options;

namespace Elf.Api.Auth;

public class AppSettingsGetApiKeyQuery : IGetApiKeyQuery
{
    private readonly IDictionary<string, ApiKey> _apiKeys;

    public AppSettingsGetApiKeyQuery(IOptions<List<ApiKey>> settings)
    {
        _apiKeys = settings.Value.ToDictionary(x => x.Key, x => x);
    }

    public Task<ApiKey> Execute(string providedApiKey)
    {
        _apiKeys.TryGetValue(providedApiKey, out var key);
        return Task.FromResult(key);
    }
}