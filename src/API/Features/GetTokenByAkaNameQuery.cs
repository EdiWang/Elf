using Elf.Api.Data;
using LiteBus.Queries.Abstractions;
using Microsoft.EntityFrameworkCore;

namespace Elf.Api.Features;

public record GetTokenByAkaNameQuery(string AkaName) : IQuery<string>;

public class GetTokenByAkaNameQueryHandler(ElfDbContext dbContext) : IQueryHandler<GetTokenByAkaNameQuery, string>
{
    public async Task<string> HandleAsync(GetTokenByAkaNameQuery message, CancellationToken ct = default)
    {
        var link = await dbContext.Link.FirstOrDefaultAsync(p => p.AkaName == message.AkaName, ct);
        return link?.FwToken;
    }
}