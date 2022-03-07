using Elf.Api.Data;

namespace Elf.Api.Features;

public record SetEnableCommand(int Id, bool IsEnabled) : IRequest;

public class SetEnableCommandHandler:IRequestHandler<SetEnableCommand>
{
    private readonly ElfDbContext _dbContext;

    public SetEnableCommandHandler(ElfDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<Unit> Handle(SetEnableCommand request, CancellationToken cancellationToken)
    {
        var (id, isEnabled) = request;

        var link = await _dbContext.Link.FindAsync(id);
        if (link is null) return Unit.Value;

        link.IsEnabled = isEnabled;
        await _dbContext.SaveChangesAsync(cancellationToken);
        return Unit.Value;
    }
}