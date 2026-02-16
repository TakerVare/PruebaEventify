namespace EventifyApi.Models.Entities;




public class Location
{
    
    
    
    public int Id { get; set; }

    
    
    
    public string Name { get; set; } = string.Empty;

    
    
    
    public string Address { get; set; } = string.Empty;

    
    
    
    public int Capacity { get; set; }

    
    
    
    public string? Description { get; set; }

    
    
    
    public string? ImageUrl { get; set; }

    
    
    
    public bool IsActive { get; set; } = true;

    
    
    
    public double? Latitude { get; set; }

    
    
    
    public double? Longitude { get; set; }

    
    
    
    public string? ContactEmail { get; set; }

    
    
    
    public string? ContactPhone { get; set; }

    
    
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    
    
    
    public DateTime? UpdatedAt { get; set; }

    
    
    

    
    
    
    public ICollection<Event> Events { get; set; } = new List<Event>();
}
