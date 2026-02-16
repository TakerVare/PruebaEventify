using EventifyApi.Models.Entities.Enums;

namespace EventifyApi.Models.Entities;

/// <summary>
/// Entidad Event - Representa un evento en el sistema
/// </summary>
public class Event
{
    /// <summary>
    /// ID único del evento
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// Título del evento
    /// </summary>
    public string Title { get; set; } = string.Empty;

    /// <summary>
    /// Descripción detallada del evento
    /// </summary>
    public string Description { get; set; } = string.Empty;

    /// <summary>
    /// Fecha y hora de inicio del evento
    /// </summary>
    public DateTime StartDate { get; set; }

    /// <summary>
    /// Fecha y hora de fin del evento
    /// </summary>
    public DateTime EndDate { get; set; }

    /// <summary>
    /// Capacidad máxima del evento
    /// </summary>
    public int Capacity { get; set; }

    /// <summary>
    /// Número de personas registradas
    /// </summary>
    public int RegisteredCount { get; set; } = 0;

    /// <summary>
    /// URL de la imagen del evento
    /// </summary>
    public string? ImageUrl { get; set; }

    /// <summary>
    /// Estado del evento (Draft, Published, Cancelled, Completed)
    /// </summary>
    public EventStatus Status { get; set; } = EventStatus.Draft;

    /// <summary>
    /// Fecha de creación del evento
    /// </summary>
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Fecha de última actualización
    /// </summary>
    public DateTime? UpdatedAt { get; set; }

    // =============================================================================
    // FOREIGN KEYS
    // =============================================================================

    /// <summary>
    /// ID de la ubicación del evento
    /// </summary>
    public int LocationId { get; set; }

    /// <summary>
    /// ID del organizador del evento
    /// </summary>
    public int OrganizerId { get; set; }

    /// <summary>
    /// ID de la categoría del evento
    /// </summary>
    public int CategoryId { get; set; }

    // =============================================================================
    // RELACIONES DE NAVEGACIÓN
    // =============================================================================

    /// <summary>
    /// Ubicación donde se realiza el evento
    /// </summary>
    public Location Location { get; set; } = null!;

    /// <summary>
    /// Usuario organizador del evento
    /// </summary>
    public User Organizer { get; set; } = null!;

    /// <summary>
    /// Categoría del evento
    /// </summary>
    public Category Category { get; set; } = null!;

    /// <summary>
    /// Inscripciones al evento
    /// </summary>
    public ICollection<Registration> Registrations { get; set; } = new List<Registration>();
}
