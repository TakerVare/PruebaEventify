using AutoMapper;
using EventifyApi.Models.DTOs.Categories;
using EventifyApi.Models.Entities;

namespace EventifyApi.Models.Mappings;




public class CategoryProfile : Profile
{
    public CategoryProfile()
    {
        
        CreateMap<Category, CategoryDto>();
    }
}
