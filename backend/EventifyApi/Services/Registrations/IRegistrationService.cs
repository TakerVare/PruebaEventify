using EventifyApi.Models.DTOs.Registrations;

namespace EventifyApi.Services.Registrations;




public interface IRegistrationService
{
    
    
    
    Task<RegistrationDto> RegisterToEventAsync(CreateRegistrationDto createDto, int userId);

    
    
    
    Task<List<RegistrationDto>> GetMyRegistrationsAsync(int userId);

    
    
    
    Task<RegistrationDto> GetByIdAsync(int id, int currentUserId, string userRole);

    
    
    
    Task CancelRegistrationAsync(int id, int currentUserId);

    
    
    
    Task<RegistrationDto> UpdateStatusAsync(int id, UpdateRegistrationDto updateDto, int currentUserId, string userRole);
}
