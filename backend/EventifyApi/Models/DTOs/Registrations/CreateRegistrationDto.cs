namespace EventifyApi.Models.DTOs.Registrations;

/// <summary>
/// DTO para registrarse a un evento
/// </summary>
public class CreateRegistrationDto
{
    public int EventId { get; set; }
    public string? Notes { get; set; }
}
