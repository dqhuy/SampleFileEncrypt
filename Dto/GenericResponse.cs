namespace PDFManagementApp.Dto
{
    public class GenericResponse<T>
    {
        public bool Success { get; set; }

        public int? Status { get; set; }

        public string Message { get; set; }

        public string Error { get; set; }

        public T Data { get; set; }

        public static GenericResponse<T> ResultWithData(T data, string message = null)
        {
            return new GenericResponse<T>
            {
                Data = data,
                Message = message,
                Success = true
            };
        }

        public static GenericResponse<T> ResultWithError(int? status = null, string error = null, string message = null)
        {
            return new GenericResponse<T>
            {
                Status = status,
                Error = error,
                Message = message,
                Success = false
            };
        }
    }
}
