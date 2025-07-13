using Elf.Api.Features;
using Elf.Shared;
using LiteBus.Queries.Abstractions;
using System.ComponentModel.DataAnnotations;

namespace Elf.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ReportController(IConfiguration configuration, IMediator mediator, IQueryMediator queryMediator) : ControllerBase
{
    [HttpGet("requests")]
    [ProducesResponseType<PagedRequestTrack>(StatusCodes.Status200OK)]
    public async Task<IActionResult> Requests(
        [Range(1, int.MaxValue)] int take,
        [Range(0, int.MaxValue)] int offset)
    {
        var (requests, totalRows) = await queryMediator.QueryAsync(new GetRecentRequestsQuery(offset, take));

        var result = new PagedRequestTrack
        {
            RequestTracks = requests,
            TotalRows = totalRows,
            PageSize = take
        };

        return Ok(result);
    }

    [HttpPost("requests/link")]
    [ProducesResponseType<List<MostRequestedLinkCount>>(StatusCodes.Status200OK)]
    public async Task<IActionResult> MostRequestedLinks(DateRangeRequest request)
    {
        var linkCounts = await mediator.Send(new GetMostRequestedLinkCountQuery(request));
        return Ok(linkCounts);
    }

    [HttpPost("requests/clienttype")]
    [ProducesResponseType<List<ClientTypeCount>>(StatusCodes.Status200OK)]
    public async Task<IActionResult> ClientType(DateRangeRequest request)
    {
        var types = await mediator.Send(new GetClientTypeCountsQuery(request,
            int.Parse(configuration["TopClientTypes"]!)));
        return Ok(types);
    }

    [HttpPost("tracking")]
    [ProducesResponseType<List<LinkTrackingDateCount>>(StatusCodes.Status200OK)]
    public async Task<IActionResult> TrackingCount(DateRangeRequest request)
    {
        var dateCounts = await mediator.Send(new GetLinkTrackingDateCountQuery(request));
        return Ok(dateCounts);
    }

    [HttpDelete("tracking/clear")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> ClearTrackingData()
    {
        await mediator.Send(new ClearTrackingDataCommand());
        return NoContent();
    }
}