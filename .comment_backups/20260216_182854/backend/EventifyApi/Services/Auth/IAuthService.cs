using EventifyApi.Models.DTOs.Auth;

namespace EventifyApi.Services.Auth;

/// <summary>
/// Interfaz del servicio de autenticación
/// </summary>
public interface IAuthService
{
    /// <summary>
    /// Autentica un usuario con email y contraseña
    /// </summary>
    Task<AuthResponseDto> LoginAsync(LoginDto loginDto);

    /// <summary>
    /// Registra un nuevo usuario
    /// </summary>
    Task<AuthResponseDto> RegisterAsync(RegisterDto registerDto);

    /// <summary>
    /// Obtiene el usuario actual por ID
    /// </summary>
    Task<Models.Entities.User> GetCurrentUserAsync(int userId);

    /// <summary>
    /// Cambia la contraseña del usuario
    /// </summary>
    Task ChangePasswordAsync(int userId, ChangePasswordDto changePasswordDto);
}
