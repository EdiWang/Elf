using Elf.Admin.Data;
using LiteBus.Commands.Abstractions;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace Elf.Admin.Features;

public record CreateTagCommand([Required][MaxLength(32)] string Name) : ICommand;

public class CreateTagCommandHandler(ElfDbContext dbContext) : ICommandHandler<CreateTagCommand>
{
    public async Task HandleAsync(CreateTagCommand request, CancellationToken ct)
    {
        var name = request.Name.Trim();

        var exists = await dbContext.Tag.AnyAsync(p => p.Name == name, ct);
        if (exists) return;

        var tag = new TagEntity
        {
            Name = name
        };

        await dbContext.AddAsync(tag, ct);
        try
        {
            await dbContext.SaveChangesAsync(ct);
        }
        catch (DbUpdateException ex) when (ex.IsUniqueConstraintViolation())
        {
            throw new DuplicateResourceException($"Tag '{name}' already exists.");
        }
    }
}