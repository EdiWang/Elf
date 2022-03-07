using Elf.Api.Data;
using Elf.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Elf.Api.Features;

public record EditLinkCommand(EditLinkRequest EditLinkRequest) : IRequest<string>;

public class EditLinkCommandHandler : IRequestHandler<EditLinkCommand, string>
{
    private readonly ElfDbContext _dbContext;

    public EditLinkCommandHandler(ElfDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<string> Handle(EditLinkCommand request, CancellationToken cancellationToken)
    {
        var link = await _dbContext.Link.FirstOrDefaultAsync(p => p.Id == request.EditLinkRequest.Id, cancellationToken);
        if (link is null) return null;

        link.OriginUrl = request.EditLinkRequest.NewUrl;
        link.Note = request.EditLinkRequest.Note;
        link.AkaName = request.EditLinkRequest.AkaName;
        link.IsEnabled = request.EditLinkRequest.IsEnabled;
        link.TTL = request.EditLinkRequest.TTL;

        await _dbContext.SaveChangesAsync(cancellationToken);
        return link.FwToken;
    }
}