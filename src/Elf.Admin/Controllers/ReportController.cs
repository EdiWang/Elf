using Elf.Admin.Features;
using Elf.Admin.Models;
using Elf.Shared.Models;
using LiteBus.Commands.Abstractions;
using LiteBus.Queries.Abstractions;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace Elf.Admin.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReportController(
    IConfiguration configuration,
    ICommandMediator commandMediator,
    IQueryMediator queryMediator) : ControllerBase
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
        var linkCounts = await queryMediator.QueryAsync(new GetMostRequestedLinkCountQuery(request));
        return Ok(linkCounts);
    }

    [HttpPost("requests/clienttype")]
    [ProducesResponseType<List<ClientTypeCount>>(StatusCodes.Status200OK)]
    public async Task<IActionResult> ClientType(DateRangeRequest request)
    {
        var types = await queryMediator.QueryAsync(new GetClientTypeCountsQuery(request,
            int.Parse(configuration["TopClientTypes"]!)));
        return Ok(types);
    }

    [HttpPost("tracking")]
    [ProducesResponseType<List<LinkTrackingDateCount>>(StatusCodes.Status200OK)]
    public async Task<IActionResult> TrackingCount(DateRangeRequest request)
    {
        var dateCounts = await queryMediator.QueryAsync(new GetLinkTrackingDateCountQuery(request));
        return Ok(dateCounts);
    }

    [HttpDelete("tracking/clear")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> ClearTrackingData()
    {
        await commandMediator.SendAsync(new ClearTrackingDataCommand());
        return NoContent();
    }
}