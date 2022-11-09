using Elf.Api.Data;
using Microsoft.EntityFrameworkCore;

namespace Elf.Api.Features;

public record DeleteTagCommand(int Id) : IRequest<int>;

public class DeleteTagCommandHandler : IRequestHandler<DeleteTagCommand, int>
{
    private readonly ElfDbContext _dbContext;

    public DeleteTagCommandHandler(ElfDbContext dbContext) => _dbContext = dbContext;

    public async Task<int> Handle(DeleteTagCommand request, CancellationToken ct) =>
         await _dbContext.Tag.Where(p => p.Id == request.Id).ExecuteDeleteAsync(cancellationToken: ct) == 0 ? -1 : 0;
}