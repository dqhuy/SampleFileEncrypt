using FaceRecognitionDotNet;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace FaceAuthApp.Services
{
    public class FaceRecognitionService
    {
        private readonly FaceRecognition _faceRecognition;
        private readonly Dictionary<string, List<FaceEncoding>> _userFaceEncodings;

        public FaceRecognitionService(string modelsPath="models/")
        {
            _faceRecognition = FaceRecognition.Create(modelsPath);
            _userFaceEncodings = new Dictionary<string, List<FaceEncoding>>();
        }

        public async Task TrainAsync(string imagesPath)
        {
            foreach (var userDir in Directory.GetDirectories(imagesPath))
            {
                var userId = Path.GetFileName(userDir);
                var encodings = new List<FaceEncoding>();

                foreach (var imagePath in Directory.GetFiles(userDir, "*.jpg"))
                {
                    using var image = FaceRecognition.LoadImageFile(imagePath);
                    var faceLocations = _faceRecognition.FaceLocations(image).ToList();

                    if (faceLocations.Any())
                    {
                        var faceEncodings = _faceRecognition.FaceEncodings(image, faceLocations).ToList();
                        encodings.AddRange(faceEncodings);
                    }
                }

                if (encodings.Any())
                {
                    _userFaceEncodings[userId] = encodings;
                    Console.WriteLine($"Trained {encodings.Count} faces for user {userId}");
                }
            }
        }

        public (string UserId, double Confidence)? Login(byte[] imageData)
        {
            using var ms = new MemoryStream(imageData);
            using var bitmap = new System.Drawing.Bitmap(ms); // Convert MemoryStream to Bitmap
            using var image = FaceRecognition.LoadImage(bitmap); // Use the Bitmap to load the image


            var faceLocations = _faceRecognition.FaceLocations(image).ToList();
            if (!faceLocations.Any())
            {
                return null;
            }

            var faceEncoding = _faceRecognition.FaceEncodings(image, faceLocations).FirstOrDefault();
            if (faceEncoding == null)
            {
                return null;
            }

            string bestMatchUserId = null;
            double bestMatchDistance = double.MaxValue;

            foreach (var user in _userFaceEncodings)
            {
                foreach (var storedEncoding in user.Value)
                {
                    var distance = FaceRecognition.FaceDistance(storedEncoding, faceEncoding);
                    if (distance < bestMatchDistance && distance <= 0.4) // Ngưỡng 0.6 cho độ tương đồng => để test
                    {
                        bestMatchDistance = distance;
                        bestMatchUserId = user.Key;
                    }
                }
            }

            if (bestMatchUserId != null)
            {
                // Chuyển khoảng cách thành confidence (0-1, 1 là khớp hoàn toàn)
                var confidence = 1.0 - bestMatchDistance;
                return (bestMatchUserId, confidence);
            }

            return null;
        }
    }
}