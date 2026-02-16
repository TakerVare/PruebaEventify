namespace EventifyApi.Models.DTOs.Common;





public class ApiResponse<T>
{
    public T? Data { get; set; }
    public string Message { get; set; } = "Success";
    public bool Success { get; set; } = true;

    public ApiResponse()
    {
    }

    public ApiResponse(T data, string message = "Success")
    {
        Data = data;
        Message = message;
        Success = true;
    }
}
