using Elf.Api.Data;
using Microsoft.EntityFrameworkCore;

namespace Elf.Api.Features;

public record EditLinkCommand(int Id, LinkEditModel Payload) : IRequest<string>;

public class EditLinkCommandHandler(ElfDbContext dbContext) : IRequestHandler<EditLinkCommand, string>
{
    public async Task<string> Handle(EditLinkCommand request, CancellationToken ct)
    {
        var (id, payload) = request;

        var link = await dbContext.Link.FindAsync(id);
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

        await dbContext.SaveChangesAsync(ct);
        return link.FwToken;
    }
}