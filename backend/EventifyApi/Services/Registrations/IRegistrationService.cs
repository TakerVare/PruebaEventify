using EventifyApi.Models.DTOs.Registrations;

namespace EventifyApi.Services.Registrations;

/// <summary>
/// Interfaz del servicio de inscripciones
/// </summary>
public interface IRegistrationService
{
    /// <summary>
    /// Registra al usuario actual en un evento
    /// </summary>
    Task<RegistrationDto> RegisterToEventAsync(CreateRegistrationDto createDto, int userId);

    /// <summary>
    /// Obtiene las inscripciones del usuario actual
    /// </summary>
    Task<List<RegistrationDto>> GetMyRegistrationsAsync(int userId);

    /// <summary>
    /// Obtiene una inscripción por ID
    /// </summary>
    Task<RegistrationDto> GetByIdAsync(int id, int currentUserId, string userRole);

    /// <summary>
    /// Cancela una inscripción (solo el usuario inscrito)
    /// </summary>
    Task CancelRegistrationAsync(int id, int currentUserId);

    /// <summary>
    /// Actualiza el estado de una inscripción (Organizer/Admin del evento)
    /// </summary>
    Task<RegistrationDto> UpdateStatusAsync(int id, UpdateRegistrationDto updateDto, int currentUserId, string userRole);
}
