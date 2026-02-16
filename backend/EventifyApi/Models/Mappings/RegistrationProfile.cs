using AutoMapper;
using EventifyApi.Models.DTOs.Registrations;
using EventifyApi.Models.Entities;
using EventifyApi.Models.Entities.Enums;

namespace EventifyApi.Models.Mappings;

/// <summary>
/// Perfil de AutoMapper para mapeos de Registration
/// </summary>
public class RegistrationProfile : Profile
{
    public RegistrationProfile()
    {
        // Registration -> RegistrationDto
        CreateMap<Registration, RegistrationDto>();

        // CreateRegistrationDto -> Registration
        CreateMap<CreateRegistrationDto, Registration>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.UserId, opt => opt.Ignore())
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => RegistrationStatus.Confirmed))
            .ForMember(dest => dest.RegistrationDate, opt => opt.Ignore())
            .ForMember(dest => dest.User, opt => opt.Ignore())
            .ForMember(dest => dest.Event, opt => opt.Ignore());

        // UpdateRegistrationDto -> Registration
        CreateMap<UpdateRegistrationDto, Registration>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.UserId, opt => opt.Ignore())
            .ForMember(dest => dest.EventId, opt => opt.Ignore())
            .ForMember(dest => dest.RegistrationDate, opt => opt.Ignore())
            .ForMember(dest => dest.User, opt => opt.Ignore())
            .ForMember(dest => dest.Event, opt => opt.Ignore());
    }
}
