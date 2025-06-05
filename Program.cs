using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using PDFManagementApp.Models;
using System;
using System.Linq;
using System.Security.Cryptography;
using System.Text;

namespace PDFManagementApp
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var host = CreateHostBuilder(args).Build();

            // Seed admin account
            using (var scope = host.Services.CreateScope())
            {
                var services = scope.ServiceProvider;
                var context = services.GetRequiredService<ApplicationDbContext>();

                // Ensure database is created
                context.Database.EnsureCreated();

                // Check if admin exists
                if (!context.Users.Any(u => u.Username == "admin"))
                {
                    var adminUser = new ApplicationUser
                    {
                        Username = "admin",
                        PasswordHash = HashPassword("admin"),
                        EncryptionKey = "admin" // Set a default encryption key
                    };
                    context.Users.Add(adminUser);
                    context.SaveChanges();
                }
            }

            host.Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });

        private static string HashPassword(string password)
        {
            using (SHA256 sha256 = SHA256.Create())
            {
                var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                return Convert.ToBase64String(bytes);
            }
        }
    }
}