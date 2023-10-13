using Elf.Api.Data;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace Elf.Api.Features;

public class UpdateTagRequest
{
    [Required]
    [MaxLength(32)]
    public string Name { get; set; }
}

public record UpdateTagCommand(int Id, UpdateTagRequest Payload) : IRequest<int>;

public class UpdateTagCommandHandler(ElfDbContext dbContext) : IRequestHandler<UpdateTagCommand, int>
{
    public async Task<int> Handle(UpdateTagCommand request, CancellationToken ct)
    {
        var (id, payload) = request;
        int result = await dbContext.Tag.Where(p => p.Id == id)
            .ExecuteUpdateAsync(t => t.SetProperty(x => x.Name, x => payload.Name.Trim()), cancellationToken: ct);

        return result == 0 ? -1 : 0;
    }
}