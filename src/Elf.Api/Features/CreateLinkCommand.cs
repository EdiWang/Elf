using Elf.Api.Data;
using Elf.Api.TokenGenerator;
using Microsoft.EntityFrameworkCore;

namespace Elf.Api.Features;

public record CreateLinkCommand(CreateLinkRequest CreateLinkRequest) : IRequest<string>;

public class CreateLinkCommandHandler : IRequestHandler<CreateLinkCommand, string>
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

    public async Task<string> Handle(CreateLinkCommand request, CancellationToken cancellationToken)
    {
        var l = await _dbContext.Link.FirstOrDefaultAsync(p => p.OriginUrl == request.CreateLinkRequest.OriginUrl, cancellationToken);
        var tempToken = l?.FwToken;
        if (tempToken is not null)
        {
            if (_tokenGenerator.TryParseToken(tempToken, out var tk))
            {
                _logger.LogInformation($"Link already exists for token '{tk}'");
                return tk;
            }

            string message = $"Invalid token '{tempToken}' found for existing url '{request.CreateLinkRequest.OriginUrl}'";
            _logger.LogError(message);
        }

        string token;
        do
        {
            token = _tokenGenerator.GenerateToken();
        } while (await _dbContext.Link.AnyAsync(p => p.FwToken == token, cancellationToken));

        _logger.LogInformation($"Generated Token '{token}' for url '{request.CreateLinkRequest.OriginUrl}'");

        var link = new LinkEntity
        {
            FwToken = token,
            IsEnabled = request.CreateLinkRequest.IsEnabled,
            Note = request.CreateLinkRequest.Note,
            AkaName = request.CreateLinkRequest.AkaName,
            OriginUrl = request.CreateLinkRequest.OriginUrl,
            UpdateTimeUtc = DateTime.UtcNow,
            TTL = request.CreateLinkRequest.TTL,
            TenantId = request.CreateLinkRequest.TenantId
        };

        await _dbContext.AddAsync(link, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return link.FwToken;
    }
}