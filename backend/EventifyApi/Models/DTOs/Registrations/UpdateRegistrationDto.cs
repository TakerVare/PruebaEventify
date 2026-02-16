using EventifyApi.Models.Entities.Enums;

namespace EventifyApi.Models.DTOs.Registrations;




public class UpdateRegistrationDto
{
    public RegistrationStatus Status { get; set; }
    public string? Notes { get; set; }
}
