using Elf.Api.Data;

namespace Elf.Api.Features;

public record SetEnableCommand(int Id, bool IsEnabled) : IRequest;

public class SetEnableCommandHandler : AsyncRequestHandler<SetEnableCommand>
{
    private readonly ElfDbContext _dbContext;

    public SetEnableCommandHandler(ElfDbContext dbContext) => _dbContext = dbContext;

    protected override async Task Handle(SetEnableCommand request, CancellationToken cancellationToken)
    {
        var (id, isEnabled) = request;

        var link = await _dbContext.Link.FindAsync(id);
        if (link is null) return;

        link.IsEnabled = isEnabled;
        await _dbContext.SaveChangesAsync(cancellationToken);
    }
}