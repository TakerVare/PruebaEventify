using EventifyApi.Models.DTOs.Common;
using EventifyApi.Models.DTOs.Locations;

namespace EventifyApi.Services.Locations;

/// <summary>
/// Interfaz del servicio de ubicaciones
/// </summary>
public interface ILocationService
{
    /// <summary>
    /// Obtiene ubicaciones con paginación y filtros
    /// </summary>
    Task<PaginatedResponse<LocationDto>> GetAllAsync(int page, int pageSize, string? search, bool? isActive);

    /// <summary>
    /// Obtiene solo ubicaciones activas (para selección en formularios)
    /// </summary>
    Task<List<LocationSummaryDto>> GetActiveAsync();

    /// <summary>
    /// Obtiene una ubicación por ID
    /// </summary>
    Task<LocationDto> GetByIdAsync(int id);

    /// <summary>
    /// Crea una nueva ubicación
    /// </summary>
    Task<LocationDto> CreateAsync(CreateLocationDto createDto);

    /// <summary>
    /// Actualiza una ubicación existente
    /// </summary>
    Task<LocationDto> UpdateAsync(int id, UpdateLocationDto updateDto);

    /// <summary>
    /// Elimina una ubicación
    /// </summary>
    Task DeleteAsync(int id);
}
