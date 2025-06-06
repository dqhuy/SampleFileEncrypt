using Microsoft.AspNetCore.Mvc;
using FaceAuthApp.Services;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddSingleton<FaceRecognitionService>();

// Add Swagger services
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "FaceAuth API", Version = "v1" });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

// Add Swagger middleware
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "FaceAuth API V1");
    c.RoutePrefix = "swagger"; // Swagger UI sẽ chạy tại /swagger
});

app.MapControllers();

app.MapGet("/", async context =>
{
    context.Response.Redirect("/index.html");
});

app.Run();