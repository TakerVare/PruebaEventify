using AutoMapper;
using EventifyApi.Models.DTOs.Registrations;
using EventifyApi.Models.Entities;
using EventifyApi.Models.Entities.Enums;

namespace EventifyApi.Models.Mappings;




public class RegistrationProfile : Profile
{
    public RegistrationProfile()
    {
        
        CreateMap<Registration, RegistrationDto>();

        
        CreateMap<CreateRegistrationDto, Registration>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.UserId, opt => opt.Ignore())
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => RegistrationStatus.Confirmed))
            .ForMember(dest => dest.RegistrationDate, opt => opt.Ignore())
            .ForMember(dest => dest.User, opt => opt.Ignore())
            .ForMember(dest => dest.Event, opt => opt.Ignore());

        
        CreateMap<UpdateRegistrationDto, Registration>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.UserId, opt => opt.Ignore())
            .ForMember(dest => dest.EventId, opt => opt.Ignore())
            .ForMember(dest => dest.RegistrationDate, opt => opt.Ignore())
            .ForMember(dest => dest.User, opt => opt.Ignore())
            .ForMember(dest => dest.Event, opt => opt.Ignore());
    }
}
