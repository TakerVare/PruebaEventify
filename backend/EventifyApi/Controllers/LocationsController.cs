using EventifyApi.Models.DTOs.Common;
using EventifyApi.Models.DTOs.Locations;
using EventifyApi.Services.Locations;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EventifyApi.Controllers;

/// <summary>
/// Controlador de ubicaciones
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class LocationsController : ControllerBase
{
    private readonly ILocationService _locationService;
    private readonly IValidator<CreateLocationDto> _createValidator;
    private readonly IValidator<UpdateLocationDto> _updateValidator;

    public LocationsController(
        ILocationService locationService,
        IValidator<CreateLocationDto> createValidator,
        IValidator<UpdateLocationDto> updateValidator)
    {
        _locationService = locationService;
        _createValidator = createValidator;
        _updateValidator = updateValidator;
    }

    /// <summary>
    /// Obtiene ubicaciones con paginación y filtros
    /// </summary>
    /// <param name="page">Número de página (default: 1)</param>
    /// <param name="pageSize">Tamaño de página (default: 10, max: 100)</param>
    /// <param name="search">Búsqueda por nombre o dirección</param>
    /// <param name="isActive">Filtrar por estado activo</param>
    /// <returns>Lista paginada de ubicaciones</returns>
    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<PaginatedResponse<LocationDto>>> GetAll(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? search = null,
        [FromQuery] bool? isActive = null)
    {
        try
        {
            var result = await _locationService.GetAllAsync(page, pageSize, search, isActive);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new ApiErrorResponse(500, $"Error al obtener ubicaciones: {ex.Message}"));
        }
    }

    /// <summary>
    /// Obtiene solo ubicaciones activas (para selección en formularios)
    /// </summary>
    /// <returns>Lista de ubicaciones activas</returns>
    [HttpGet("active")]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponse<List<LocationSummaryDto>>>> GetActive()
    {
        try
        {
            var locations = await _locationService.GetActiveAsync();
            return Ok(new ApiResponse<List<LocationSummaryDto>>(locations, "Ubicaciones activas obtenidas exitosamente"));
        }
        catch (Exception ex)
        {
            return StatusCode(500, new ApiErrorResponse(500, $"Error al obtener ubicaciones activas: {ex.Message}"));
        }
    }

    /// <summary>
    /// Obtiene una ubicación por ID
    /// </summary>
    /// <param name="id">ID de la ubicación</param>
    /// <returns>Ubicación encontrada</returns>
    [HttpGet("{id}")]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponse<LocationDto>>> GetById(int id)
    {
        try
        {
            var location = await _locationService.GetByIdAsync(id);
            return Ok(new ApiResponse<LocationDto>(location, "Ubicación obtenida exitosamente"));
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new ApiErrorResponse(404, ex.Message));
        }
        catch (Exception ex)
        {
            return StatusCode(500, new ApiErrorResponse(500, $"Error al obtener ubicación: {ex.Message}"));
        }
    }

    /// <summary>
    /// Crea una nueva ubicación (Solo Admin)
    /// </summary>
    /// <param name="createDto">Datos de la nueva ubicación</param>
    /// <returns>Ubicación creada</returns>
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse<LocationDto>>> Create([FromBody] CreateLocationDto createDto)
    {
        // Validar DTO
        var validationResult = await _createValidator.ValidateAsync(createDto);
        if (!validationResult.IsValid)
        {
            var errors = validationResult.Errors
                .GroupBy(e => e.PropertyName)
                .ToDictionary(g => g.Key, g => g.Select(e => e.ErrorMessage).ToList());
            return BadRequest(new ApiErrorResponse(400, "Errores de validación", errors));
        }

        try
        {
            var location = await _locationService.CreateAsync(createDto);
            return CreatedAtAction(nameof(GetById), new { id = location.Id },
                new ApiResponse<LocationDto>(location, "Ubicación creada exitosamente"));
        }
        catch (Exception ex)
        {
            return StatusCode(500, new ApiErrorResponse(500, $"Error al crear ubicación: {ex.Message}"));
        }
    }

    /// <summary>
    /// Actualiza una ubicación existente (Solo Admin)
    /// </summary>
    /// <param name="id">ID de la ubicación</param>
    /// <param name="updateDto">Datos actualizados</param>
    /// <returns>Ubicación actualizada</returns>
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse<LocationDto>>> Update(int id, [FromBody] UpdateLocationDto updateDto)
    {
        // Validar DTO
        var validationResult = await _updateValidator.ValidateAsync(updateDto);
        if (!validationResult.IsValid)
        {
            var errors = validationResult.Errors
                .GroupBy(e => e.PropertyName)
                .ToDictionary(g => g.Key, g => g.Select(e => e.ErrorMessage).ToList());
            return BadRequest(new ApiErrorResponse(400, "Errores de validación", errors));
        }

        try
        {
            var location = await _locationService.UpdateAsync(id, updateDto);
            return Ok(new ApiResponse<LocationDto>(location, "Ubicación actualizada exitosamente"));
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new ApiErrorResponse(404, ex.Message));
        }
        catch (Exception ex)
        {
            return StatusCode(500, new ApiErrorResponse(500, $"Error al actualizar ubicación: {ex.Message}"));
        }
    }

    /// <summary>
    /// Elimina una ubicación (Solo Admin)
    /// </summary>
    /// <param name="id">ID de la ubicación</param>
    /// <returns>Confirmación de eliminación</returns>
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse<object>>> Delete(int id)
    {
        try
        {
            await _locationService.DeleteAsync(id);
            return Ok(new ApiResponse<object>(null, "Ubicación eliminada exitosamente"));
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new ApiErrorResponse(404, ex.Message));
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new ApiErrorResponse(400, ex.Message));
        }
        catch (Exception ex)
        {
            return StatusCode(500, new ApiErrorResponse(500, $"Error al eliminar ubicación: {ex.Message}"));
        }
    }
}
