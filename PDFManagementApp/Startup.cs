using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using PDFManagementApp.Models;
using PDFManagementApp.Services;
using Microsoft.Data.Sqlite;
using Ce.Interaction.Lib.HttpClientAccessors.Interfaces;
using Ce.Interaction.Lib.HttpClientAccessors.Implementations;
using PDFManagementApp.Services.Interface; // Add this using directive
namespace PDFManagementApp
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlite(Configuration.GetConnectionString("DefaultConnection")));

            services.AddAuthentication("CookieAuth")
                .AddCookie("CookieAuth", options =>
                {
                    options.LoginPath = "/Account/Login";
                    options.AccessDeniedPath = "/Account/Login";
                });

            services.AddAuthorization();
            services.AddControllersWithViews();
            services.AddScoped<EncryptionService>();
            services.AddHttpClient<IBaseHttpClient, BaseHttpClient>();
            services.AddSingleton<IBaseHttpClientFactory, BaseHttpClientFactory>();
            services.AddSingleton<IFaceAuthenticatorClientService, FaceAuthenticatorClientService>();
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseRouting();
            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller=Home}/{action=Index}/{id?}");
            });
        }
    }
}