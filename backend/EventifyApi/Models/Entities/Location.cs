namespace EventifyApi.Models.Entities;

/// <summary>
/// Entidad Location - Representa una ubicación donde se pueden realizar eventos
/// </summary>
public class Location
{
    /// <summary>
    /// ID único de la ubicación
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// Nombre de la ubicación
    /// </summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Dirección completa
    /// </summary>
    public string Address { get; set; } = string.Empty;

    /// <summary>
    /// Capacidad máxima de la ubicación
    /// </summary>
    public int Capacity { get; set; }

    /// <summary>
    /// Descripción de la ubicación
    /// </summary>
    public string? Description { get; set; }

    /// <summary>
    /// URL de imagen de la ubicación
    /// </summary>
    public string? ImageUrl { get; set; }

    /// <summary>
    /// Indica si la ubicación está activa
    /// </summary>
    public bool IsActive { get; set; } = true;

    /// <summary>
    /// Latitud geográfica
    /// </summary>
    public double? Latitude { get; set; }

    /// <summary>
    /// Longitud geográfica
    /// </summary>
    public double? Longitude { get; set; }

    /// <summary>
    /// Email de contacto de la ubicación
    /// </summary>
    public string? ContactEmail { get; set; }

    /// <summary>
    /// Teléfono de contacto
    /// </summary>
    public string? ContactPhone { get; set; }

    /// <summary>
    /// Fecha de creación
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
    /// Eventos realizados en esta ubicación
    /// </summary>
    public ICollection<Event> Events { get; set; } = new List<Event>();
}
