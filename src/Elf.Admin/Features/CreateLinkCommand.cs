using Elf.Admin.Data;
using Elf.Shared;
using Elf.TokenGenerator;
using LiteBus.Commands.Abstractions;
using Microsoft.EntityFrameworkCore;

namespace Elf.Admin.Features;

public record CreateLinkCommand(LinkEditModel Payload) : ICommand;

public class CreateLinkCommandHandler(
    ElfDbContext dbContext,
    ITokenGenerator tokenGenerator,
    ILogger<CreateLinkCommandHandler> logger) : ICommandHandler<CreateLinkCommand>
{
    public async Task HandleAsync(CreateLinkCommand request, CancellationToken ct)
    {
        var l = await dbContext.Link.FirstOrDefaultAsync(p => p.OriginUrl == request.Payload.OriginUrl, ct);
        var tempToken = l?.FwToken;
        if (tempToken is not null)
        {
            if (tokenGenerator.TryParseToken(tempToken, out var tk))
            {
                logger.LogInformation($"Link already exists for token '{tk}'");
                return;
            }

            var message = $"Invalid token '{tempToken}' found for existing url '{request.Payload.OriginUrl}'";
            logger.LogError(message);
        }

        string token;
        do
        {
            token = tokenGenerator.GenerateToken();
        } while (await dbContext.Link.AnyAsync(p => p.FwToken == token, ct));

        logger.LogInformation($"Generated Token '{token}' for url '{request.Payload.OriginUrl}'");

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

        if (request.Payload.Tags is { Length: > 0 })
        {
            foreach (var item in request.Payload.Tags)
            {
                var tag = await dbContext.Tag.FirstOrDefaultAsync(q => q.Name == item, ct);
                if (tag == null)
                {
                    TagEntity t = new() { Name = item };
                    await dbContext.Tag.AddAsync(t, ct);
                    await dbContext.SaveChangesAsync(ct);

                    tag = t;
                }

                link.Tags.Add(tag);
            }
        }

        await dbContext.AddAsync(link, ct);
        await dbContext.SaveChangesAsync(ct);
    }
}