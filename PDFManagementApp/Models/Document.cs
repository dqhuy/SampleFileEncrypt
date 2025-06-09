using System;

namespace PDFManagementApp.Models
{
    public class Document
    {
        public int Id { get; set; }
        public string FileName { get; set; }
        public long FileSize { get; set; }
        public DateTime UploadDate { get; set; }
        public string UploadedBy { get; set; }
        public string FilePath { get; set; }
        public bool IsEncrypted { get; set; } = true;
    }
}