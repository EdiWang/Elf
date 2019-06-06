using System.Threading.Tasks;
using LinkForwarder.Models;
using LinkForwarder.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace LinkForwarder.Controllers
{
    [Authorize]
    [Route("admin")]
    public class AdminController : Controller
    {
        private readonly ILogger<AdminController> _logger;
        private readonly AppSettings _appSettings;
        private readonly IMemoryCache _memoryCache;
        private readonly ILinkForwarderService _linkForwarderService;
        private readonly ILinkVerifier _linkVerifier;

        public AdminController(
            IOptions<AppSettings> settings,
            ILogger<AdminController> logger,
            IMemoryCache memoryCache,
            ILinkForwarderService linkForwarderService,
            ILinkVerifier linkVerifier)
        {
            _appSettings = settings.Value;
            _logger = logger;
            _memoryCache = memoryCache;
            _linkForwarderService = linkForwarderService;
            _linkVerifier = linkVerifier;
        }

        [Route("")]
        public IActionResult Index()
        {
            // TODO: make dashboard
            return View();
        }

        [Route("recent-requests")]
        public async Task<IActionResult> RecentRequests()
        {
            var response = await _linkForwarderService.GetRecentRequestsAsync(20);
            return Json(response);
        }

        [Route("manage")]
        public async Task<IActionResult> Manage()
        {
            var response = await _linkForwarderService.GetPagedLinksAsync(0, 0, 0);
            if (response.IsSuccess)
            {
                return View(response.Item);
            }
            ViewBag.ErrorMessage = response.Message;
            Response.StatusCode = StatusCodes.Status500InternalServerError;
            return View("AdminError");
        }

        [Route("create-link")]
        public IActionResult CreateLink()
        {
            return View();
        }

        [HttpPost]
        [Route("create-link")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> CreateLink(LinkEditModel model)
        {
            if (ModelState.IsValid)
            {
                var verifyResult = _linkVerifier.Verify(model.OriginUrl, Url, Request);
                switch (verifyResult)
                {
                    case LinkVerifyResult.InvalidFormat:
                        ModelState.AddModelError(nameof(model.OriginUrl), "Not a valid URL.");
                        return View(model);
                    case LinkVerifyResult.InvalidLocal:
                        ModelState.AddModelError(nameof(model.OriginUrl), "Can not use local URL.");
                        return View(model);
                    case LinkVerifyResult.InvalidSelfReference:
                        ModelState.AddModelError(nameof(model.OriginUrl), "Can not use url pointing to this site.");
                        return View(model);
                }

                var response = await _linkForwarderService.CreateLinkAsync(model.OriginUrl, model.Note, model.IsEnabled);
                if (response.IsSuccess)
                {
                    return RedirectToAction("ShowLink", new { token = response.Item });
                }

                ViewBag.ErrorMessage = response.Message;
                Response.StatusCode = StatusCodes.Status500InternalServerError;
                return View("AdminError");
            }
            return View(model);
        }

        [Route("show-link/{token}")]
        public async Task<IActionResult> ShowLink(string token)
        {
            var response = await _linkForwarderService.IsLinkExistsAsync(token);
            if (response.IsSuccess)
            {
                if (response.Item)
                {
                    return View(new ShowLinkViewModel { Token = token });
                }
                return NotFound();
            }

            ViewBag.ErrorMessage = response.Message;
            Response.StatusCode = StatusCodes.Status500InternalServerError;
            return View("AdminError");
        }

        [Route("delete")]
        public async Task<IActionResult> DeleteLink(int linkId)
        {
            var response = await _linkForwarderService.DeleteLink(linkId);
            return Json(response);
        }
    }
}
