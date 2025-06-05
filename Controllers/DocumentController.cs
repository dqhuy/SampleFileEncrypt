using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PDFManagementApp.Models;
using PDFManagementApp.Services;
using System;
using System.IO;
using System.Threading.Tasks;

namespace PDFManagementApp.Controllers
{
    [Authorize]
    public class DocumentController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly EncryptionService _encryptionService;
        private readonly IWebHostEnvironment _environment;

        public DocumentController(ApplicationDbContext context, EncryptionService encryptionService, IWebHostEnvironment environment)
        {
            _context = context;
            _encryptionService = encryptionService;
            _environment = environment;
        }

        public async Task<IActionResult> Index()
        {
            var user = User.Identity.Name;
            var documents = await _context.Documents
                .Where(d => d.UploadedBy == user)
                .ToListAsync();
            return View(documents);
        }

        [HttpGet]
        public IActionResult Upload()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Upload(IFormFile file, string encryptionKey)
        {
            if (file != null && file.ContentType == "application/pdf")
            {
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == User.Identity.Name);
                if (user.EncryptionKey != encryptionKey)
                {
                    ViewBag.Error = "Invalid encryption key";
                    return View();
                }

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
            var document = await _context.Documents.FindAsync(id);
            if (document == null || document.UploadedBy != User.Identity.Name)
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
            return File(decryptedData, "application/pdf", document.FileName);
        }

        [HttpPost]
        public async Task<IActionResult> Download(int id, string encryptionKey)
        {
            var document = await _context.Documents.FindAsync(id);
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == User.Identity.Name);
            if (document == null || document.UploadedBy != User.Identity.Name || user.EncryptionKey != encryptionKey)
            {
                return BadRequest("Invalid encryption key or document not found");
            }

            var encryptedData = await System.IO.File.ReadAllBytesAsync(document.FilePath);
            var decryptedData = _encryptionService.DecryptFile(encryptedData, encryptionKey);
            return File(decryptedData, "application/pdf", document.FileName);
        }
    }
}