using AutoMapper;
using EventifyApi.Data;
using EventifyApi.Helpers;
using EventifyApi.Models.DTOs.Common;
using EventifyApi.Models.DTOs.Locations;
using EventifyApi.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace EventifyApi.Services.Locations;

/// <summary>
/// Servicio de ubicaciones con CRUD completo
/// </summary>
public class LocationService : ILocationService
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;

    public LocationService(ApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    /// <summary>
    /// Obtiene ubicaciones con paginación y filtros
    /// </summary>
    public async Task<PaginatedResponse<LocationDto>> GetAllAsync(int page, int pageSize, string? search, bool? isActive)
    {
        var query = _context.Locations.AsQueryable();

        // Filtro por búsqueda (nombre o dirección)
        if (!string.IsNullOrWhiteSpace(search))
        {
            query = query.Where(l =>
                l.Name.Contains(search) ||
                l.Address.Contains(search));
        }

        // Filtro por estado activo
        if (isActive.HasValue)
        {
            query = query.Where(l => l.IsActive == isActive.Value);
        }

        // Ordenar por nombre
        query = query.OrderBy(l => l.Name);

        // Aplicar paginación
        var paginatedResult = await PaginationHelper.CreatePaginatedResponseAsync(query, page, pageSize);

        // Mapear a DTOs
        var dtos = _mapper.Map<List<LocationDto>>(paginatedResult.Items);

        return new PaginatedResponse<LocationDto>(dtos, page, pageSize, paginatedResult.TotalCount);
    }

    /// <summary>
    /// Obtiene solo ubicaciones activas (para selección en formularios)
    /// </summary>
    public async Task<List<LocationSummaryDto>> GetActiveAsync()
    {
        var locations = await _context.Locations
            .Where(l => l.IsActive)
            .OrderBy(l => l.Name)
            .ToListAsync();

        return _mapper.Map<List<LocationSummaryDto>>(locations);
    }

    /// <summary>
    /// Obtiene una ubicación por ID
    /// </summary>
    public async Task<LocationDto> GetByIdAsync(int id)
    {
        var location = await _context.Locations.FindAsync(id);

        if (location == null)
        {
            throw new KeyNotFoundException($"Ubicación con ID {id} no encontrada");
        }

        return _mapper.Map<LocationDto>(location);
    }

    /// <summary>
    /// Crea una nueva ubicación
    /// </summary>
    public async Task<LocationDto> CreateAsync(CreateLocationDto createDto)
    {
        var location = _mapper.Map<Location>(createDto);
        location.CreatedAt = DateTime.UtcNow;

        _context.Locations.Add(location);
        await _context.SaveChangesAsync();

        return _mapper.Map<LocationDto>(location);
    }

    /// <summary>
    /// Actualiza una ubicación existente
    /// </summary>
    public async Task<LocationDto> UpdateAsync(int id, UpdateLocationDto updateDto)
    {
        var location = await _context.Locations.FindAsync(id);

        if (location == null)
        {
            throw new KeyNotFoundException($"Ubicación con ID {id} no encontrada");
        }

        // Mapear cambios
        _mapper.Map(updateDto, location);
        location.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return _mapper.Map<LocationDto>(location);
    }

    /// <summary>
    /// Elimina una ubicación
    /// </summary>
    public async Task DeleteAsync(int id)
    {
        var location = await _context.Locations.FindAsync(id);

        if (location == null)
        {
            throw new KeyNotFoundException($"Ubicación con ID {id} no encontrada");
        }

        // Verificar si tiene eventos asociados
        var hasEvents = await _context.Events.AnyAsync(e => e.LocationId == id);
        if (hasEvents)
        {
            throw new InvalidOperationException("No se puede eliminar la ubicación porque tiene eventos asociados");
        }

        _context.Locations.Remove(location);
        await _context.SaveChangesAsync();
    }
}
