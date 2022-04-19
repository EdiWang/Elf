using Elf.Api.Data;
using Elf.Api.TokenGenerator;
using Microsoft.EntityFrameworkCore;

namespace Elf.Api.Features;

public record CreateLinkCommand(LinkEditModel Payload) : IRequest;

public class CreateLinkCommandHandler : AsyncRequestHandler<CreateLinkCommand>
{
    private readonly ElfDbContext _dbContext;
    private readonly ITokenGenerator _tokenGenerator;
    private readonly ILogger<CreateLinkCommandHandler> _logger;

    public CreateLinkCommandHandler(
        ElfDbContext dbContext, ITokenGenerator tokenGenerator, ILogger<CreateLinkCommandHandler> logger)
    {
        _dbContext = dbContext;
        _tokenGenerator = tokenGenerator;
        _logger = logger;
    }

    protected override async Task Handle(CreateLinkCommand request, CancellationToken cancellationToken)
    {
        var l = await _dbContext.Link.FirstOrDefaultAsync(p => p.OriginUrl == request.Payload.OriginUrl, cancellationToken);
        var tempToken = l?.FwToken;
        if (tempToken is not null)
        {
            if (_tokenGenerator.TryParseToken(tempToken, out var tk))
            {
                _logger.LogInformation($"Link already exists for token '{tk}'");
                return;
            }

            var message = $"Invalid token '{tempToken}' found for existing url '{request.Payload.OriginUrl}'";
            _logger.LogError(message);
        }

        string token;
        do
        {
            token = _tokenGenerator.GenerateToken();
        } while (await _dbContext.Link.AnyAsync(p => p.FwToken == token, cancellationToken));

        _logger.LogInformation($"Generated Token '{token}' for url '{request.Payload.OriginUrl}'");

        var link = new LinkEntity
        {
            FwToken = token,
            IsEnabled = request.Payload.IsEnabled,
            Note = request.Payload.Note,
            AkaName = string.IsNullOrWhiteSpace(request.Payload.AkaName) ? null : request.Payload.AkaName,
            OriginUrl = request.Payload.OriginUrl,
            UpdateTimeUtc = DateTime.UtcNow,
            TTL = request.Payload.TTL
        };

        await _dbContext.AddAsync(link, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }
}