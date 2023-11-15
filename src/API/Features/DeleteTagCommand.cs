using Elf.Api.Data;
using Microsoft.EntityFrameworkCore;

namespace Elf.Api.Features;

public record DeleteTagCommand(int Id) : IRequest<int>;

public class DeleteTagCommandHandler(ElfDbContext dbContext) : IRequestHandler<DeleteTagCommand, int>
{
    public async Task<int> Handle(DeleteTagCommand request, CancellationToken ct) =>
         await dbContext.Tag.Where(p => p.Id == request.Id).ExecuteDeleteAsync(cancellationToken: ct) == 0 ? -1 : 0;
}