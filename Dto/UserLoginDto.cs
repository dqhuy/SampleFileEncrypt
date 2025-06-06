namespace PDFManagementApp.Dto
{
    public class UserLoginDto
    {
        public string UserName { get; set; }
        public string Password { get; set; }
        public bool RememberMe { get; set; }
        public string IpAddress { get; set; }
        public string RequestPath { get; set; }
        public string AuthFilePath { get; set; }
    }
}
