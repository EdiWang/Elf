using Elf.Api.Data;
using Microsoft.EntityFrameworkCore;

namespace Elf.Api.Features;

public record GetTokenByAkaNameQuery(string AkaName) : IRequest<string>;

public class GetTokenByAkaNameQueryHandler(ElfDbContext dbContext) : IRequestHandler<GetTokenByAkaNameQuery, string>
{
    public async Task<string> Handle(GetTokenByAkaNameQuery request, CancellationToken ct)
    {
        var link = await dbContext.Link.FirstOrDefaultAsync(p => p.AkaName == request.AkaName, ct);

        return link?.FwToken;
    }
}