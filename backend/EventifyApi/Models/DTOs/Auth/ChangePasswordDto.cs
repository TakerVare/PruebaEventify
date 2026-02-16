namespace EventifyApi.Models.DTOs.Auth;

/// <summary>
/// DTO para cambiar contraseña
/// </summary>
public class ChangePasswordDto
{
    public string CurrentPassword { get; set; } = string.Empty;
    public string NewPassword { get; set; } = string.Empty;
    public string ConfirmNewPassword { get; set; } = string.Empty;
}
