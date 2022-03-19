using System.ComponentModel.DataAnnotations;
using Elf.Api.Features;

namespace Elf.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ReportController : ControllerBase
{
    private readonly IConfiguration _configuration;
    private readonly IMediator _mediator;

    public ReportController(IConfiguration configuration, IMediator mediator)
    {
        _configuration = configuration;
        _mediator = mediator;
    }

    [HttpGet("requests/recent/{top:int}")]
    [ProducesResponseType(typeof(IReadOnlyList<RequestTrack>), StatusCodes.Status200OK)]
    public async Task<IActionResult> RecentRequests([Range(1, 128)] int top)
    {
        var requests = await _mediator.Send(new GetRecentRequestsQuery(top));
        return Ok(requests);
    }

    [HttpGet("requests/mostpastmonth/{daysFromNow:int}")]
    [ProducesResponseType(typeof(IReadOnlyList<MostRequestedLinkCount>), StatusCodes.Status200OK)]
    public async Task<IActionResult> MostRequestedLinks([Range(1, 90)] int daysFromNow)
    {
        var linkCounts = await _mediator.Send(new GetMostRequestedLinkCountQuery(daysFromNow));
        return Ok(linkCounts);
    }

    [HttpGet("requests/clienttype/{daysFromNow:int}")]
    [ProducesResponseType(typeof(IReadOnlyList<ClientTypeCount>), StatusCodes.Status200OK)]
    public async Task<IActionResult> ClientType([Range(1, 90)] int daysFromNow)
    {
        var types = await _mediator.Send(new GetClientTypeCountsQuery(daysFromNow,
            _configuration.GetSection("AppSettings:TopClientTypes").Get<int>()));
        return Ok(types);
    }

    [HttpGet("tracking/pastweek/{daysFromNow:int}")]
    [ProducesResponseType(typeof(IReadOnlyList<LinkTrackingDateCount>), StatusCodes.Status200OK)]
    public async Task<IActionResult> TrackingCount([Range(1, 90)] int daysFromNow)
    {
        var dateCounts = await _mediator.Send(new GetLinkTrackingDateCountQuery(daysFromNow));
        return Ok(dateCounts);
    }

    [HttpDelete("tracking/clear")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> ClearTrackingData()
    {
        await _mediator.Send(new ClearTrackingDataCommand());
        return NoContent();
    }
}
