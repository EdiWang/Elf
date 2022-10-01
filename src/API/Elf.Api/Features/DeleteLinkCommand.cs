using Elf.Api.Data;

namespace Elf.Api.Features;

public record DeleteLinkCommand(int Id) : IRequest;

public class DeleteLinkCommandHandler : AsyncRequestHandler<DeleteLinkCommand>
{
    private readonly ElfDbContext _dbContext;

    public DeleteLinkCommandHandler(ElfDbContext dbContext) => _dbContext = dbContext;

    protected override async Task Handle(DeleteLinkCommand request, CancellationToken ct)
    {
        var link = await _dbContext.Link.FindAsync(request.Id);
        if (link != null)
        {
            link.Tags.Clear();
            _dbContext.Remove(link);
            await _dbContext.SaveChangesAsync(ct);
        }
    }
};