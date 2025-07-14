using Elf.Api.Data;
using LiteBus.Commands.Abstractions;
using Microsoft.EntityFrameworkCore;

namespace Elf.Api.Features;

public record DeleteTagCommand(int Id) : ICommand<int>;

public class DeleteTagCommandHandler(ElfDbContext dbContext) : ICommandHandler<DeleteTagCommand, int>
{
    public async Task<int> HandleAsync(DeleteTagCommand request, CancellationToken ct) =>
         await dbContext.Tag.Where(p => p.Id == request.Id).ExecuteDeleteAsync(cancellationToken: ct) == 0 ? -1 : 0;
}