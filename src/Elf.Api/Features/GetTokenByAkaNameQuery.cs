using Dapper;
using LiteBus.Queries.Abstractions;
using System.Data;

namespace Elf.Api.Features;

public record GetTokenByAkaNameQuery(string AkaName) : IQuery<string>;

public class GetTokenByAkaNameQueryHandler(IDbConnection dbConnection) : IQueryHandler<GetTokenByAkaNameQuery, string>
{
    public async Task<string> HandleAsync(GetTokenByAkaNameQuery message, CancellationToken ct = default)
    {
        const string sql = @"
            SELECT FwToken
            FROM Link 
            WHERE AkaName = @AkaName";

        return await dbConnection.QueryFirstOrDefaultAsync<string>(sql, new { message.AkaName });
    }
}