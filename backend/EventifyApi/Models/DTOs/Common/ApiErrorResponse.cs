namespace EventifyApi.Models.DTOs.Common;

/// <summary>
/// Respuesta de error estándar de la API
/// </summary>
public class ApiErrorResponse
{
    public int StatusCode { get; set; }
    public string Message { get; set; } = string.Empty;
    public Dictionary<string, List<string>>? Errors { get; set; }
    public string? TraceId { get; set; }

    public ApiErrorResponse()
    {
    }

    public ApiErrorResponse(int statusCode, string message)
    {
        StatusCode = statusCode;
        Message = message;
    }

    public ApiErrorResponse(int statusCode, string message, Dictionary<string, List<string>> errors)
    {
        StatusCode = statusCode;
        Message = message;
        Errors = errors;
    }
}
