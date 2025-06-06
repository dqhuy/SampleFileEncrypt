using Ce.Constant.Lib.Dtos;
using PDFManagementApp.Dto;
using PDFManagementApp.Services.Interface;
using System.Net;

namespace PDFManagementApp.Services
{
    public class FaceAuthenticatorClientService : IFaceAuthenticatorClientService
    {

        public FaceAuthenticatorClientService()
        {
        }
        public async Task<GenericResponse<LoginFaceResponse>> RecognizeFace(string domain, string authFilePath, string accessToken = null)
        {
            var response = new GenericResponse<LoginFaceResponse>();

            try
            {
                // Đọc file ảnh thành base64
                string base64String = string.Empty;
                if (!string.IsNullOrEmpty(authFilePath))
                {
                    byte[] imageBytes = File.ReadAllBytes(authFilePath);
                    base64String = Convert.ToBase64String(imageBytes);
                }

                using (var client = new HttpClient())
                {
                    if (!string.IsNullOrEmpty(accessToken))
                    {
                        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", accessToken);
                    }

                    var imageData = new
                    {
                        Base64Image = base64String
                    };
                    var jsonContent = new StringContent(System.Text.Json.JsonSerializer.Serialize(imageData), System.Text.Encoding.UTF8, "application/json");

                    var httpResponse = await client.PostAsync($"{domain}/FaceAuth/login", jsonContent);

                    if (httpResponse.IsSuccessStatusCode)
                    {
                        var json = await httpResponse.Content.ReadAsStringAsync();

                        var loginResult = System.Text.Json.JsonSerializer.Deserialize<LoginFaceResponse>(json, new System.Text.Json.JsonSerializerOptions
                        {
                            PropertyNameCaseInsensitive = true
                        });

                        response = GenericResponse<LoginFaceResponse>.ResultWithData(loginResult);
                    }
                    else
                    {
                        response = GenericResponse<LoginFaceResponse>.ResultWithError((int)httpResponse.StatusCode, "Xác thực không thành công", "Xác thực không thành công");
                    }
                }
            }
            catch (Exception ex)
            {
                response = GenericResponse<LoginFaceResponse>.ResultWithError((int)HttpStatusCode.BadRequest, "Xác thực không thành công", ex.Message);
            }

            return response;
        }

        public async Task<GenericResponse<string>> FaceTrain(string domain, string accessToken = null)
        {
            var response = new GenericResponse<string>();

            try
            {
                using (var client = new HttpClient())
                {
                    if (!string.IsNullOrEmpty(accessToken))
                    {
                        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", accessToken);
                    }

                    var httpResponse = await client.PostAsync($"{domain}/FaceAuth/train", null);

                    if (httpResponse.IsSuccessStatusCode)
                    {
                        var json = await httpResponse.Content.ReadAsStringAsync();

                        response = GenericResponse<string>.ResultWithData(json);
                    }
                    else
                    {
                        response = GenericResponse<string>.ResultWithError((int)httpResponse.StatusCode, "Lỗi train face", "Lỗi train face");
                    }
                }
            }
            catch (Exception ex)
            {
                response = GenericResponse<string>.ResultWithError((int)HttpStatusCode.BadRequest, "Lỗi train face", ex.Message);
            }

            return response;
        }


    }
}
