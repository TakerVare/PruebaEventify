using EventifyApi.Models.DTOs.Common;
using EventifyApi.Models.DTOs.Locations;
using EventifyApi.Services.Locations;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EventifyApi.Controllers;




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

    
    
    
    
    
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse<LocationDto>>> Create([FromBody] CreateLocationDto createDto)
    {
        
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

    
    
    
    
    
    
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse<LocationDto>>> Update(int id, [FromBody] UpdateLocationDto updateDto)
    {
        
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
