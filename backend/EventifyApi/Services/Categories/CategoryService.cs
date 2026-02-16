using AutoMapper;
using EventifyApi.Data;
using EventifyApi.Models.DTOs.Categories;
using Microsoft.EntityFrameworkCore;

namespace EventifyApi.Services.Categories;




public class CategoryService : ICategoryService
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;

    public CategoryService(ApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    
    
    
    public async Task<List<CategoryDto>> GetAllAsync()
    {
        var categories = await _context.Categories
            .OrderBy(c => c.Name)
            .ToListAsync();

        return _mapper.Map<List<CategoryDto>>(categories);
    }

    
    
    
    public async Task<CategoryDto> GetByIdAsync(int id)
    {
        var category = await _context.Categories.FindAsync(id);

        if (category == null)
        {
            throw new KeyNotFoundException($"Categoría con ID {id} no encontrada");
        }

        return _mapper.Map<CategoryDto>(category);
    }
}
