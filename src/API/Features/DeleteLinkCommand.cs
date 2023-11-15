using Elf.Api.Data;

namespace Elf.Api.Features;

public record DeleteLinkCommand(int Id) : IRequest;

public class DeleteLinkCommandHandler(ElfDbContext dbContext) : IRequestHandler<DeleteLinkCommand>
{
    public async Task Handle(DeleteLinkCommand request, CancellationToken ct)
    {
        var link = await dbContext.Link.FindAsync(request.Id);
        if (link != null)
        {
            link.Tags.Clear();
            dbContext.Remove(link);
            await dbContext.SaveChangesAsync(ct);
        }
    }
};