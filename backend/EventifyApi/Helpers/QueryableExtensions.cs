using EventifyApi.Models.Entities;
using EventifyApi.Models.Entities.Enums;

namespace EventifyApi.Helpers;




public static class QueryableExtensions
{
    
    
    
    public static IQueryable<Event> ApplyEventFilters(
        this IQueryable<Event> query,
        string? search,
        EventStatus? status,
        int? categoryId,
        int? locationId,
        DateTime? startDate,
        DateTime? endDate)
    {
        
        if (!string.IsNullOrWhiteSpace(search))
        {
            var searchLower = search.ToLower();
            query = query.Where(e =>
                e.Title.ToLower().Contains(searchLower) ||
                e.Description.ToLower().Contains(searchLower));
        }

        
        if (status.HasValue)
        {
            query = query.Where(e => e.Status == status.Value);
        }

        
        if (categoryId.HasValue && categoryId.Value > 0)
        {
            query = query.Where(e => e.CategoryId == categoryId.Value);
        }

        
        if (locationId.HasValue && locationId.Value > 0)
        {
            query = query.Where(e => e.LocationId == locationId.Value);
        }

        
        
        
        if (startDate.HasValue && endDate.HasValue)
        {
            
            query = query.Where(e => e.StartDate <= endDate.Value && e.EndDate >= startDate.Value);
        }
        else if (startDate.HasValue)
        {
            
            query = query.Where(e => e.EndDate >= startDate.Value);
        }
        else if (endDate.HasValue)
        {
            
            query = query.Where(e => e.StartDate <= endDate.Value);
        }

        return query;
    }

    
    
    
    public static IQueryable<Event> ApplyEventSort(
        this IQueryable<Event> query,
        string? sortBy,
        bool sortDescending = false)
    {
        if (string.IsNullOrWhiteSpace(sortBy))
        {
            
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
