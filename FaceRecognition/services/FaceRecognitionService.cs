using FaceRecognitionDotNet;
using System.Text.Json;

namespace FaceAuthApp.Services
{
    public class FaceRecognitionService
    {
        private readonly FaceRecognition _faceRecognition;
        private readonly Dictionary<string, List<FaceEncoding>> _userFaceEncodings;
        private readonly string _encodingsFilePath;

        public FaceRecognitionService(string modelsPath = "models/", string wwwRootPath = "wwwroot")
        {
            _faceRecognition = FaceRecognition.Create(modelsPath);
            _userFaceEncodings = new Dictionary<string, List<FaceEncoding>>();
            _encodingsFilePath = Path.Combine(wwwRootPath, "encodings.json");

            LoadEncodingsFromFile();
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

            await SaveEncodingsToFileAsync();
        }

        public (string UserId, double Confidence)? Login(byte[] imageData)
        {
            using var ms = new MemoryStream(imageData);
            using var bitmap = new System.Drawing.Bitmap(ms);
            using var image = FaceRecognition.LoadImage(bitmap);

            var faceLocations = _faceRecognition.FaceLocations(image).ToList();
            if (!faceLocations.Any()) return null;

            var faceEncoding = _faceRecognition.FaceEncodings(image, faceLocations).FirstOrDefault();
            if (faceEncoding == null) return null;

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

        // Lưu encodings ra file JSON
        private async Task SaveEncodingsToFileAsync()
        {
            var saveData = _userFaceEncodings.ToDictionary(
                kvp => kvp.Key,
                kvp => kvp.Value.Select(enc => enc.GetRawEncoding()).ToList()
            );

            var json = JsonSerializer.Serialize(saveData);
            await File.WriteAllTextAsync(_encodingsFilePath, json);
        }

        // Load encodings từ file JSON
        private void LoadEncodingsFromFile()
        {
            if (!File.Exists(_encodingsFilePath)) return;

            var json = File.ReadAllText(_encodingsFilePath);
            var data = JsonSerializer.Deserialize<Dictionary<string, List<float[]>>>(json);

            if (data != null)
            {
                foreach (var kvp in data)
                {
                    var faceEncodings = kvp.Value.Select(vec => CreateFaceEncoding(vec)).ToList();
                    _userFaceEncodings[kvp.Key] = faceEncodings;
                }
                Console.WriteLine("Loaded face encodings from file.");
            }
        }
        private FaceEncoding CreateFaceEncoding(float[] data)
        {
            var doubles = data.Select(f => (double)f).ToArray();

            using var matrix = new DlibDotNet.Matrix<double>(1, doubles.Length);

            for (int i = 0; i < doubles.Length; i++)
            {
                matrix[0, i] = doubles[i];
            }

            var constructor = typeof(FaceEncoding)
                .GetConstructors(System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance)
                .FirstOrDefault();

            if (constructor == null)
                throw new InvalidOperationException("Không tìm thấy constructor của FaceEncoding!");

            // Constructor nhận Matrix<double>
            var encoding = constructor.Invoke(new object[] { matrix }) as FaceEncoding;

            return encoding;
        }



    }
}