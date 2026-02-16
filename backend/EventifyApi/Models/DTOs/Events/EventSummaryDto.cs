using EventifyApi.Models.Entities.Enums;

namespace EventifyApi.Models.DTOs.Events;

/// <summary>
/// DTO resumido de evento (para listados)
/// </summary>
public class EventSummaryDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public int Capacity { get; set; }
    public int RegisteredCount { get; set; }
    public string? ImageUrl { get; set; }
    public EventStatus Status { get; set; }

    // Relaciones simplificadas (solo IDs y nombres)
    public int LocationId { get; set; }
    public string LocationName { get; set; } = string.Empty;
    public int CategoryId { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public string CategoryColor { get; set; } = string.Empty;

    // Propiedades calculadas
    public bool IsFull => RegisteredCount >= Capacity;
    public int AvailableSpots => Math.Max(0, Capacity - RegisteredCount);
}
