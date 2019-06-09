using Microsoft.AspNetCore.Mvc;

namespace LinkForwarder.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
