using Elf.Api.Data;

namespace Elf.Api.Features;

public record DeleteLinkCommand(int LinkId) : IRequest;

public class DeleteLinkCommandHandler : IRequestHandler<DeleteLinkCommand>
{
    private readonly ElfDbContext _dbContext;

    public DeleteLinkCommandHandler(ElfDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<Unit> Handle(DeleteLinkCommand request, CancellationToken cancellationToken)
    {
        var link = await _dbContext.Link.FindAsync(request.LinkId);
        if (link != null)
        {
            _dbContext.Remove(link);
            await _dbContext.SaveChangesAsync(cancellationToken);
        }

        return Unit.Value;
    }
};