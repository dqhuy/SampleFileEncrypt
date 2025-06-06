using FaceAuthApp.Services;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace FaceAuthApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FaceAuthController : ControllerBase
    {
        private readonly FaceRecognitionService _faceRecognitionService;

        public FaceAuthController(FaceRecognitionService faceRecognitionService)
        {
            _faceRecognitionService = faceRecognitionService;
        }

        [HttpPost("train")]
        public async Task<IActionResult> Train()
        {
            await _faceRecognitionService.TrainAsync("images");
            return Ok(new { Message = "Training completed successfully" });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] ImageData data)
        {
            var imageBytes = System.Convert.FromBase64String(data.Base64Image);
            var result = _faceRecognitionService.Login(imageBytes);

            if (result.HasValue)
            {
                return Ok(new { UserId = result.Value.UserId, Confidence = result.Value.Confidence });
            }

            return Unauthorized(new { Message = "Face not recognized" });
        }
    }

    public class ImageData
    {
        public string Base64Image { get; set; }
    }
}