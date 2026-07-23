using Elf.Admin.Auth;
using Elf.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.Extensions.Options;
using System.Text.Json;

namespace Elf.Admin.Tests;

public class LocalAccountStoreTests
{
    [Fact]
    public async Task GetAsync_WhenAccountDoesNotExist_ReturnsNull()
    {
        await using var dbContext = CreateDbContext();
        var store = CreateStore(dbContext);

        var account = await store.GetAsync(TestContext.Current.CancellationToken);

        Assert.Null(account);
    }

    [Fact]
    public async Task SaveAsync_WritesAccountToElfConfiguration()
    {
        await using var dbContext = CreateDbContext();
        var store = CreateStore(dbContext);
        var account = new LocalAccountSettings
        {
            Username = " admin ",
            PasswordHash = "hash",
            TotpSecret = "ABCDEF234567",
            IsTotpEnabled = true
        };

        await store.SaveAsync(account, TestContext.Current.CancellationToken);

        var entity = Assert.Single(await dbContext.ElfConfiguration.ToListAsync(TestContext.Current.CancellationToken));
        Assert.Equal(LocalAccountStore.ConfigurationKey, entity.CfgKey);
        Assert.NotNull(entity.LastModifiedTimeUtc);

        var savedAccount = JsonSerializer.Deserialize<LocalAccountSettings>(
            entity.CfgValue,
            new JsonSerializerOptions(JsonSerializerDefaults.Web));

        Assert.NotNull(savedAccount);
        Assert.Equal("admin", savedAccount.Username);
        Assert.Equal("hash", savedAccount.PasswordHash);
        Assert.Equal("ABCDEF234567", savedAccount.TotpSecret);
        Assert.True(savedAccount.IsTotpEnabled);
        Assert.DoesNotContain("isTotpConfigured", entity.CfgValue);
    }

    [Fact]
    public async Task GetOrCreateAsync_WhenBootstrapPasswordIsConfigured_CreatesLocalAccount()
    {
        await using var dbContext = CreateDbContext();
        var passwordService = new LocalAccountPasswordService();
        var store = CreateStore(dbContext, passwordService, new AuthenticationSettings
        {
            Local = new LocalAuthenticationSettings
            {
                BootstrapUsername = " owner ",
                BootstrapPassword = "Password1!"
            }
        });

        var account = await store.GetOrCreateAsync(TestContext.Current.CancellationToken);

        Assert.NotNull(account);
        Assert.Equal("owner", account.Username);
        Assert.True(passwordService.VerifyPassword(account, "Password1!"));
        Assert.False(account.IsTotpEnabled);
        Assert.False(account.IsTotpConfigured);
        Assert.Equal(1, await dbContext.ElfConfiguration.CountAsync(TestContext.Current.CancellationToken));
    }

    [Fact]
    public async Task GetOrCreateAsync_WhenAccountExists_DoesNotOverwriteIt()
    {
        await using var dbContext = CreateDbContext();
        var passwordService = new LocalAccountPasswordService();
        var store = CreateStore(dbContext, passwordService, new AuthenticationSettings
        {
            Local = new LocalAuthenticationSettings
            {
                BootstrapUsername = "bootstrap",
                BootstrapPassword = "Password1!"
            }
        });

        var existingAccount = new LocalAccountSettings { Username = "existing" };
        existingAccount.PasswordHash = passwordService.HashPassword(existingAccount, "Existing1!");
        await store.SaveAsync(existingAccount, TestContext.Current.CancellationToken);

        var account = await store.GetOrCreateAsync(TestContext.Current.CancellationToken);

        Assert.NotNull(account);
        Assert.Equal("existing", account.Username);
        Assert.True(passwordService.VerifyPassword(account, "Existing1!"));
        Assert.False(passwordService.VerifyPassword(account, "Password1!"));
        Assert.Equal(1, await dbContext.ElfConfiguration.CountAsync(TestContext.Current.CancellationToken));
    }

    [Fact]
    public async Task GetOrCreateAsync_WhenBootstrapPasswordIsMissing_ReturnsNull()
    {
        await using var dbContext = CreateDbContext();
        var store = CreateStore(dbContext);

        var account = await store.GetOrCreateAsync(TestContext.Current.CancellationToken);

        Assert.Null(account);
        Assert.Empty(await dbContext.ElfConfiguration.ToListAsync(TestContext.Current.CancellationToken));
    }

    [Fact]
    public async Task GetAsync_WhenStoredJsonIsInvalid_ReturnsNull()
    {
        await using var dbContext = CreateDbContext();
        dbContext.ElfConfiguration.Add(new ElfConfigurationEntity
        {
            CfgKey = LocalAccountStore.ConfigurationKey,
            CfgValue = "{not-json"
        });
        await dbContext.SaveChangesAsync(TestContext.Current.CancellationToken);
        var store = CreateStore(dbContext);

        var account = await store.GetAsync(TestContext.Current.CancellationToken);

        Assert.Null(account);
    }

    private static LocalAccountStore CreateStore(
        ElfDbContext dbContext,
        ILocalAccountPasswordService passwordService = null,
        AuthenticationSettings authenticationSettings = null)
    {
        return new LocalAccountStore(
            dbContext,
            Options.Create(authenticationSettings ?? new AuthenticationSettings()),
            passwordService ?? new LocalAccountPasswordService(),
            NullLogger<LocalAccountStore>.Instance);
    }

    private static ElfDbContext CreateDbContext()
    {
        var options = new DbContextOptionsBuilder<ElfDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        return new ElfDbContext(options);
    }
}
