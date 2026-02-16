namespace EventifyApi.Models.Entities;

/// <summary>
/// Entidad Category - Representa una categoría de eventos
/// </summary>
public class Category
{
    /// <summary>
    /// ID único de la categoría
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// Nombre de la categoría
    /// </summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Color en formato hexadecimal (ej: #FF5733)
    /// </summary>
    public string Color { get; set; } = string.Empty;

    /// <summary>
    /// Icono de Material Design Icons (ej: mdi-calendar)
    /// </summary>
    public string Icon { get; set; } = string.Empty;

    /// <summary>
    /// Descripción de la categoría
    /// </summary>
    public string? Description { get; set; }

    // =============================================================================
    // RELACIONES DE NAVEGACIÓN
    // =============================================================================

    /// <summary>
    /// Eventos de esta categoría
    /// </summary>
    public ICollection<Event> Events { get; set; } = new List<Event>();
}
