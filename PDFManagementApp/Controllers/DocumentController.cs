using Ce.Constant.Lib.Dtos;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using PDFManagementApp.Dto;
using PDFManagementApp.Models;
using PDFManagementApp.Services;
using PDFManagementApp.Services.Interface;
using System;
using System.IO;
using System.Threading.Tasks;

namespace PDFManagementApp.Controllers
{
    [Authorize]
    public class DocumentController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly EncryptionService _encryptionService;
        private readonly IWebHostEnvironment _environment;
        private readonly IFaceAuthenticatorClientService _faceAuthenticatorClientService;
        private readonly string _faceRecognizeAPIWrapperDomain;

        public DocumentController(ApplicationDbContext context, IConfiguration configuration, EncryptionService encryptionService, IWebHostEnvironment environment, IFaceAuthenticatorClientService faceAuthenticatorClientService)
        {
            _context = context;
            _encryptionService = encryptionService;
            _configuration = configuration;
            _environment = environment;
            _faceAuthenticatorClientService = faceAuthenticatorClientService;
            _faceRecognizeAPIWrapperDomain = configuration.GetConnectionString("FaceRecognizeAPIDomain") ?? "";
        }

        public async Task<IActionResult> Index()
        {
            var user = User.Identity.Name;
            var userData = await _context.Users.FirstOrDefaultAsync(u => u.Username == User.Identity.Name);
            if (userData != null)
            {
                ViewBag.EncryptionKey = userData.EncryptionKey;
            }
            var documents = await _context.Documents
              //  .Where(d => d.UploadedBy == user)
                .ToListAsync();
            return View(documents);
        }

        [HttpGet]
        public async Task<IActionResult> Upload()
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == User.Identity.Name);
            if (user != null)
            {
                ViewBag.EncryptionKey = user.EncryptionKey;
                return View();
            }
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Upload(IFormFile file, string encryptionKey)
        {
            if (file != null && file.ContentType == "application/pdf")
            {
                var uploads = Path.Combine(_environment.WebRootPath, "uploads");
                Directory.CreateDirectory(uploads);
                var filePath = Path.Combine(uploads, Guid.NewGuid().ToString() + ".pdf");

                using (var ms = new MemoryStream())
                {
                    await file.CopyToAsync(ms);
                    var encryptedData = _encryptionService.EncryptFile(ms.ToArray(), encryptionKey);
                    await System.IO.File.WriteAllBytesAsync(filePath, encryptedData);
                }

                var document = new Document
                {
                    FileName = file.FileName,
                    FileSize = file.Length,
                    UploadDate = DateTime.Now,
                    UploadedBy = User.Identity.Name,
                    FilePath = filePath
                };
                _context.Documents.Add(document);
                await _context.SaveChangesAsync();
                return RedirectToAction("Index");
            }
            ViewBag.Error = "Please upload a valid PDF file";
            return View();
        }

        [HttpGet]
        public async Task<IActionResult> View(int id)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == User.Identity.Name);
            if (user != null)
            {
                ViewBag.EncryptionKey = user.EncryptionKey;
            }
            var document = await _context.Documents.FindAsync(id);
            //if (document == null || document.UploadedBy != User.Identity.Name)
            if (document == null)
                    return NotFound();
            return View(document);
        }

        [HttpPost]
        public async Task<IActionResult> View(int id, string encryptionKey)
        {
            var document = await _context.Documents.FindAsync(id);
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == User.Identity.Name);
            if (document == null || document.UploadedBy != User.Identity.Name || user.EncryptionKey != encryptionKey)
            {
                ViewBag.Error = "Invalid encryption key or document not found";
                return View(document);
            }

            var encryptedData = await System.IO.File.ReadAllBytesAsync(document.FilePath);
            var decryptedData = _encryptionService.DecryptFile(encryptedData, encryptionKey);

            // Trả về base64 để View xử lý
            string base64Pdf = Convert.ToBase64String(decryptedData);

            ViewBag.PdfBase64 = base64Pdf;
            return View(document);
        }

        [HttpPost]
        public async Task<IActionResult> ViewDetail_Old(int id, string encryptionKey)
        {
            var document = await _context.Documents.FindAsync(id);
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == User.Identity.Name);
            if (document == null || document.UploadedBy != User.Identity.Name || user.EncryptionKey != encryptionKey)
            {
                ViewBag.Error = "Invalid encryption key or document not found";
                return RedirectToAction("Document");
            }

            var encryptedData = await System.IO.File.ReadAllBytesAsync(document.FilePath);
            var decryptedData = _encryptionService.DecryptFile(encryptedData, encryptionKey);

            string filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "tmp", document.FileName);
            System.IO.File.WriteAllBytes(filePath, decryptedData);

            string viewerUrl = $"/lib/PdfJS/web/viewer.html?file=/tmp/{document.FileName}";
            return Redirect(viewerUrl);
        }

        [HttpPost]
        public async Task<IActionResult> ViewDetail(UserLoginDto model)
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
                    var document = await _context.Documents.FindAsync(model.docId);
                    var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == User.Identity.Name);
                    if (user != null && user.EncryptionKey != null && (document == null || document.UploadedBy != User.Identity.Name))
                    {
                        return new JsonResult(GenericResponse<int>.ResultWithError(message: "Bạn không phải người upload. vui lòng thử lại sau!"));
                    }
                    else if (user != null && user.EncryptionKey != null && (user.EncryptionKey != model.encryptionKey || user.Username.ToLower() != faceInfor.UserId.ToLower()))
                    {
                        return new JsonResult(GenericResponse<int>.ResultWithError(message: "Khuôn mặt không khớp với tài khoản. vui lòng thử lại!"));
                    }
                    else
                    {
                        var encryptedData = await System.IO.File.ReadAllBytesAsync(document.FilePath);
                        var decryptedData = _encryptionService.DecryptFile(encryptedData, user.EncryptionKey);

                        string filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "tmp", document.FileName);
                        System.IO.File.WriteAllBytes(filePath, decryptedData);

                        return new JsonResult(new
                        {
                            redirectUrl = $"/lib/PdfJS/web/viewer.html?file=/tmp/{document.FileName}"
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
        }

        [HttpPost]
        public async Task<IActionResult> DownloadEncryptFile(int id)
        {
            var document = await _context.Documents.FindAsync(id);
            var encryptedData = await System.IO.File.ReadAllBytesAsync(document.FilePath);
            return File(encryptedData, "application/pdf", document.FileName);
        }

        [HttpPost]
        public async Task<IActionResult> Download(int id, string encryptionKey)
        {
            var document = await _context.Documents.FindAsync(id);
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username.ToLower() == document.UploadedBy.ToLower());
            if (document == null || (user.EncryptionKey != encryptionKey && User.Identity.Name.ToLower() != "admin"))
            {
                return BadRequest("Invalid encryption key or document not found");
            }

            var encryptedData = await System.IO.File.ReadAllBytesAsync(document.FilePath);
            var decryptedData = _encryptionService.DecryptFile(encryptedData, user.EncryptionKey);
            return File(decryptedData, "application/pdf", document.FileName);
        }
    }
}