using EventifyApi.Models.DTOs.Common;
using EventifyApi.Models.DTOs.Events;
using EventifyApi.Models.Entities.Enums;

namespace EventifyApi.Services.Events;




public interface IEventService
{
    
    
    
    Task<PaginatedResponse<EventSummaryDto>> GetAllAsync(
        int page, int pageSize, string? search, EventStatus? status,
        int? categoryId, int? locationId, DateTime? startDate, DateTime? endDate,
        string? sortBy, bool sortDescending);

    
    
    
    Task<EventDto> GetByIdAsync(int id);

    
    
    
    Task<List<EventSummaryDto>> GetMyEventsAsync(int organizerId);

    
    
    
    Task<EventDto> CreateAsync(CreateEventDto createDto, int organizerId);

    
    
    
    Task<EventDto> UpdateAsync(int id, UpdateEventDto updateDto, int currentUserId, string userRole);

    
    
    
    Task DeleteAsync(int id, int currentUserId, string userRole);

    
    
    
    Task<EventDto> PublishEventAsync(int id, int currentUserId, string userRole);

    
    
    
    Task<EventDto> CancelEventAsync(int id, int currentUserId, string userRole);

    
    
    
    Task<EventStatsDto> GetStatsAsync();
}
