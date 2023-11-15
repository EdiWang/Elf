namespace Elf.Api.Auth;

public interface IGetApiKeyQuery
{
    Task<ApiKey> Execute(string providedApiKey);
}