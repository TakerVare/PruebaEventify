namespace EventifyApi.Models.DTOs.Common;

/// <summary>
/// Respuesta estándar de la API para operaciones exitosas
/// </summary>
/// <typeparam name="T">Tipo de dato retornado</typeparam>
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
