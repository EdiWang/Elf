using Elf.Admin.Features;
using Elf.Admin.Models;
using LiteBus.Queries.Abstractions;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace Elf.Admin.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReportController(
    IConfiguration configuration,
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
    public async Task<IActionResult> ClientType(DateRangeRequest request, [Range(1, int.MaxValue)] int? linkId = null)
    {
        var topTypes = int.Parse(configuration["TopClientTypes"]!);

        if (linkId == null)
        {
            var types = await queryMediator.QueryAsync(new GetClientTypeCountsQuery(request, topTypes));
            return Ok(types);
        }
        else
        {
            var types = await queryMediator.QueryAsync(new GetClientTypeCountsByLinkIdQuery(linkId.Value, request, topTypes));
            return Ok(types);
        }
    }

    [HttpPost("tracking")]
    [ProducesResponseType<List<LinkTrackingDateCount>>(StatusCodes.Status200OK)]
    public async Task<IActionResult> TrackingCount(DateRangeRequest request, [Range(1, int.MaxValue)] int? linkId = null)
    {
        if (linkId == null)
        {
            var dateCounts = await queryMediator.QueryAsync(new GetLinkTrackingDateCountQuery(request));
            return Ok(dateCounts);
        }
        else
        {
            var dateCountsByLink = await queryMediator.QueryAsync(new GetLinkTrackingDateCountByLinkIdQuery(linkId.Value, request));
            return Ok(dateCountsByLink);
        }
    }
}