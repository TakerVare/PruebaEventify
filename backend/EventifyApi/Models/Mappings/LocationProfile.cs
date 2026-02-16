using AutoMapper;
using EventifyApi.Models.DTOs.Locations;
using EventifyApi.Models.Entities;

namespace EventifyApi.Models.Mappings;




public class LocationProfile : Profile
{
    public LocationProfile()
    {
        
        CreateMap<Location, LocationDto>();

        
        CreateMap<Location, LocationSummaryDto>();

        
        CreateMap<CreateLocationDto, Location>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.Events, opt => opt.Ignore());

        
        CreateMap<UpdateLocationDto, Location>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.Events, opt => opt.Ignore());
    }
}
