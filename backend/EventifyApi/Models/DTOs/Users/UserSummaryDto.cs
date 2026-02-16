using EventifyApi.Models.Entities.Enums;

namespace EventifyApi.Models.DTOs.Users;

/// <summary>
/// DTO resumido de usuario (para listados y referencias)
/// </summary>
public class UserSummaryDto
{
    public int Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string FullName => $"{FirstName} {LastName}";
    public UserRole Role { get; set; }
    public string? AvatarUrl { get; set; }
}
