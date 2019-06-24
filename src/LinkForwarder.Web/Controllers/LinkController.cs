using System;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using LinkForwarder.Services;
using LinkForwarder.Web.Filters;
using LinkForwarder.Web.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Primitives;
using Newtonsoft.Json;

namespace LinkForwarder.Web.Controllers
{
    [Authorize]
    [Route("link")]
    public class LinkController : Controller
    {
        private readonly ILogger<LinkController> _logger;
        private readonly ITokenGenerator _tokenGenerator;
        private readonly AppSettings _appSettings;
        private readonly ILinkForwarderService _linkForwarderService;
        private readonly ILinkVerifier _linkVerifier;
        private readonly IMemoryCache _cache;

        public LinkController(
            IOptions<AppSettings> settings,
            ILogger<LinkController> logger,
            ITokenGenerator tokenGenerator,
            ILinkForwarderService linkForwarderService,
            ILinkVerifier linkVerifier,
            IMemoryCache cache)
        {
            _appSettings = settings.Value;
            _logger = logger;
            _tokenGenerator = tokenGenerator;
            _linkForwarderService = linkForwarderService;
            _linkVerifier = linkVerifier;
            _cache = cache;
        }

        [AllowAnonymous]
        [AddForwarderHeader]
        [Route("/aka/{akaName}")]
        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public async Task<IActionResult> Aka(string akaName)
        {
            bool ValidateAkaName(string name)
            {
                return !string.IsNullOrWhiteSpace(name) && Regex.IsMatch(name, @"^(?!-)([a-z0-9-]+)$");
            }

            try
            {
                if (!ValidateAkaName(akaName))
                {
                    return BadRequest();
                }

                var ip = HttpContext.Connection.RemoteIpAddress.ToString();
                var ua = Request.Headers["User-Agent"];
                if (string.IsNullOrWhiteSpace(ua))
                {
                    _logger.LogWarning($"'{ip}' requested akaName '{akaName}' without User Agent. Request is blocked.");
                    return BadRequest();
                }

                var tokenResponse = await _linkForwarderService.GetTokenByAkaNameAsync(akaName);
                if (tokenResponse.IsSuccess)
                {
                    if (tokenResponse.Item == null)
                    {
                        // can not redirect to default url because it will confuse user that the aka points to that default url.
                        return NotFound();
                    }

                    // Do not use RedirectToAction() because another 302 will happen.
                    return await PerformTokenRedirection(tokenResponse.Item, ip, ua);
                }
                return new StatusCodeResult(StatusCodes.Status500InternalServerError);
            }
            catch (Exception e)
            {
                _logger.LogError(e, e.Message);
                return new StatusCodeResult(StatusCodes.Status500InternalServerError);
            }
        }

        [AllowAnonymous]
        [AddForwarderHeader]
        [Route("/fw/{token}")]
        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public async Task<IActionResult> Forward(string token)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(token))
                {
                    return BadRequest();
                }

                var ip = HttpContext.Connection.RemoteIpAddress.ToString();
                var ua = Request.Headers["User-Agent"];
                if (string.IsNullOrWhiteSpace(ua))
                {
                    _logger.LogWarning($"'{ip}' requested token '{token}' without User Agent. Request is blocked.");
                    return BadRequest();
                }

                return await PerformTokenRedirection(token, ip, ua);
            }
            catch (Exception e)
            {
                _logger.LogError(e, e.Message);
                return new StatusCodeResult(StatusCodes.Status500InternalServerError);
            }
        }

        private async Task<IActionResult> PerformTokenRedirection(string token, string ip, StringValues ua)
        {
            bool isValid = _tokenGenerator.TryParseToken(token, out var validatedToken);
            if (!isValid)
            {
                _logger.LogWarning($"'{ip}' requested invalid token '{token}'. Request is blocked.");
                return BadRequest();
            }

            if (!_cache.TryGetValue(token, out Link linkEntry))
            {
                var response = await _linkForwarderService.GetLinkAsync(validatedToken);
                if (response.IsSuccess)
                {
                    var link = response.Item;
                    if (null == link)
                    {
                        if (string.IsNullOrWhiteSpace(_appSettings.DefaultRedirectionUrl)) return NotFound();

                        var verifyDefaultRedirectionUrl =
                            _linkVerifier.Verify(_appSettings.DefaultRedirectionUrl, Url, Request);
                        if (verifyDefaultRedirectionUrl == LinkVerifyResult.Valid)
                        {
                            return Redirect(_appSettings.DefaultRedirectionUrl);
                        }

                        throw new UriFormatException("DefaultRedirectionUrl is not a valid URL.");
                    }

                    if (!link.IsEnabled)
                    {
                        return BadRequest("This link is disabled.");
                    }

                    var verifyOriginUrl = _linkVerifier.Verify(link.OriginUrl, Url, Request);
                    switch (verifyOriginUrl)
                    {
                        case LinkVerifyResult.Valid:
                            // cache valid link entity only.
                            _cache.Set(token, link, TimeSpan.FromHours(1));
                            break;
                        case LinkVerifyResult.InvalidFormat:
                            throw new UriFormatException(
                                $"OriginUrl '{link.OriginUrl}' is not a valid URL, link ID: {link.Id}.");
                        case LinkVerifyResult.InvalidLocal:
                            _logger.LogWarning($"Local redirection is blocked. link: {JsonConvert.SerializeObject(link)}");
                            return BadRequest("Local redirection is blocked");
                        case LinkVerifyResult.InvalidSelfReference:
                            _logger.LogWarning(
                                $"Self reference redirection is blocked. link: {JsonConvert.SerializeObject(link)}");
                            return BadRequest("Self reference redirection is blocked");
                        default:
                            throw new ArgumentOutOfRangeException();
                    }
                }
                else
                {
                    return new StatusCodeResult(StatusCodes.Status500InternalServerError);
                }
            }

            if (null == linkEntry)
            {
                linkEntry = _cache.Get<Link>(token);
            }

            _ = Task.Run(async () =>
            {
                await _linkForwarderService.TrackSucessRedirectionAsync(
                    new LinkTrackingRequest(ip, ua, linkEntry.Id));
            });

            return Redirect(linkEntry.OriginUrl);
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
        public async Task<IActionResult> ClearTrackingData()
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
