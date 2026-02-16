using EventifyApi.Models.DTOs.Common;
using EventifyApi.Models.DTOs.Locations;

namespace EventifyApi.Services.Locations;




public interface ILocationService
{
    
    
    
    Task<PaginatedResponse<LocationDto>> GetAllAsync(int page, int pageSize, string? search, bool? isActive);

    
    
    
    Task<List<LocationSummaryDto>> GetActiveAsync();

    
    
    
    Task<LocationDto> GetByIdAsync(int id);

    
    
    
    Task<LocationDto> CreateAsync(CreateLocationDto createDto);

    
    
    
    Task<LocationDto> UpdateAsync(int id, UpdateLocationDto updateDto);

    
    
    
    Task DeleteAsync(int id);
}
