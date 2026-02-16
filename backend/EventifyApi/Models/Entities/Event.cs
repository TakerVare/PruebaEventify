using EventifyApi.Models.Entities.Enums;

namespace EventifyApi.Models.Entities;




public class Event
{
    
    
    
    public int Id { get; set; }

    
    
    
    public string Title { get; set; } = string.Empty;

    
    
    
    public string Description { get; set; } = string.Empty;

    
    
    
    public DateTime StartDate { get; set; }

    
    
    
    public DateTime EndDate { get; set; }

    
    
    
    public int Capacity { get; set; }

    
    
    
    public int RegisteredCount { get; set; } = 0;

    
    
    
    public string? ImageUrl { get; set; }

    
    
    
    public EventStatus Status { get; set; } = EventStatus.Draft;

    
    
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    
    
    
    public DateTime? UpdatedAt { get; set; }

    
    
    

    
    
    
    public int LocationId { get; set; }

    
    
    
    public int OrganizerId { get; set; }

    
    
    
    public int CategoryId { get; set; }

    
    
    

    
    
    
    public Location Location { get; set; } = null!;

    
    
    
    public User Organizer { get; set; } = null!;

    
    
    
    public Category Category { get; set; } = null!;

    
    
    
    public ICollection<Registration> Registrations { get; set; } = new List<Registration>();
}
