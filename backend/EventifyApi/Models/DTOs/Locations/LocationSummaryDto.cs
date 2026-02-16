namespace EventifyApi.Models.DTOs.Locations;

/// <summary>
/// DTO resumido de ubicación (para listados y referencias)
/// </summary>
public class LocationSummaryDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public int Capacity { get; set; }
    public string? ImageUrl { get; set; }
    public bool IsActive { get; set; }
}
