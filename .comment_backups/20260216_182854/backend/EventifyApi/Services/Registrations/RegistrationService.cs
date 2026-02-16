using AutoMapper;
using EventifyApi.Data;
using EventifyApi.Models.DTOs.Registrations;
using EventifyApi.Models.Entities;
using EventifyApi.Models.Entities.Enums;
using Microsoft.EntityFrameworkCore;

namespace EventifyApi.Services.Registrations;

/// <summary>
/// Servicio de inscripciones con validación de capacidad
/// </summary>
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
        // Verificar que el evento existe
        var eventEntity = await _context.Events.FindAsync(createDto.EventId);
        if (eventEntity == null)
        {
            throw new KeyNotFoundException($"Evento con ID {createDto.EventId} no encontrado");
        }

        // Verificar que el evento está publicado
        if (eventEntity.Status != EventStatus.Published)
        {
            throw new InvalidOperationException("Solo puedes inscribirte en eventos publicados");
        }

        // Verificar que el evento no ha finalizado
        if (eventEntity.EndDate < DateTime.UtcNow)
        {
            throw new InvalidOperationException("No puedes inscribirte en un evento que ya finalizó");
        }

        // Verificar que el usuario no esté ya registrado
        var existingRegistration = await _context.Registrations
            .FirstOrDefaultAsync(r => r.UserId == userId && r.EventId == createDto.EventId);

        if (existingRegistration != null)
        {
            throw new InvalidOperationException("Ya estás inscrito en este evento");
        }

        // Verificar que hay capacidad disponible
        if (eventEntity.RegisteredCount >= eventEntity.Capacity)
        {
            throw new InvalidOperationException("El evento está lleno");
        }

        // Crear inscripción
        var registration = _mapper.Map<Registration>(createDto);
        registration.UserId = userId;
        registration.RegistrationDate = DateTime.UtcNow;

        _context.Registrations.Add(registration);

        // Incrementar contador de registrados
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

        // Verificar permisos: el usuario inscrito, el organizador del evento o Admin
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

        // Verificar permisos: solo el usuario inscrito puede cancelar su propia inscripción
        if (registration.UserId != currentUserId)
        {
            throw new UnauthorizedAccessException("No tienes permisos para cancelar esta inscripción");
        }

        // Verificar que la inscripción no esté ya cancelada
        if (registration.Status == RegistrationStatus.Cancelled)
        {
            throw new InvalidOperationException("Esta inscripción ya está cancelada");
        }

        // Verificar que el evento no haya finalizado
        if (registration.Event.EndDate < DateTime.UtcNow)
        {
            throw new InvalidOperationException("No puedes cancelar una inscripción a un evento que ya finalizó");
        }

        // Cambiar estado a Cancelled
        registration.Status = RegistrationStatus.Cancelled;

        // Decrementar contador de registrados
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

        // Verificar permisos: solo el organizador del evento o Admin pueden cambiar el estado
        if (registration.Event.OrganizerId != currentUserId && userRole != "Admin")
        {
            throw new UnauthorizedAccessException("No tienes permisos para actualizar esta inscripción");
        }

        // Mapear cambios
        var oldStatus = registration.Status;
        _mapper.Map(updateDto, registration);

        // Si cambió de Cancelled a otro estado, incrementar contador
        if (oldStatus == RegistrationStatus.Cancelled && updateDto.Status != RegistrationStatus.Cancelled)
        {
            registration.Event.RegisteredCount++;
        }
        // Si cambió de otro estado a Cancelled, decrementar contador
        else if (oldStatus != RegistrationStatus.Cancelled && updateDto.Status == RegistrationStatus.Cancelled)
        {
            registration.Event.RegisteredCount--;
        }

        await _context.SaveChangesAsync();

        return await GetByIdAsync(id, currentUserId, userRole);
    }
}
