using EventifyApi.Models.Entities.Enums;

namespace EventifyApi.Models.Entities;

/// <summary>
/// Entidad Registration - Representa una inscripción de un usuario a un evento
/// </summary>
public class Registration
{
    /// <summary>
    /// ID único de la inscripción
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// Estado de la inscripción
    /// </summary>
    public RegistrationStatus Status { get; set; } = RegistrationStatus.Pending;

    /// <summary>
    /// Fecha y hora de inscripción
    /// </summary>
    public DateTime RegistrationDate { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Notas adicionales de la inscripción
    /// </summary>
    public string? Notes { get; set; }

    // =============================================================================
    // FOREIGN KEYS
    // =============================================================================

    /// <summary>
    /// ID del usuario inscrito
    /// </summary>
    public int UserId { get; set; }

    /// <summary>
    /// ID del evento al que se inscribe
    /// </summary>
    public int EventId { get; set; }

    // =============================================================================
    // RELACIONES DE NAVEGACIÓN
    // =============================================================================

    /// <summary>
    /// Usuario inscrito
    /// </summary>
    public User User { get; set; } = null!;

    /// <summary>
    /// Evento al que se inscribe
    /// </summary>
    public Event Event { get; set; } = null!;
}
