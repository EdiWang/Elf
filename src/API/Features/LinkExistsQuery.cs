using Elf.Api.Data;
using Microsoft.EntityFrameworkCore;

namespace Elf.Api.Features;

public record LinkExistsQuery(string Token) : IRequest<bool>;

public class LinkExistsQueryHandler(ElfDbContext dbContext) : IRequestHandler<LinkExistsQuery, bool>
{
    public Task<bool> Handle(LinkExistsQuery request, CancellationToken ct) =>
        string.IsNullOrWhiteSpace(request.Token) ?
            Task.FromResult(false) :
            dbContext.Link.AnyAsync(p => p.FwToken == request.Token, ct);
}