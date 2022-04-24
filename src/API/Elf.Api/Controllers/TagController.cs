namespace Elf.Api.Controllers;

[ApiController]
public class TagController : ControllerBase
{
    private readonly IMediator _mediator;

    public TagController(IMediator mediator) => _mediator = mediator;

    
}