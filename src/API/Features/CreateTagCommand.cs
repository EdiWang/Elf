using Elf.Api.Data;
using LiteBus.Commands.Abstractions;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace Elf.Api.Features;

public record CreateTagCommand([Required][MaxLength(32)] string Name) : ICommand;

public class CreateTagCommandHandler(ElfDbContext dbContext) : ICommandHandler<CreateTagCommand>
{
    public async Task HandleAsync(CreateTagCommand request, CancellationToken ct)
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