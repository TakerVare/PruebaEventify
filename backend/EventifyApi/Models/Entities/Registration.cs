using EventifyApi.Models.Entities.Enums;

namespace EventifyApi.Models.Entities;




public class Registration
{
    
    
    
    public int Id { get; set; }

    
    
    
    public RegistrationStatus Status { get; set; } = RegistrationStatus.Pending;

    
    
    
    public DateTime RegistrationDate { get; set; } = DateTime.UtcNow;

    
    
    
    public string? Notes { get; set; }

    
    
    

    
    
    
    public int UserId { get; set; }

    
    
    
    public int EventId { get; set; }

    
    
    

    
    
    
    public User User { get; set; } = null!;

    
    
    
    public Event Event { get; set; } = null!;
}
