namespace EventifyApi.Models.Entities.Enums;

/// <summary>
/// Roles de usuario en el sistema Eventify
/// </summary>
public enum UserRole
{
    /// <summary>
    /// Usuario regular - Solo puede ver eventos y registrarse
    /// </summary>
    User = 0,

    /// <summary>
    /// Organizador - Puede crear y gestionar sus propios eventos
    /// </summary>
    Organizer = 1,

    /// <summary>
    /// Administrador - Acceso total al sistema
    /// </summary>
    Admin = 2
}
