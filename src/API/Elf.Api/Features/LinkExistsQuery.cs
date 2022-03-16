using Elf.Api.Data;
using Microsoft.EntityFrameworkCore;

namespace Elf.Api.Features;

public record LinkExistsQuery(string Token) : IRequest<bool>;

public class LinkExistsQueryHandler : IRequestHandler<LinkExistsQuery, bool>
{
    private readonly ElfDbContext _dbContext;

    public LinkExistsQueryHandler(ElfDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public Task<bool> Handle(LinkExistsQuery request, CancellationToken cancellationToken)
    {
        return string.IsNullOrWhiteSpace(request.Token) ?
            Task.FromResult(false) :
            _dbContext.Link.AnyAsync(p => p.FwToken == request.Token, cancellationToken);
    }
}