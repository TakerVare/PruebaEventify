using EventifyApi.Models.DTOs.Categories;
using EventifyApi.Models.DTOs.Locations;
using EventifyApi.Models.DTOs.Users;
using EventifyApi.Models.Entities.Enums;

namespace EventifyApi.Models.DTOs.Events;

/// <summary>
/// DTO completo de evento con relaciones
/// </summary>
public class EventDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public int Capacity { get; set; }
    public int RegisteredCount { get; set; }
    public string? ImageUrl { get; set; }
    public EventStatus Status { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    // Relaciones
    public LocationSummaryDto Location { get; set; } = null!;
    public UserSummaryDto Organizer { get; set; } = null!;
    public CategoryDto Category { get; set; } = null!;

    // Propiedades calculadas
    public bool IsFull => RegisteredCount >= Capacity;
    public int AvailableSpots => Math.Max(0, Capacity - RegisteredCount);
    public double OccupancyPercentage => Capacity > 0 ? (RegisteredCount * 100.0 / Capacity) : 0;
}
