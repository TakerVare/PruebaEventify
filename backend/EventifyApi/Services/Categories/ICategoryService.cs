using EventifyApi.Models.DTOs.Categories;

namespace EventifyApi.Services.Categories;

/// <summary>
/// Interfaz del servicio de categorías
/// </summary>
public interface ICategoryService
{
    /// <summary>
    /// Obtiene todas las categorías
    /// </summary>
    Task<List<CategoryDto>> GetAllAsync();

    /// <summary>
    /// Obtiene una categoría por ID
    /// </summary>
    Task<CategoryDto> GetByIdAsync(int id);
}
