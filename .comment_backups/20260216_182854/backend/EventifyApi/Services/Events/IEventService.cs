using EventifyApi.Models.DTOs.Common;
using EventifyApi.Models.DTOs.Events;
using EventifyApi.Models.Entities.Enums;

namespace EventifyApi.Services.Events;

/// <summary>
/// Interfaz del servicio de eventos
/// </summary>
public interface IEventService
{
    /// <summary>
    /// Obtiene eventos con paginación y filtros avanzados
    /// </summary>
    Task<PaginatedResponse<EventSummaryDto>> GetAllAsync(
        int page, int pageSize, string? search, EventStatus? status,
        int? categoryId, int? locationId, DateTime? startDate, DateTime? endDate,
        string? sortBy, bool sortDescending);

    /// <summary>
    /// Obtiene un evento por ID con todas las relaciones
    /// </summary>
    Task<EventDto> GetByIdAsync(int id);

    /// <summary>
    /// Obtiene los eventos del organizador actual
    /// </summary>
    Task<List<EventSummaryDto>> GetMyEventsAsync(int organizerId);

    /// <summary>
    /// Crea un nuevo evento
    /// </summary>
    Task<EventDto> CreateAsync(CreateEventDto createDto, int organizerId);

    /// <summary>
    /// Actualiza un evento existente (solo el organizador o Admin)
    /// </summary>
    Task<EventDto> UpdateAsync(int id, UpdateEventDto updateDto, int currentUserId, string userRole);

    /// <summary>
    /// Elimina un evento (solo el organizador o Admin)
    /// </summary>
    Task DeleteAsync(int id, int currentUserId, string userRole);

    /// <summary>
    /// Publica un evento (cambiar status a Published)
    /// </summary>
    Task<EventDto> PublishEventAsync(int id, int currentUserId, string userRole);

    /// <summary>
    /// Cancela un evento (cambiar status a Cancelled)
    /// </summary>
    Task<EventDto> CancelEventAsync(int id, int currentUserId, string userRole);

    /// <summary>
    /// Obtiene estadísticas de eventos para dashboard
    /// </summary>
    Task<EventStatsDto> GetStatsAsync();
}
