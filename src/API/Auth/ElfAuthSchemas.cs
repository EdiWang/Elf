using Microsoft.AspNetCore.Authentication.JwtBearer;

namespace Elf.Api.Auth;

public static class ElfAuthSchemas
{
    public const string EntraID = JwtBearerDefaults.AuthenticationScheme;
}