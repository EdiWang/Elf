using System.ComponentModel.DataAnnotations;
using Elf.Api.Features;

namespace Elf.Api.Controllers;

//[Authorize]
[ApiController]
[Route("api/[controller]")]
public class TagController : ControllerBase
{
    private readonly IMediator _mediator;

    public TagController(IMediator mediator) => _mediator = mediator;

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create(CreateTagCommand command)
    {
        await _mediator.Send(command);
        return NoContent();
    }
}