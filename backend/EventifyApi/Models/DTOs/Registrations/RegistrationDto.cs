using EventifyApi.Models.DTOs.Events;
using EventifyApi.Models.DTOs.Users;
using EventifyApi.Models.Entities.Enums;

namespace EventifyApi.Models.DTOs.Registrations;

/// <summary>
/// DTO completo de inscripción
/// </summary>
public class RegistrationDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int EventId { get; set; }
    public RegistrationStatus Status { get; set; }
    public DateTime RegistrationDate { get; set; }
    public string? Notes { get; set; }

    // Relaciones
    public UserSummaryDto? User { get; set; }
    public EventSummaryDto? Event { get; set; }
}
