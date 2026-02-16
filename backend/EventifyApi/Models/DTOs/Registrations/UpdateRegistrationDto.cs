using EventifyApi.Models.Entities.Enums;

namespace EventifyApi.Models.DTOs.Registrations;

/// <summary>
/// DTO para actualizar estado de inscripción (Organizer/Admin)
/// </summary>
public class UpdateRegistrationDto
{
    public RegistrationStatus Status { get; set; }
    public string? Notes { get; set; }
}
