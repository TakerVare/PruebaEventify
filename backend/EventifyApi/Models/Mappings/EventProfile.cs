using AutoMapper;
using EventifyApi.Models.DTOs.Events;
using EventifyApi.Models.Entities;
using EventifyApi.Models.Entities.Enums;

namespace EventifyApi.Models.Mappings;

/// <summary>
/// Perfil de AutoMapper para mapeos de Event
/// </summary>
public class EventProfile : Profile
{
    public EventProfile()
    {
        // Event -> EventDto
        CreateMap<Event, EventDto>()
            .ForMember(dest => dest.IsFull, opt => opt.MapFrom(src => src.RegisteredCount >= src.Capacity))
            .ForMember(dest => dest.AvailableSpots, opt => opt.MapFrom(src => Math.Max(0, src.Capacity - src.RegisteredCount)))
            .ForMember(dest => dest.OccupancyPercentage, opt => opt.MapFrom(src =>
                src.Capacity > 0 ? (src.RegisteredCount * 100.0 / src.Capacity) : 0));

        // Event -> EventSummaryDto
        CreateMap<Event, EventSummaryDto>()
            .ForMember(dest => dest.LocationId, opt => opt.MapFrom(src => src.LocationId))
            .ForMember(dest => dest.LocationName, opt => opt.MapFrom(src => src.Location.Name))
            .ForMember(dest => dest.CategoryId, opt => opt.MapFrom(src => src.CategoryId))
            .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category.Name))
            .ForMember(dest => dest.CategoryColor, opt => opt.MapFrom(src => src.Category.Color))
            .ForMember(dest => dest.IsFull, opt => opt.MapFrom(src => src.RegisteredCount >= src.Capacity))
            .ForMember(dest => dest.AvailableSpots, opt => opt.MapFrom(src => Math.Max(0, src.Capacity - src.RegisteredCount)));

        // CreateEventDto -> Event
        CreateMap<CreateEventDto, Event>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.RegisteredCount, opt => opt.MapFrom(src => 0))
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => EventStatus.Draft))
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.OrganizerId, opt => opt.Ignore())
            .ForMember(dest => dest.Organizer, opt => opt.Ignore())
            .ForMember(dest => dest.Location, opt => opt.Ignore())
            .ForMember(dest => dest.Category, opt => opt.Ignore())
            .ForMember(dest => dest.Registrations, opt => opt.Ignore());

        // UpdateEventDto -> Event
        CreateMap<UpdateEventDto, Event>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.RegisteredCount, opt => opt.Ignore())
            .ForMember(dest => dest.Status, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.OrganizerId, opt => opt.Ignore())
            .ForMember(dest => dest.Organizer, opt => opt.Ignore())
            .ForMember(dest => dest.Location, opt => opt.Ignore())
            .ForMember(dest => dest.Category, opt => opt.Ignore())
            .ForMember(dest => dest.Registrations, opt => opt.Ignore());
    }
}
