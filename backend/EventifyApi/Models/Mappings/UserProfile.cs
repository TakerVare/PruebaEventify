using AutoMapper;
using EventifyApi.Models.DTOs.Users;
using EventifyApi.Models.Entities;

namespace EventifyApi.Models.Mappings;




public class UserProfile : Profile
{
    public UserProfile()
    {
        
        CreateMap<User, UserDto>()
            .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => $"{src.FirstName} {src.LastName}"));

        
        CreateMap<User, UserSummaryDto>()
            .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => $"{src.FirstName} {src.LastName}"));
    }
}
