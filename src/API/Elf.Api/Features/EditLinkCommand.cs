using Elf.Api.Data;
using Microsoft.EntityFrameworkCore;

namespace Elf.Api.Features;

public record EditLinkCommand(int Id, LinkEditModel Payload) : IRequest<string>;

public class EditLinkCommandHandler : IRequestHandler<EditLinkCommand, string>
{
    private readonly ElfDbContext _dbContext;

    public EditLinkCommandHandler(ElfDbContext dbContext) => _dbContext = dbContext;

    public async Task<string> Handle(EditLinkCommand request, CancellationToken cancellationToken)
    {
        var (id, payload) = request;

        var link = await _dbContext.Link.FindAsync(id);
        if (link is null) return null;

        link.OriginUrl = payload.OriginUrl;
        link.Note = payload.Note;
        link.AkaName = string.IsNullOrWhiteSpace(payload.AkaName) ? null : payload.AkaName;
        link.IsEnabled = payload.IsEnabled;
        link.TTL = payload.TTL;

        link.Tags.Clear();
        if (request.Payload.Tags is { Length: > 0 })
        {
            foreach (var item in request.Payload.Tags)
            {
                var tag = await _dbContext.Tag.FirstOrDefaultAsync(q => q.Name == item, cancellationToken);
                if (tag == null)
                {
                    TagEntity t = new() { Name = item };
                    await _dbContext.Tag.AddAsync(t, cancellationToken);
                    await _dbContext.SaveChangesAsync(cancellationToken);

                    tag = t;
                }

                link.Tags.Add(tag);
            }
        }

        await _dbContext.SaveChangesAsync(cancellationToken);
        return link.FwToken;
    }
}