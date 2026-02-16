using EventifyApi.Models.DTOs.Categories;

namespace EventifyApi.Services.Categories;




public interface ICategoryService
{
    
    
    
    Task<List<CategoryDto>> GetAllAsync();

    
    
    
    Task<CategoryDto> GetByIdAsync(int id);
}
