using AutoMapper;
using EventifyApi.Models.DTOs.Categories;
using EventifyApi.Models.Entities;

namespace EventifyApi.Models.Mappings;

/// <summary>
/// Perfil de AutoMapper para mapeos de Category
/// </summary>
public class CategoryProfile : Profile
{
    public CategoryProfile()
    {
        // Category -> CategoryDto
        CreateMap<Category, CategoryDto>();
    }
}
