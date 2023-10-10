using Microsoft.AspNetCore.Authentication.JwtBearer;

namespace Elf.Api.Auth;

public static class ElfAuthSchemas
{
    public const string All = "Bearer,APIKey";
    public const string Api = ApiKeyAuthenticationOptions.DefaultScheme;
    public const string EntraID = JwtBearerDefaults.AuthenticationScheme;
}