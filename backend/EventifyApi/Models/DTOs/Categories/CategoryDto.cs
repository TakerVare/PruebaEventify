namespace EventifyApi.Models.DTOs.Categories;

/// <summary>
/// DTO completo de categoría
/// </summary>
public class CategoryDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Color { get; set; } = string.Empty;
    public string Icon { get; set; } = string.Empty;
    public string? Description { get; set; }
}
