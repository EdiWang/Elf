namespace Elf.Api.Features;

public record DeleteTagCommand(int Id) : IRequest<int>;