using EventifyApi.Models.Entities;
using EventifyApi.Models.Entities.Enums;

namespace EventifyApi.Helpers;

/// <summary>
/// Extensiones para IQueryable con filtros y ordenación
/// </summary>
public static class QueryableExtensions
{
    /// <summary>
    /// Aplica filtros de búsqueda a eventos
    /// </summary>
    public static IQueryable<Event> ApplyEventFilters(
        this IQueryable<Event> query,
        string? search,
        EventStatus? status,
        int? categoryId,
        int? locationId,
        DateTime? startDate,
        DateTime? endDate)
    {
        // Filtro por búsqueda (título o descripción) - case insensitive
        if (!string.IsNullOrWhiteSpace(search))
        {
            var searchLower = search.ToLower();
            query = query.Where(e =>
                e.Title.ToLower().Contains(searchLower) ||
                e.Description.ToLower().Contains(searchLower));
        }

        // Filtro por estado
        if (status.HasValue)
        {
            query = query.Where(e => e.Status == status.Value);
        }

        // Filtro por categoría
        if (categoryId.HasValue && categoryId.Value > 0)
        {
            query = query.Where(e => e.CategoryId == categoryId.Value);
        }

        // Filtro por ubicación
        if (locationId.HasValue && locationId.Value > 0)
        {
            query = query.Where(e => e.LocationId == locationId.Value);
        }

        // Filtro por rango de fechas
        // Lógica: mostrar eventos que se superponen con el rango de fechas especificado
        // Un evento se superpone si: empieza antes de que termine el rango Y termina después de que empiece el rango
        if (startDate.HasValue && endDate.HasValue)
        {
            // Ambas fechas proporcionadas: buscar eventos que se superpongan con el rango
            query = query.Where(e => e.StartDate <= endDate.Value && e.EndDate >= startDate.Value);
        }
        else if (startDate.HasValue)
        {
            // Solo fecha de inicio: buscar eventos que terminan después de esta fecha
            query = query.Where(e => e.EndDate >= startDate.Value);
        }
        else if (endDate.HasValue)
        {
            // Solo fecha de fin: buscar eventos que empiezan antes de esta fecha
            query = query.Where(e => e.StartDate <= endDate.Value);
        }

        return query;
    }

    /// <summary>
    /// Aplica ordenación a eventos
    /// </summary>
    public static IQueryable<Event> ApplyEventSort(
        this IQueryable<Event> query,
        string? sortBy,
        bool sortDescending = false)
    {
        if (string.IsNullOrWhiteSpace(sortBy))
        {
            // Ordenación por defecto: fecha de inicio ascendente
            return query.OrderBy(e => e.StartDate);
        }

        return sortBy.ToLower() switch
        {
            "title" => sortDescending
                ? query.OrderByDescending(e => e.Title)
                : query.OrderBy(e => e.Title),
            "startdate" => sortDescending
                ? query.OrderByDescending(e => e.StartDate)
                : query.OrderBy(e => e.StartDate),
            "enddate" => sortDescending
                ? query.OrderByDescending(e => e.EndDate)
                : query.OrderBy(e => e.EndDate),
            "capacity" => sortDescending
                ? query.OrderByDescending(e => e.Capacity)
                : query.OrderBy(e => e.Capacity),
            "registeredcount" => sortDescending
                ? query.OrderByDescending(e => e.RegisteredCount)
                : query.OrderBy(e => e.RegisteredCount),
            "createdat" => sortDescending
                ? query.OrderByDescending(e => e.CreatedAt)
                : query.OrderBy(e => e.CreatedAt),
            _ => query.OrderBy(e => e.StartDate)
        };
    }
}
