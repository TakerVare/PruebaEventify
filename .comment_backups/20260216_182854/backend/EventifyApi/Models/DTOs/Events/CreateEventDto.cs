namespace EventifyApi.Models.DTOs.Events;

/// <summary>
/// DTO para crear nuevo evento
/// </summary>
public class CreateEventDto
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public int Capacity { get; set; }
    public string? ImageUrl { get; set; }
    public int LocationId { get; set; }
    public int CategoryId { get; set; }
}
