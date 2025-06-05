using Microsoft.AspNetCore.Mvc;

namespace PDFManagementApp.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}