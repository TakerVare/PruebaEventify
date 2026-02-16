namespace EventifyApi.Models.DTOs.Events;

/// <summary>
/// DTO de estadísticas de eventos para dashboard
/// </summary>
public class EventStatsDto
{
    public int TotalEvents { get; set; }
    public int ActiveEvents { get; set; }
    public int TotalRegistrations { get; set; }
    public double AverageOccupancy { get; set; }

    public Dictionary<string, int> EventsByCategory { get; set; } = new();
    public Dictionary<string, int> RegistrationsByMonth { get; set; } = new();
    public Dictionary<string, int> EventsByStatus { get; set; } = new();
}
