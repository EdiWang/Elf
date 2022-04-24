using Elf.Api.Data;
using Elf.Api.Features;

namespace Elf.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class TagController : ControllerBase
{
    private readonly IMediator _mediator;

    public TagController(IMediator mediator) => _mediator = mediator;

    [HttpGet("list")]
    [ProducesResponseType(typeof(List<TagEntity>), StatusCodes.Status200OK)]
    public async Task<IActionResult> List()
    {
        var list = await _mediator.Send(new GetTagsQuery());
        return Ok(list);
    }

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create(CreateTagCommand command)
    {
        await _mediator.Send(command);
        return NoContent();
    }
}