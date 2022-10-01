using Elf.Api.Data;

namespace Elf.Api.Features;

public record DeleteTagCommand(int Id) : IRequest<int>;

public class DeleteTagCommandHandler : IRequestHandler<DeleteTagCommand, int>
{
    private readonly ElfDbContext _dbContext;

    public DeleteTagCommandHandler(ElfDbContext dbContext) => _dbContext = dbContext;

    public async Task<int> Handle(DeleteTagCommand request, CancellationToken ct)
    {
        var tag = await _dbContext.Tag.FindAsync(request.Id);
        if (null == tag) return -1;

        _dbContext.Remove(tag);
        await _dbContext.SaveChangesAsync(ct);
        return 0;
    }
}