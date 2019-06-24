using System.Threading.Tasks;
using LinkForwarder.Services;
using LinkForwarder.Services.Entities;
using LinkForwarder.Services.Models;
using LinkForwarder.Web.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;

namespace LinkForwarder.Web.Controllers
{
    [Authorize]
    [Route("link")]
    public class LinkController : Controller
    {
        private readonly ILogger<LinkController> _logger;
        private readonly ILinkForwarderService _linkForwarderService;
        private readonly ILinkVerifier _linkVerifier;
        private readonly IMemoryCache _cache;

        public LinkController(
            ILogger<LinkController> logger,
            ILinkForwarderService linkForwarderService,
            ILinkVerifier linkVerifier,
            IMemoryCache cache)
        {
            _logger = logger;
            _linkForwarderService = linkForwarderService;
            _linkVerifier = linkVerifier;
            _cache = cache;
        }

        #region Management

        [Route("manage")]
        public IActionResult Manage()
        {
            return View();
        }

        [Route("report")]
        public IActionResult Report()
        {
            return View();
        }

        [Route("tracking-count-past-week")]
        public async Task<IActionResult> TrackingCountPastWeek()
        {
            var response = await _linkForwarderService.GetLinkTrackingDateCount(7);
            if (!response.IsSuccess)
            {
                Response.StatusCode = StatusCodes.Status500InternalServerError;
            }

            return Json(response);
        }

        [Route("client-type-past-month")]
        public async Task<IActionResult> ClientTypePastMonth()
        {
            var response = await _linkForwarderService.GetClientTypeCounts(30);
            if (!response.IsSuccess)
            {
                Response.StatusCode = StatusCodes.Status500InternalServerError;
            }

            return Json(response);
        }

        [Route("most-requested-links-past-month")]
        public async Task<IActionResult> MostRequestedLinksPastMonth()
        {
            var response = await _linkForwarderService.GetMostRequestedLinkCount(30);
            if (!response.IsSuccess)
            {
                Response.StatusCode = StatusCodes.Status500InternalServerError;
            }

            return Json(response);
        }

        [Route("recent-requests")]
        public async Task<IActionResult> RecentRequests()
        {
            var response = await _linkForwarderService.GetRecentRequests(64);
            if (!response.IsSuccess)
            {
                Response.StatusCode = StatusCodes.Status500InternalServerError;
            }

            return Json(new { Data = response.Item });
        }

        [HttpPost]
        [Route("list")]
        public async Task<IActionResult> List(DataTableRequest model)
        {
            var searchBy = model.Search?.Value;
            var take = model.Length;
            var offset = model.Start;

            var response = await _linkForwarderService.GetPagedLinksAsync(offset, take, searchBy);
            if (response.IsSuccess)
            {
                var jqdtResponse = new JqDataTableResponse<Link>
                {
                    Draw = model.Draw,
                    RecordsFiltered = response.Item.TotalRows,
                    RecordsTotal = response.Item.TotalRows,
                    Data = response.Item.Links
                };
                return Json(jqdtResponse);
            }
            return new StatusCodeResult(StatusCodes.Status500InternalServerError);
        }

        [HttpPost]
        [Route("create")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(LinkEditModel model)
        {
            if (ModelState.IsValid)
            {
                var verifyResult = _linkVerifier.Verify(model.OriginUrl, Url, Request);
                switch (verifyResult)
                {
                    case LinkVerifyResult.InvalidFormat:
                        return BadRequest("Not a valid URL.");
                    case LinkVerifyResult.InvalidLocal:
                        return BadRequest("Can not use local URL.");
                    case LinkVerifyResult.InvalidSelfReference:
                        return BadRequest("Can not use url pointing to this site.");
                }

                var createLinkRequest = new CreateLinkRequest
                {
                    OriginUrl = model.OriginUrl,
                    Note = model.Note,
                    AkaName = string.IsNullOrWhiteSpace(model.AkaName) ? null : model.AkaName,
                    IsEnabled = model.IsEnabled
                };

                var response = await _linkForwarderService.CreateLinkAsync(createLinkRequest);
                return Json(response);
            }
            return BadRequest("Invalid ModelState");
        }

        [Route("get-edit-model/{id}")]
        public async Task<IActionResult> GetEditModel(int id)
        {
            var linkResponse = await _linkForwarderService.GetLinkAsync(id);
            if (!linkResponse.IsSuccess)
            {
                return new StatusCodeResult(StatusCodes.Status500InternalServerError);
            }

            if (null == linkResponse.Item)
            {
                return NotFound();
            }

            var model = new LinkEditModel
            {
                Id = linkResponse.Item.Id,
                Note = linkResponse.Item.Note,
                AkaName = linkResponse.Item.AkaName,
                OriginUrl = linkResponse.Item.OriginUrl,
                IsEnabled = linkResponse.Item.IsEnabled
            };

            return Json(model);
        }

        [HttpPost("edit")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(LinkEditModel model)
        {
            if (ModelState.IsValid)
            {
                var verifyResult = _linkVerifier.Verify(model.OriginUrl, Url, Request);
                switch (verifyResult)
                {
                    case LinkVerifyResult.InvalidFormat:
                        return BadRequest("Not a valid URL.");
                    case LinkVerifyResult.InvalidLocal:
                        return BadRequest("Can not use local URL.");
                    case LinkVerifyResult.InvalidSelfReference:
                        return BadRequest("Can not use url pointing to this site.");
                }

                var editRequest = new EditLinkRequest(model.Id)
                {
                    NewUrl = model.OriginUrl,
                    Note = model.Note,
                    AkaName = string.IsNullOrWhiteSpace(model.AkaName) ? null : model.AkaName,
                    IsEnabled = model.IsEnabled
                };

                var response = await _linkForwarderService.EditLinkAsync(editRequest);
                if (response.IsSuccess)
                {
                    _cache.Remove(response.Item);
                }
                return Json(response);
            }
            return BadRequest("Invalid ModelState");
        }

        [Route("delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteLink(int linkId)
        {
            var linkResponse = await _linkForwarderService.GetLinkAsync(linkId);
            if (!linkResponse.IsSuccess)
            {
                return new StatusCodeResult(StatusCodes.Status500InternalServerError);
            }

            if (null == linkResponse.Item)
            {
                return BadRequest();
            }

            var response = await _linkForwarderService.DeleteLink(linkId);

            if (response.IsSuccess)
            {
                _cache.Remove(linkResponse.Item);
                return Content(linkId.ToString());
            }
            return new StatusCodeResult(StatusCodes.Status500InternalServerError);
        }

        [Route("clear-tracking-data")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> ClearTrackingData(int nonce)
        {
            var response = await _linkForwarderService.ClearTrackingDataAsync();
            if (!response.IsSuccess)
            {
                Response.StatusCode = StatusCodes.Status500InternalServerError;
            }
            return Json(response);
        }

        #endregion
    }
}
