using Elf.Admin.Data;
using Elf.Admin.Models;
using LiteBus.Commands.Abstractions;
using Microsoft.EntityFrameworkCore;

namespace Elf.Admin.Features;

public record UpdateTagCommand(int Id, UpdateTagRequest Payload) : ICommand<int>;

public class UpdateTagCommandHandler(ElfDbContext dbContext) : ICommandHandler<UpdateTagCommand, int>
{
    public async Task<int> HandleAsync(UpdateTagCommand request, CancellationToken ct)
    {
        var (id, payload) = request;
        int result = await dbContext.Tag.Where(p => p.Id == id)
            .ExecuteUpdateAsync(t => t.SetProperty(x => x.Name, x => payload.Name.Trim()), cancellationToken: ct);

        return result == 0 ? -1 : 0;
    }
}