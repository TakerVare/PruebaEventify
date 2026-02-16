using AutoMapper;
using EventifyApi.Data;
using EventifyApi.Helpers;
using EventifyApi.Models.DTOs.Common;
using EventifyApi.Models.DTOs.Events;
using EventifyApi.Models.Entities;
using EventifyApi.Models.Entities.Enums;
using Microsoft.EntityFrameworkCore;

namespace EventifyApi.Services.Events;




public class EventService : IEventService
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;

    public EventService(ApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<PaginatedResponse<EventSummaryDto>> GetAllAsync(
        int page, int pageSize, string? search, EventStatus? status,
        int? categoryId, int? locationId, DateTime? startDate, DateTime? endDate,
        string? sortBy, bool sortDescending)
    {
        var query = _context.Events
            .Include(e => e.Location)
            .Include(e => e.Category)
            .AsQueryable();

        
        query = query.ApplyEventFilters(search, status, categoryId, locationId, startDate, endDate);

        
        query = query.ApplyEventSort(sortBy, sortDescending);

        
        var paginatedResult = await PaginationHelper.CreatePaginatedResponseAsync(query, page, pageSize);

        
        var dtos = _mapper.Map<List<EventSummaryDto>>(paginatedResult.Items);

        return new PaginatedResponse<EventSummaryDto>(dtos, page, pageSize, paginatedResult.TotalCount);
    }

    public async Task<EventDto> GetByIdAsync(int id)
    {
        var eventEntity = await _context.Events
            .Include(e => e.Location)
            .Include(e => e.Category)
            .Include(e => e.Organizer)
            .FirstOrDefaultAsync(e => e.Id == id);

        if (eventEntity == null)
        {
            throw new KeyNotFoundException($"Evento con ID {id} no encontrado");
        }

        return _mapper.Map<EventDto>(eventEntity);
    }

    public async Task<List<EventSummaryDto>> GetMyEventsAsync(int organizerId)
    {
        var events = await _context.Events
            .Include(e => e.Location)
            .Include(e => e.Category)
            .Where(e => e.OrganizerId == organizerId)
            .OrderByDescending(e => e.CreatedAt)
            .ToListAsync();

        return _mapper.Map<List<EventSummaryDto>>(events);
    }

    public async Task<EventDto> CreateAsync(CreateEventDto createDto, int organizerId)
    {
        
        var locationExists = await _context.Locations.AnyAsync(l => l.Id == createDto.LocationId);
        if (!locationExists)
        {
            throw new KeyNotFoundException($"Ubicación con ID {createDto.LocationId} no encontrada");
        }

        
        var categoryExists = await _context.Categories.AnyAsync(c => c.Id == createDto.CategoryId);
        if (!categoryExists)
        {
            throw new KeyNotFoundException($"Categoría con ID {createDto.CategoryId} no encontrada");
        }

        var eventEntity = _mapper.Map<Event>(createDto);
        eventEntity.OrganizerId = organizerId;
        eventEntity.CreatedAt = DateTime.UtcNow;

        _context.Events.Add(eventEntity);
        await _context.SaveChangesAsync();

        return await GetByIdAsync(eventEntity.Id);
    }

    public async Task<EventDto> UpdateAsync(int id, UpdateEventDto updateDto, int currentUserId, string userRole)
    {
        var eventEntity = await _context.Events.FindAsync(id);

        if (eventEntity == null)
        {
            throw new KeyNotFoundException($"Evento con ID {id} no encontrado");
        }

        
        if (eventEntity.OrganizerId != currentUserId && userRole != "Admin")
        {
            throw new UnauthorizedAccessException("No tienes permisos para actualizar este evento");
        }

        
        var locationExists = await _context.Locations.AnyAsync(l => l.Id == updateDto.LocationId);
        if (!locationExists)
        {
            throw new KeyNotFoundException($"Ubicación con ID {updateDto.LocationId} no encontrada");
        }

        
        var categoryExists = await _context.Categories.AnyAsync(c => c.Id == updateDto.CategoryId);
        if (!categoryExists)
        {
            throw new KeyNotFoundException($"Categoría con ID {updateDto.CategoryId} no encontrada");
        }

        
        if (updateDto.Capacity < eventEntity.RegisteredCount)
        {
            throw new InvalidOperationException(
                $"No se puede reducir la capacidad por debajo del número de inscritos ({eventEntity.RegisteredCount})");
        }

        
        _mapper.Map(updateDto, eventEntity);
        eventEntity.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return await GetByIdAsync(id);
    }

    public async Task DeleteAsync(int id, int currentUserId, string userRole)
    {
        var eventEntity = await _context.Events.FindAsync(id);

        if (eventEntity == null)
        {
            throw new KeyNotFoundException($"Evento con ID {id} no encontrado");
        }

        
        if (eventEntity.OrganizerId != currentUserId && userRole != "Admin")
        {
            throw new UnauthorizedAccessException("No tienes permisos para eliminar este evento");
        }

        
        if (eventEntity.RegisteredCount > 0)
        {
            throw new InvalidOperationException("No se puede eliminar un evento con inscripciones");
        }

        _context.Events.Remove(eventEntity);
        await _context.SaveChangesAsync();
    }

    public async Task<EventDto> PublishEventAsync(int id, int currentUserId, string userRole)
    {
        var eventEntity = await _context.Events.FindAsync(id);

        if (eventEntity == null)
        {
            throw new KeyNotFoundException($"Evento con ID {id} no encontrado");
        }

        
        if (eventEntity.OrganizerId != currentUserId && userRole != "Admin")
        {
            throw new UnauthorizedAccessException("No tienes permisos para publicar este evento");
        }

        
        if (eventEntity.Status != EventStatus.Draft)
        {
            throw new InvalidOperationException("Solo se pueden publicar eventos en estado Draft");
        }

        eventEntity.Status = EventStatus.Published;
        eventEntity.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return await GetByIdAsync(id);
    }

    public async Task<EventDto> CancelEventAsync(int id, int currentUserId, string userRole)
    {
        var eventEntity = await _context.Events.FindAsync(id);

        if (eventEntity == null)
        {
            throw new KeyNotFoundException($"Evento con ID {id} no encontrado");
        }

        
        if (eventEntity.OrganizerId != currentUserId && userRole != "Admin")
        {
            throw new UnauthorizedAccessException("No tienes permisos para cancelar este evento");
        }

        
        if (eventEntity.Status == EventStatus.Completed || eventEntity.Status == EventStatus.Cancelled)
        {
            throw new InvalidOperationException("No se puede cancelar un evento completado o ya cancelado");
        }

        eventEntity.Status = EventStatus.Cancelled;
        eventEntity.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return await GetByIdAsync(id);
    }

    public async Task<EventStatsDto> GetStatsAsync()
    {
        var totalEvents = await _context.Events.CountAsync();
        var activeEvents = await _context.Events.CountAsync(e =>
            e.Status == EventStatus.Published && e.EndDate >= DateTime.UtcNow);
        var totalRegistrations = await _context.Registrations.CountAsync();

        
        var events = await _context.Events.Where(e => e.Capacity > 0).ToListAsync();
        var averageOccupancy = events.Any()
            ? events.Average(e => (e.RegisteredCount * 100.0 / e.Capacity))
            : 0;

        
        var eventsByCategory = await _context.Events
            .Include(e => e.Category)
            .GroupBy(e => e.Category.Name)
            .Select(g => new { Category = g.Key, Count = g.Count() })
            .ToDictionaryAsync(x => x.Category, x => x.Count);

        
        var twelveMonthsAgo = DateTime.UtcNow.AddMonths(-12);
        var registrationsByMonth = await _context.Registrations
            .Where(r => r.RegistrationDate >= twelveMonthsAgo)
            .GroupBy(r => new { r.RegistrationDate.Year, r.RegistrationDate.Month })
            .Select(g => new
            {
                Month = $"{g.Key.Year}-{g.Key.Month:D2}",
                Count = g.Count()
            })
            .ToDictionaryAsync(x => x.Month, x => x.Count);

        
        var allEvents = await _context.Events.ToListAsync();
        var eventsByStatus = allEvents
            .GroupBy(e => e.Status.ToString())
            .ToDictionary(g => g.Key, g => g.Count());

        return new EventStatsDto
        {
            TotalEvents = totalEvents,
            ActiveEvents = activeEvents,
            TotalRegistrations = totalRegistrations,
            AverageOccupancy = Math.Round(averageOccupancy, 2),
            EventsByCategory = eventsByCategory,
            RegistrationsByMonth = registrationsByMonth,
            EventsByStatus = eventsByStatus
        };
    }
}
