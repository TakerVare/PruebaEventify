using EventifyApi.Models.DTOs.Users;

namespace EventifyApi.Models.DTOs.Auth;

/// <summary>
/// Respuesta de autenticación con token JWT
/// </summary>
public class AuthResponseDto
{
    public string Token { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
    public UserDto User { get; set; } = null!;
}
