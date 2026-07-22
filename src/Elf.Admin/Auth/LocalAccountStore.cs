using Elf.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System.Text.Json;

namespace Elf.Admin.Auth;

public interface ILocalAccountStore
{
    Task<LocalAccountSettings> GetAsync(CancellationToken ct = default);

    Task<LocalAccountSettings> GetOrCreateAsync(CancellationToken ct = default);

    Task SaveAsync(LocalAccountSettings account, CancellationToken ct = default);
}

public class LocalAccountStore(
    ElfDbContext dbContext,
    IOptions<AuthenticationSettings> authenticationOptions,
    ILocalAccountPasswordService passwordService,
    ILogger<LocalAccountStore> logger) : ILocalAccountStore
{
    public const string ConfigurationKey = "LocalAccount";

    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);

    private readonly AuthenticationSettings _authenticationSettings = authenticationOptions.Value;

    public async Task<LocalAccountSettings> GetAsync(CancellationToken ct = default)
    {
        var entity = await dbContext.ElfConfiguration
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.CfgKey == ConfigurationKey, ct);

        if (string.IsNullOrWhiteSpace(entity?.CfgValue))
        {
            return null;
        }

        try
        {
            return JsonSerializer.Deserialize<LocalAccountSettings>(entity.CfgValue, JsonOptions);
        }
        catch (JsonException ex)
        {
            logger.LogError(ex, "Invalid local account settings stored in ElfConfiguration key '{Key}'", ConfigurationKey);
            return null;
        }
    }

    public async Task<LocalAccountSettings> GetOrCreateAsync(CancellationToken ct = default)
    {
        var existingAccount = await GetAsync(ct);
        if (existingAccount is not null)
        {
            return existingAccount;
        }

        var bootstrapPassword = _authenticationSettings.Local.BootstrapPassword;
        if (string.IsNullOrWhiteSpace(bootstrapPassword))
        {
            logger.LogWarning(
                "Local account is not initialized. Configure Authentication:Local:BootstrapPassword to create the first account.");
            return null;
        }

        var username = string.IsNullOrWhiteSpace(_authenticationSettings.Local.BootstrapUsername)
            ? "admin"
            : _authenticationSettings.Local.BootstrapUsername.Trim();

        var account = new LocalAccountSettings
        {
            Username = username
        };
        account.PasswordHash = passwordService.HashPassword(account, bootstrapPassword);

        await SaveAsync(account, ct);
        logger.LogInformation("Initialized local account '{Username}' from bootstrap configuration.", account.Username);

        return account;
    }

    public async Task SaveAsync(LocalAccountSettings account, CancellationToken ct = default)
    {
        ArgumentNullException.ThrowIfNull(account);

        account.Username = account.Username?.Trim() ?? string.Empty;

        var value = JsonSerializer.Serialize(account, JsonOptions);
        var entity = await dbContext.ElfConfiguration
            .FirstOrDefaultAsync(c => c.CfgKey == ConfigurationKey, ct);

        if (entity is null)
        {
            entity = new ElfConfigurationEntity
            {
                CfgKey = ConfigurationKey
            };
            await dbContext.ElfConfiguration.AddAsync(entity, ct);
        }

        entity.CfgValue = value;
        entity.LastModifiedTimeUtc = DateTime.UtcNow;

        await dbContext.SaveChangesAsync(ct);
    }
}
