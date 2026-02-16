namespace EventifyApi.Models.Entities.Enums;

/// <summary>
/// Estado de un evento
/// </summary>
public enum EventStatus
{
    /// <summary>
    /// Borrador - Solo visible para el organizador
    /// </summary>
    Draft = 0,

    /// <summary>
    /// Publicado - Visible públicamente y permite inscripciones
    /// </summary>
    Published = 1,

    /// <summary>
    /// Cancelado - No permite inscripciones
    /// </summary>
    Cancelled = 2,

    /// <summary>
    /// Completado - Evento pasado
    /// </summary>
    Completed = 3
}
