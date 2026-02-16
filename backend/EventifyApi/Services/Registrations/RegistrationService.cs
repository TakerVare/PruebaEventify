using AutoMapper;
using EventifyApi.Data;
using EventifyApi.Models.DTOs.Registrations;
using EventifyApi.Models.Entities;
using EventifyApi.Models.Entities.Enums;
using Microsoft.EntityFrameworkCore;

namespace EventifyApi.Services.Registrations;




public class RegistrationService : IRegistrationService
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;

    public RegistrationService(ApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<RegistrationDto> RegisterToEventAsync(CreateRegistrationDto createDto, int userId)
    {
        
        var eventEntity = await _context.Events.FindAsync(createDto.EventId);
        if (eventEntity == null)
        {
            throw new KeyNotFoundException($"Evento con ID {createDto.EventId} no encontrado");
        }

        
        if (eventEntity.Status != EventStatus.Published)
        {
            throw new InvalidOperationException("Solo puedes inscribirte en eventos publicados");
        }

        
        if (eventEntity.EndDate < DateTime.UtcNow)
        {
            throw new InvalidOperationException("No puedes inscribirte en un evento que ya finalizó");
        }

        
        var existingRegistration = await _context.Registrations
            .FirstOrDefaultAsync(r => r.UserId == userId && r.EventId == createDto.EventId);

        if (existingRegistration != null)
        {
            throw new InvalidOperationException("Ya estás inscrito en este evento");
        }

        
        if (eventEntity.RegisteredCount >= eventEntity.Capacity)
        {
            throw new InvalidOperationException("El evento está lleno");
        }

        
        var registration = _mapper.Map<Registration>(createDto);
        registration.UserId = userId;
        registration.RegistrationDate = DateTime.UtcNow;

        _context.Registrations.Add(registration);

        
        eventEntity.RegisteredCount++;

        await _context.SaveChangesAsync();

        return await GetByIdAsync(registration.Id, userId, "User");
    }

    public async Task<List<RegistrationDto>> GetMyRegistrationsAsync(int userId)
    {
        var registrations = await _context.Registrations
            .Include(r => r.Event)
                .ThenInclude(e => e.Location)
            .Include(r => r.Event)
                .ThenInclude(e => e.Category)
            .Where(r => r.UserId == userId)
            .OrderByDescending(r => r.RegistrationDate)
            .ToListAsync();

        return _mapper.Map<List<RegistrationDto>>(registrations);
    }

    public async Task<RegistrationDto> GetByIdAsync(int id, int currentUserId, string userRole)
    {
        var registration = await _context.Registrations
            .Include(r => r.User)
            .Include(r => r.Event)
                .ThenInclude(e => e.Location)
            .Include(r => r.Event)
                .ThenInclude(e => e.Category)
            .FirstOrDefaultAsync(r => r.Id == id);

        if (registration == null)
        {
            throw new KeyNotFoundException($"Inscripción con ID {id} no encontrada");
        }

        
        if (registration.UserId != currentUserId &&
            registration.Event.OrganizerId != currentUserId &&
            userRole != "Admin")
        {
            throw new UnauthorizedAccessException("No tienes permisos para ver esta inscripción");
        }

        return _mapper.Map<RegistrationDto>(registration);
    }

    public async Task CancelRegistrationAsync(int id, int currentUserId)
    {
        var registration = await _context.Registrations
            .Include(r => r.Event)
            .FirstOrDefaultAsync(r => r.Id == id);

        if (registration == null)
        {
            throw new KeyNotFoundException($"Inscripción con ID {id} no encontrada");
        }

        
        if (registration.UserId != currentUserId)
        {
            throw new UnauthorizedAccessException("No tienes permisos para cancelar esta inscripción");
        }

        
        if (registration.Status == RegistrationStatus.Cancelled)
        {
            throw new InvalidOperationException("Esta inscripción ya está cancelada");
        }

        
        if (registration.Event.EndDate < DateTime.UtcNow)
        {
            throw new InvalidOperationException("No puedes cancelar una inscripción a un evento que ya finalizó");
        }

        
        registration.Status = RegistrationStatus.Cancelled;

        
        registration.Event.RegisteredCount--;

        await _context.SaveChangesAsync();
    }

    public async Task<RegistrationDto> UpdateStatusAsync(int id, UpdateRegistrationDto updateDto, int currentUserId, string userRole)
    {
        var registration = await _context.Registrations
            .Include(r => r.Event)
            .FirstOrDefaultAsync(r => r.Id == id);

        if (registration == null)
        {
            throw new KeyNotFoundException($"Inscripción con ID {id} no encontrada");
        }

        
        if (registration.Event.OrganizerId != currentUserId && userRole != "Admin")
        {
            throw new UnauthorizedAccessException("No tienes permisos para actualizar esta inscripción");
        }

        
        var oldStatus = registration.Status;
        _mapper.Map(updateDto, registration);

        
        if (oldStatus == RegistrationStatus.Cancelled && updateDto.Status != RegistrationStatus.Cancelled)
        {
            registration.Event.RegisteredCount++;
        }
        
        else if (oldStatus != RegistrationStatus.Cancelled && updateDto.Status == RegistrationStatus.Cancelled)
        {
            registration.Event.RegisteredCount--;
        }

        await _context.SaveChangesAsync();

        return await GetByIdAsync(id, currentUserId, userRole);
    }
}
