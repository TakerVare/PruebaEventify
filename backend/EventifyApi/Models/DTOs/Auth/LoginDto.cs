namespace EventifyApi.Models.DTOs.Auth;

/// <summary>
/// DTO para login de usuario
/// </summary>
public class LoginDto
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}
