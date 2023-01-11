using Elf.Api.Features;
using System.ComponentModel.DataAnnotations;

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

    [HttpGet("requests")]
    [ProducesResponseType(typeof(PagedRequestTrack), StatusCodes.Status200OK)]
    public async Task<IActionResult> Requests(
        [Range(1, int.MaxValue)] int take,
        [Range(0, int.MaxValue)] int offset)
    {
        var (requests, totalRows) = await _mediator.Send(new GetRecentRequestsQuery(offset, take));

        var result = new PagedRequestTrack
        {
            RequestTracks = requests,
            TotalRows = totalRows,
            PageSize = take
        };

        return Ok(result);
    }

    [HttpPost("requests/link")]
    [ProducesResponseType(typeof(IReadOnlyList<MostRequestedLinkCount>), StatusCodes.Status200OK)]
    public async Task<IActionResult> MostRequestedLinks(DateRangeRequest request)
    {
        var linkCounts = await _mediator.Send(new GetMostRequestedLinkCountQuery(request));
        return Ok(linkCounts);
    }

    [HttpPost("requests/clienttype")]
    [ProducesResponseType(typeof(IReadOnlyList<ClientTypeCount>), StatusCodes.Status200OK)]
    public async Task<IActionResult> ClientType(DateRangeRequest request)
    {
        var types = await _mediator.Send(new GetClientTypeCountsQuery(request,
            _configuration.GetSection("AppSettings:TopClientTypes").Get<int>()));
        return Ok(types);
    }

    [HttpPost("tracking")]
    [ProducesResponseType(typeof(IReadOnlyList<LinkTrackingDateCount>), StatusCodes.Status200OK)]
    public async Task<IActionResult> TrackingCount(DateRangeRequest request)
    {
        var dateCounts = await _mediator.Send(new GetLinkTrackingDateCountQuery(request));
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