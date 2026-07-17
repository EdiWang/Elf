using Elf.Data;
using LiteBus.Queries.Abstractions;
using Microsoft.EntityFrameworkCore;

namespace Elf.Api.Features;

public record GetTokenByAkaNameQuery(string AkaName) : IQuery<string>;

public class GetTokenByAkaNameQueryHandler(ElfDbContext dbContext) : IQueryHandler<GetTokenByAkaNameQuery, string>
{
    public Task<string> HandleAsync(GetTokenByAkaNameQuery message, CancellationToken ct = default) =>
        dbContext.Link
            .AsNoTracking()
            .Where(link => link.AkaName == message.AkaName)
            .Select(link => link.FwToken)
            .FirstOrDefaultAsync(ct);
}
