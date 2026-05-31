using Elf.Api.Services;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.Net.Http.Headers;
using System.Net;

namespace Elf.Api.Tests;

public class IPLocationServiceTests
{
    [Fact]
    public async Task GetLocationAsync_UsesPerRequestUserAgentWithoutMutatingDefaultHeaders()
    {
        var handler = new RecordingHandler();
        var httpClient = new HttpClient(handler);
        var service = new IPLocationService(httpClient, NullLogger<IPLocationService>.Instance);

        await service.GetLocationAsync("203.0.113.10", "agent-one", TestContext.Current.CancellationToken);
        await service.GetLocationAsync("203.0.113.10", "agent-two", TestContext.Current.CancellationToken);

        Assert.Empty(httpClient.DefaultRequestHeaders.UserAgent);
        Assert.Equal(["agent-one", "agent-two"], handler.UserAgents);
    }

    private sealed class RecordingHandler : HttpMessageHandler
    {
        public List<string> UserAgents { get; } = [];

        protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            UserAgents.Add(string.Join(" ", request.Headers.GetValues(HeaderNames.UserAgent)));

            return Task.FromResult(new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent("{}")
            });
        }
    }
}
