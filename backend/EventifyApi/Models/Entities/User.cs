using EventifyApi.Models.Entities.Enums;

namespace EventifyApi.Models.Entities;




public class User
{
    
    
    
    public int Id { get; set; }

    
    
    
    public string Email { get; set; } = string.Empty;

    
    
    
    public string PasswordHash { get; set; } = string.Empty;

    
    
    
    public string FirstName { get; set; } = string.Empty;

    
    
    
    public string LastName { get; set; } = string.Empty;

    
    
    
    public UserRole Role { get; set; } = UserRole.User;

    
    
    
    public bool IsActive { get; set; } = true;

    
    
    
    public string? AvatarUrl { get; set; }

    
    
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    
    
    
    public DateTime? UpdatedAt { get; set; }

    
    
    

    
    
    
    public ICollection<Event> OrganizedEvents { get; set; } = new List<Event>();

    
    
    
    public ICollection<Registration> Registrations { get; set; } = new List<Registration>();
}
