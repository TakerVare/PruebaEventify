using AutoMapper;
using EventifyApi.Models.DTOs.Users;
using EventifyApi.Models.Entities;

namespace EventifyApi.Models.Mappings;

/// <summary>
/// Perfil de AutoMapper para mapeos de User
/// </summary>
public class UserProfile : Profile
{
    public UserProfile()
    {
        // User -> UserDto
        CreateMap<User, UserDto>()
            .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => $"{src.FirstName} {src.LastName}"));

        // User -> UserSummaryDto
        CreateMap<User, UserSummaryDto>()
            .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => $"{src.FirstName} {src.LastName}"));
    }
}
