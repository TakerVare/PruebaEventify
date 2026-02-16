using EventifyApi.Models.DTOs.Categories;
using EventifyApi.Models.DTOs.Common;
using EventifyApi.Services.Categories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EventifyApi.Controllers;




[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly ICategoryService _categoryService;

    public CategoriesController(ICategoryService categoryService)
    {
        _categoryService = categoryService;
    }

    
    
    
    
    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponse<List<CategoryDto>>>> GetAll()
    {
        try
        {
            var categories = await _categoryService.GetAllAsync();
            return Ok(new ApiResponse<List<CategoryDto>>(categories, "Categorías obtenidas exitosamente"));
        }
        catch (Exception ex)
        {
            return StatusCode(500, new ApiErrorResponse(500, $"Error al obtener categorías: {ex.Message}"));
        }
    }

    
    
    
    
    
    [HttpGet("{id}")]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponse<CategoryDto>>> GetById(int id)
    {
        try
        {
            var category = await _categoryService.GetByIdAsync(id);
            return Ok(new ApiResponse<CategoryDto>(category, "Categoría obtenida exitosamente"));
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new ApiErrorResponse(404, ex.Message));
        }
        catch (Exception ex)
        {
            return StatusCode(500, new ApiErrorResponse(500, $"Error al obtener categoría: {ex.Message}"));
        }
    }
}
