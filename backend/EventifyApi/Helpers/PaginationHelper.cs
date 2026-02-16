using EventifyApi.Models.DTOs.Common;
using Microsoft.EntityFrameworkCore;

namespace EventifyApi.Helpers;




public static class PaginationHelper
{
    
    
    
    public static async Task<PaginatedResponse<T>> CreatePaginatedResponseAsync<T>(
        IQueryable<T> query,
        int page,
        int pageSize)
    {
        
        page = Math.Max(1, page);
        pageSize = Math.Max(1, Math.Min(100, pageSize)); 

        
        var totalCount = await query.CountAsync();

        
        var items = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return new PaginatedResponse<T>(items, page, pageSize, totalCount);
    }
}
