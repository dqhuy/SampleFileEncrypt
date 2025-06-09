using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using PDFManagementApp.Dto;
using PDFManagementApp.Models;
using PDFManagementApp.Services;
using PDFManagementApp.Services.Interface;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.IO;
using Ce.Common.Lib.Abstractions;
using Ce.Constant.Lib.Dtos;
using Nest;

namespace PDFManagementApp.Controllers
{
    public class AccountController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IFaceAuthenticatorClientService _faceAuthenticatorClientService;
        private readonly IConfiguration _configuration;
        private readonly string _faceRecognizeAPIWrapperDomain;

        public AccountController(ApplicationDbContext context, IConfiguration configuration, IFaceAuthenticatorClientService faceAuthenticatorClientService)
        {
            _context = context;
            _faceAuthenticatorClientService = faceAuthenticatorClientService;
            _configuration = configuration;
            _faceRecognizeAPIWrapperDomain = configuration.GetConnectionString("FaceRecognizeAPIDomain") ?? "";
            //_faceRecognizeAPIWrapperDomain = Environment.GetEnvironmentVariable("FaceRecognizeAPIDomain")
            //    ?? configuration.GetConnectionString("FaceRecognizeAPIDomain");

        }
        protected virtual IActionResult ResponseResult(GenericResponse result)
        {
            return new JsonResult(result);
        }

        protected virtual IActionResult ResponseResult<T>(GenericResponse<T> result)
        {
            return new JsonResult(result);
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
            ViewBag.Error = "Tài khoản hoặc mật khẩu không đúng.";
            return View();
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> LoginWithFace(UserLoginDto model)
        {
            var result = new GenericResponse<int>();
            if (string.IsNullOrEmpty(model.AuthFilePath))
            {
                return new JsonResult(GenericResponse<int>.ResultWithError(message: "Không có thông tin ảnh. Hãy xác thực lại."));
            }
            var userRecognize = await _faceAuthenticatorClientService.RecognizeFace(_faceRecognizeAPIWrapperDomain, model.AuthFilePath);
            if (!userRecognize.Success || userRecognize.Data == null)
            {
                return new JsonResult(GenericResponse<int>.ResultWithError(message: userRecognize.Message));
            }
            var faceInfor = userRecognize.Data;

            if (faceInfor != null)
            {
                if (faceInfor.Confidence >= 0.5)
                {
                    var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == faceInfor.UserId); 
                    if (user != null)
                    {
                        var claims = new System.Security.Claims.ClaimsPrincipal(
                            new System.Security.Claims.ClaimsIdentity(
                                new[] { new System.Security.Claims.Claim(System.Security.Claims.ClaimTypes.Name, user.Username) },
                                "CookieAuth"));
                        await HttpContext.SignInAsync("CookieAuth", claims);
                        //return RedirectToAction("Index", "Document");
                        return new JsonResult(new
                        {
                            redirectUrl = "/Document"
                        });
                    }
                }
                else
                {
                    return new JsonResult(GenericResponse<int>.ResultWithError(message: "Độ tin cậy không đạt"));
                }
            }
            else
            {
                return new JsonResult(GenericResponse<int>.ResultWithError(message: "Không có thông tin người dùng vui lòng thử lại."));
            }
            return new JsonResult(GenericResponse<int>.ResultWithError(message: "Xác thực không thành công."));
        }

        [HttpPost]
        public async Task<IActionResult> FaceTrain()
        {
            var result = await _faceAuthenticatorClientService.FaceTrain(_faceRecognizeAPIWrapperDomain);
            if (!result.Success || result.Data == null)
            {
                return new JsonResult(GenericResponse<int>.ResultWithError(message: result.Message));
            }
            return ResponseResult(result);
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

        [HttpPost]
        public async Task<IActionResult> RegisterImageForFaceRecogize([FromForm] RegisterImageFaceRecogizeDto model)
        {
            if (model.File == null || model.File.Length == 0)
                return BadRequest("Không có file được tải lên.");
            var permittedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif" };
            var ext = Path.GetExtension(model.File.FileName).ToLowerInvariant();
            if (string.IsNullOrEmpty(ext) || !permittedExtensions.Contains(ext))
            {
                return BadRequest("Định dạng file không hợp lệ.");
            }
            var currentRoot = Directory.GetParent(Directory.GetCurrentDirectory()).FullName;
            var folderPath = Path.Combine(currentRoot, "FaceRecognition", "images", model.UserName);

            if (!Directory.Exists(folderPath))
            {
                Directory.CreateDirectory(folderPath);
            }

            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(model.File.FileName);
            var filePath = Path.Combine(folderPath, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await model.File.CopyToAsync(stream);
            }

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
        public async Task<IActionResult> Create(string username, string password, string encryptionKey)
        {
            var user = new ApplicationUser
            {
                Username = username,
                PasswordHash = HashPassword(password),
                EncryptionKey = encryptionKey
            };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return RedirectToAction("Manage");
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
            var user = new ApplicationUser();
            if (id <= 0)
            {
                return View(user);
            }
            user = _context.Users.Find(id);
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