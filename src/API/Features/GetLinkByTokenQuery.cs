using Dapper;
using Elf.Api.Data;
using LiteBus.Queries.Abstractions;
using System.Data;

namespace Elf.Api.Features;

public record GetLinkByTokenQuery(string Token) : IQuery<LinkEntity>;

public class GetLinkByTokenQueryHandler(IDbConnection dbConnection) : IQueryHandler<GetLinkByTokenQuery, LinkEntity>
{
    public async Task<LinkEntity> HandleAsync(GetLinkByTokenQuery request, CancellationToken ct)
    {
        const string sql = @"
            SELECT Id, OriginUrl, FwToken, Note, IsEnabled, UpdateTimeUtc, AkaName, TTL
            FROM Link 
            WHERE FwToken = @Token";

        return await dbConnection.QueryFirstOrDefaultAsync<LinkEntity>(sql, new { request.Token });
    }
}