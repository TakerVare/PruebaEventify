using EventifyApi.Models.Entities.Enums;

namespace EventifyApi.Models.Entities;

/// <summary>
/// Entidad User - Representa un usuario del sistema
/// </summary>
public class User
{
    /// <summary>
    /// ID único del usuario
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// Email del usuario (único en el sistema)
    /// </summary>
    public string Email { get; set; } = string.Empty;

    /// <summary>
    /// Hash de la contraseña (BCrypt)
    /// </summary>
    public string PasswordHash { get; set; } = string.Empty;

    /// <summary>
    /// Nombre del usuario
    /// </summary>
    public string FirstName { get; set; } = string.Empty;

    /// <summary>
    /// Apellido del usuario
    /// </summary>
    public string LastName { get; set; } = string.Empty;

    /// <summary>
    /// Rol del usuario en el sistema
    /// </summary>
    public UserRole Role { get; set; } = UserRole.User;

    /// <summary>
    /// Indica si el usuario está activo
    /// </summary>
    public bool IsActive { get; set; } = true;

    /// <summary>
    /// URL del avatar del usuario
    /// </summary>
    public string? AvatarUrl { get; set; }

    /// <summary>
    /// Fecha de creación del usuario
    /// </summary>
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Fecha de última actualización
    /// </summary>
    public DateTime? UpdatedAt { get; set; }

    // =============================================================================
    // RELACIONES DE NAVEGACIÓN
    // =============================================================================

    /// <summary>
    /// Eventos organizados por este usuario
    /// </summary>
    public ICollection<Event> OrganizedEvents { get; set; } = new List<Event>();

    /// <summary>
    /// Inscripciones del usuario a eventos
    /// </summary>
    public ICollection<Registration> Registrations { get; set; } = new List<Registration>();
}
