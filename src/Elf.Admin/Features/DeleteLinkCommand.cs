using Elf.Admin.Data;
using LiteBus.Commands.Abstractions;

namespace Elf.Api.Features;

public record DeleteLinkCommand(int Id) : ICommand;

public class DeleteLinkCommandHandler(ElfDbContext dbContext) : ICommandHandler<DeleteLinkCommand>
{
    public async Task HandleAsync(DeleteLinkCommand request, CancellationToken ct)
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