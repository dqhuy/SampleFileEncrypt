using Ce.Constant.Lib.Dtos;
using PDFManagementApp.Dto;

namespace PDFManagementApp.Services.Interface
{
    public interface IFaceAuthenticatorClientService
    {
        Task<GenericResponse<LoginFaceResponse>> RecognizeFace(string domain, string authFilePath, string accessToken = null);
        Task<GenericResponse<string>> FaceTrain(string domain, string accessToken = null);

    }
}
