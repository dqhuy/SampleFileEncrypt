using Ce.Constant.Lib.Definitions;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using PDFManagementApp.Dto;
using PDFManagementApp.Models;
using PDFManagementApp.Services;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace PDFManagementApp.Controllers
{
    public class AccountController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly string _folderFaceUserDataBase;
        private readonly string _serverAddressFaceAuthenticator;
        private readonly string _axAPIWrapperDomain;

        public AccountController(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
            _folderFaceUserDataBase = configuration.GetConnectionString("FolderFaceUserDataBase") ?? "";
            _serverAddressFaceAuthenticator = configuration.GetConnectionString("ServerAddressFaceAuthenticator") ?? "";
            _axAPIWrapperDomain = configuration.GetConnectionString("AXAPIWrapperDomain") ?? "";
        }

        [HttpGet]
        public IActionResult Login()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Login(string username, string password)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
            if (user != null && VerifyPassword(password, user.PasswordHash))
            {
                var claims = new System.Security.Claims.ClaimsPrincipal(
                    new System.Security.Claims.ClaimsIdentity(
                        new[] { new System.Security.Claims.Claim(System.Security.Claims.ClaimTypes.Name, username) },
                        "CookieAuth"));
                await HttpContext.SignInAsync("CookieAuth", claims);
                return RedirectToAction("Index", "Document");
            }
            ViewBag.Error = "Invalid credentials";
            return View();
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> LoginWithFace(UserLoginDto model)
        {
            if (string.IsNullOrEmpty(model.AuthFilePath))
            {
                return BadRequest("Không có thông tin ảnh. Hãy xác thực lại.");
            }
            var userRecognize = new GenericResponse<string>();
            //var userRecognize = await _faceAuthenticatorClientService.RecognizeFace(_axAPIWrapperDomain, model.AuthFilePath);
            if (!userRecognize.Success || userRecognize.Data == null)
            {
                return BadRequest(userRecognize.Message);
            }
            var lstFaceInfors = JsonConvert.DeserializeObject<List<FacesData>>(userRecognize.Data.ToString());

            var faceInfors = new FacesData();

            if (lstFaceInfors != null)
            {
                faceInfors = lstFaceInfors[0];
            }
            else
            {
                return BadRequest("Không có thông tin người dùng vui lòng thử lại.");
            }

            if (faceInfors == null || faceInfors.Faces.Count == 0)
            {
                return BadRequest("Không có thông tin người dùng vui lòng thử lại.");
            }

            if (string.IsNullOrEmpty(model.IpAddress))
            {
                model.IpAddress = "Unknown";
            }
            foreach (var faceInfor in faceInfors.Faces)
            {
                if (faceInfor.Similarity >= 0.5)
                {
                    var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == faceInfor.Name);
                    if (user != null)
                    {
                        var claims = new System.Security.Claims.ClaimsPrincipal(
                            new System.Security.Claims.ClaimsIdentity(
                                new[] { new System.Security.Claims.Claim(System.Security.Claims.ClaimTypes.Name, model.UserName) },
                                "CookieAuth"));
                        await HttpContext.SignInAsync("CookieAuth", claims);
                        return RedirectToAction("Index", "Document");
                    }
                }
            }
            ViewBag.Error = "Invalid credentials";
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> SaveTempImage([FromForm] IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("Không có file được tải lên.");
            var permittedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif" };
            var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (string.IsNullOrEmpty(ext) || !permittedExtensions.Contains(ext))
            {
                return BadRequest("Định dạng file không hợp lệ.");
            }
            var folderPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot\\uploads\\faceAuthPictures");
            if (!Directory.Exists(folderPath))
            {
                Directory.CreateDirectory(folderPath);
            }

            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
            var filePath = Path.Combine(folderPath, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            //var imagePath = $"uploads/facePictures/{fileName}";
            return Ok(new { filePath });
        }

        [HttpGet]
        public IActionResult Register()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Register(string username, string password, string encryptionKey)
        {
            var user = new ApplicationUser
            {
                Username = username,
                PasswordHash = HashPassword(password),
                EncryptionKey = encryptionKey
            };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return RedirectToAction("Login");
        }

        [HttpGet]
        public IActionResult Manage()
        {
            var users = _context.Users.ToList();
            return View(users);
        }

        [HttpPost]
        public async Task<IActionResult> Delete(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user != null)
            {
                _context.Users.Remove(user);
                await _context.SaveChangesAsync();
            }
            return RedirectToAction("Manage");
        }

        [HttpGet]
        public IActionResult Edit(int id)
        {
            var user = _context.Users.Find(id);
            return View(user);
        }

        [HttpPost]
        public async Task<IActionResult> Edit(int id, string username, string password, string encryptionKey)
        {
            var user = await _context.Users.FindAsync(id);
            if (user != null)
            {
                user.Username = username;
                if (!string.IsNullOrEmpty(password))
                    user.PasswordHash = HashPassword(password);
                user.EncryptionKey = encryptionKey;
                await _context.SaveChangesAsync();
            }
            return RedirectToAction("Manage");
        }

        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync("CookieAuth");
            return RedirectToAction("Login");
        }

        private string HashPassword(string password)
        {
            using (SHA256 sha256 = SHA256.Create())
            {
                var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                return Convert.ToBase64String(bytes);
            }
        }

        private bool VerifyPassword(string password, string hash)
        {
            return HashPassword(password) == hash;
        }
    }
}