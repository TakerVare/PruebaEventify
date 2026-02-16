using EventifyApi.Models.DTOs.Common;
using Microsoft.EntityFrameworkCore;

namespace EventifyApi.Helpers;

/// <summary>
/// Helper para paginación de resultados
/// </summary>
public static class PaginationHelper
{
    /// <summary>
    /// Aplica paginación a un IQueryable y retorna PaginatedResponse
    /// </summary>
    public static async Task<PaginatedResponse<T>> CreatePaginatedResponseAsync<T>(
        IQueryable<T> query,
        int page,
        int pageSize)
    {
        // Validar parámetros
        page = Math.Max(1, page);
        pageSize = Math.Max(1, Math.Min(100, pageSize)); // Máximo 100 items por página

        // Contar total de registros
        var totalCount = await query.CountAsync();

        // Aplicar paginación
        var items = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return new PaginatedResponse<T>(items, page, pageSize, totalCount);
    }
}
