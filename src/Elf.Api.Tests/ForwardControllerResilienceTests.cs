using Elf.Api.Controllers;
using Elf.Api.Services;
using Elf.Data;
using Elf.Shared;
using Elf.TokenGenerator;
using LiteBus.Queries.Abstractions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.Extensions.Options;
using Microsoft.FeatureManagement;

namespace Elf.Api.Tests;

public class ForwardControllerResilienceTests
{
    [Fact]
    public async Task Forward_WhenStoredOriginUrlIsInvalid_ReturnsDefaultRedirectWithoutThrowing()
    {
        var controller = CreateController(
            new LinkEntity
            {
                Id = 1,
                OriginUrl = "not-a-url",
                FwToken = "abc12345",
                IsEnabled = true
            },
            new SequenceLinkVerifier(LinkVerifyResult.InvalidFormat, LinkVerifyResult.Valid),
            new Dictionary<string, string> { ["DefaultRedirectionUrl"] = "https://example.com/fallback" });

        var result = await controller.Forward("abc12345");

        var redirect = Assert.IsType<RedirectResult>(result);
        Assert.Equal("https://example.com/fallback", redirect.Url);
    }

    [Fact]
    public async Task Forward_WhenDefaultRedirectionUrlIsInvalid_ReturnsNotFoundWithoutThrowing()
    {
        var controller = CreateController(
            link: null,
            new SequenceLinkVerifier(LinkVerifyResult.InvalidFormat),
            new Dictionary<string, string> { ["DefaultRedirectionUrl"] = "not-a-url" });

        var result = await controller.Forward("abc12345");

        Assert.IsType<NotFoundResult>(result);
    }

    private static ForwardController CreateController(
        LinkEntity link,
        ILinkVerifier linkVerifier,
        IReadOnlyDictionary<string, string> configurationValues)
    {
        var configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(configurationValues)
            .Build();

        var controller = new ForwardController(
            NullLogger<ForwardController>.Instance,
            configuration,
            new ShortGuidTokenGenerator(),
            CreateCache(),
            linkVerifier,
            new DisabledFeatureManager(),
            new StaticQueryMediator(link),
            new NoopBackgroundTaskQueue());

        controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext()
        };
        controller.Request.Headers.UserAgent = "test-agent";

        return controller;
    }

    private static IDistributedCache CreateCache() =>
        new MemoryDistributedCache(Options.Create(new MemoryDistributedCacheOptions()));

    private sealed class StaticQueryMediator(LinkEntity link) : IQueryMediator
    {
        public Task<TQueryResult> QueryAsync<TQueryResult>(IQuery<TQueryResult> query, QueryMediationSettings settings, CancellationToken cancellationToken = default)
        {
            return Task.FromResult((TQueryResult)(object)link);
        }

        public IAsyncEnumerable<TQueryResult> StreamAsync<TQueryResult>(IStreamQuery<TQueryResult> query, QueryMediationSettings settings, CancellationToken cancellationToken = default)
        {
            return AsyncEnumerable.Empty<TQueryResult>();
        }
    }

    private sealed class SequenceLinkVerifier(params LinkVerifyResult[] results) : ILinkVerifier
    {
        private int _index;

        public LinkVerifyResult Verify(string url, IUrlHelper urlHelper, HttpRequest currentRequest, bool allowSelfRedirection = false)
        {
            var result = results[Math.Min(_index, results.Length - 1)];
            _index++;
            return result;
        }
    }

    private sealed class DisabledFeatureManager : IFeatureManager
    {
        public IAsyncEnumerable<string> GetFeatureNamesAsync() => AsyncEnumerable.Empty<string>();

        public Task<bool> IsEnabledAsync(string feature) => Task.FromResult(false);

        public Task<bool> IsEnabledAsync<TContext>(string feature, TContext context) => Task.FromResult(false);
    }

    private sealed class NoopBackgroundTaskQueue : IBackgroundTaskQueue
    {
        public bool TryQueue(Func<IServiceProvider, CancellationToken, ValueTask> workItem) => true;

        public ValueTask<Func<IServiceProvider, CancellationToken, ValueTask>> DequeueAsync(CancellationToken cancellationToken) =>
            throw new NotSupportedException();
    }
}
