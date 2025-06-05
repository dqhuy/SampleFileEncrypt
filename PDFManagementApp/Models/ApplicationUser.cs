namespace PDFManagementApp.Models
{
    public class ApplicationUser
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string PasswordHash { get; set; }
        public string EncryptionKey { get; set; }
    }
}