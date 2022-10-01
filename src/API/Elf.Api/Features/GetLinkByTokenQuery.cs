using Elf.Api.Data;
using Microsoft.EntityFrameworkCore;

namespace Elf.Api.Features;

public record GetLinkByTokenQuery(string Token) : IRequest<LinkEntity>;

public class GetLinkByTokenQueryHandler : IRequestHandler<GetLinkByTokenQuery, LinkEntity>
{
    private readonly ElfDbContext _dbContext;

    public GetLinkByTokenQueryHandler(ElfDbContext dbContext) => _dbContext = dbContext;

    public Task<LinkEntity> Handle(GetLinkByTokenQuery request, CancellationToken ct) => 
        _dbContext.Link.FirstOrDefaultAsync(p => p.FwToken == request.Token, ct);
}