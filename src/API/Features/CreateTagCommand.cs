using Elf.Api.Data;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace Elf.Api.Features;

public record CreateTagCommand([Required][MaxLength(32)] string Name) : IRequest;

public class CreateTagCommandHandler(ElfDbContext dbContext) : IRequestHandler<CreateTagCommand>
{
    public async Task Handle(CreateTagCommand request, CancellationToken ct)
    {
        var exists = await dbContext.Tag.AnyAsync(p => p.Name == request.Name, ct);
        if (exists) return;

        var tag = new TagEntity
        {
            Name = request.Name.Trim()
        };

        await dbContext.AddAsync(tag, ct);
        await dbContext.SaveChangesAsync(ct);
    }
}