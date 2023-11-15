using Elf.Api.Data;
using Elf.Shared;
using Microsoft.EntityFrameworkCore;

namespace Elf.Api.Features;

public record UpdateTagCommand(int Id, UpdateTagRequest Payload) : IRequest<int>;

public class UpdateTagCommandHandler(ElfDbContext dbContext) : IRequestHandler<UpdateTagCommand, int>
{
    public async Task<int> Handle(UpdateTagCommand request, CancellationToken ct)
    {
        var (id, payload) = request;
        int result = await dbContext.Tag.Where(p => p.Id == id)
            .ExecuteUpdateAsync(t => t.SetProperty(x => x.Name, x => payload.Name.Trim()), cancellationToken: ct);

        return result == 0 ? -1 : 0;
    }
}