using AutoMapper;
using EventifyApi.Models.DTOs.Locations;
using EventifyApi.Models.Entities;

namespace EventifyApi.Models.Mappings;

/// <summary>
/// Perfil de AutoMapper para mapeos de Location
/// </summary>
public class LocationProfile : Profile
{
    public LocationProfile()
    {
        // Location -> LocationDto
        CreateMap<Location, LocationDto>();

        // Location -> LocationSummaryDto
        CreateMap<Location, LocationSummaryDto>();

        // CreateLocationDto -> Location
        CreateMap<CreateLocationDto, Location>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.Events, opt => opt.Ignore());

        // UpdateLocationDto -> Location
        CreateMap<UpdateLocationDto, Location>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.Events, opt => opt.Ignore());
    }
}
