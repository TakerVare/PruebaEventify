using EventifyApi.Models.DTOs.Common;
using EventifyApi.Models.DTOs.Events;
using EventifyApi.Models.Entities.Enums;
using EventifyApi.Services.Events;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace EventifyApi.Controllers;

/// <summary>
/// Controlador de eventos
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class EventsController : ControllerBase
{
    private readonly IEventService _eventService;
    private readonly IValidator<CreateEventDto> _createValidator;
    private readonly IValidator<UpdateEventDto> _updateValidator;

    public EventsController(
        IEventService eventService,
        IValidator<CreateEventDto> createValidator,
        IValidator<UpdateEventDto> updateValidator)
    {
        _eventService = eventService;
        _createValidator = createValidator;
        _updateValidator = updateValidator;
    }

    /// <summary>
    /// Obtiene eventos con paginación y filtros avanzados
    /// </summary>
    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<PaginatedResponse<EventSummaryDto>>> GetAll(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? search = null,
        [FromQuery] EventStatus? status = null,
        [FromQuery] int? categoryId = null,
        [FromQuery] int? locationId = null,
        [FromQuery] DateTime? startDate = null,
        [FromQuery] DateTime? endDate = null,
        [FromQuery] string? sortBy = null,
        [FromQuery] bool sortDescending = false)
    {
        try
        {
            var result = await _eventService.GetAllAsync(
                page, pageSize, search, status, categoryId, locationId,
                startDate, endDate, sortBy, sortDescending);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new ApiErrorResponse(500, $"Error al obtener eventos: {ex.Message}"));
        }
    }

    /// <summary>
    /// Obtiene un evento por ID
    /// </summary>
    [HttpGet("{id}")]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponse<EventDto>>> GetById(int id)
    {
        try
        {
            var eventDto = await _eventService.GetByIdAsync(id);
            return Ok(new ApiResponse<EventDto>(eventDto, "Evento obtenido exitosamente"));
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new ApiErrorResponse(404, ex.Message));
        }
        catch (Exception ex)
        {
            return StatusCode(500, new ApiErrorResponse(500, $"Error al obtener evento: {ex.Message}"));
        }
    }

    /// <summary>
    /// Obtiene los eventos del organizador actual
    /// </summary>
    [HttpGet("my-events")]
    [Authorize(Roles = "Organizer,Admin")]
    public async Task<ActionResult<ApiResponse<List<EventSummaryDto>>>> GetMyEvents()
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized(new ApiErrorResponse(401, "Usuario no autenticado"));
            }

            var userId = int.Parse(userIdClaim);
            var events = await _eventService.GetMyEventsAsync(userId);
            return Ok(new ApiResponse<List<EventSummaryDto>>(events, "Eventos obtenidos exitosamente"));
        }
        catch (Exception ex)
        {
            return StatusCode(500, new ApiErrorResponse(500, $"Error al obtener eventos: {ex.Message}"));
        }
    }

    /// <summary>
    /// Crea un nuevo evento
    /// </summary>
    [HttpPost]
    [Authorize(Roles = "Organizer,Admin")]
    public async Task<ActionResult<ApiResponse<EventDto>>> Create([FromBody] CreateEventDto createDto)
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
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized(new ApiErrorResponse(401, "Usuario no autenticado"));
            }

            var userId = int.Parse(userIdClaim);
            var eventDto = await _eventService.CreateAsync(createDto, userId);
            return CreatedAtAction(nameof(GetById), new { id = eventDto.Id },
                new ApiResponse<EventDto>(eventDto, "Evento creado exitosamente"));
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new ApiErrorResponse(404, ex.Message));
        }
        catch (Exception ex)
        {
            return StatusCode(500, new ApiErrorResponse(500, $"Error al crear evento: {ex.Message}"));
        }
    }

    /// <summary>
    /// Actualiza un evento existente
    /// </summary>
    [HttpPut("{id}")]
    [Authorize(Roles = "Organizer,Admin")]
    public async Task<ActionResult<ApiResponse<EventDto>>> Update(int id, [FromBody] UpdateEventDto updateDto)
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
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value ?? "User";

            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized(new ApiErrorResponse(401, "Usuario no autenticado"));
            }

            var userId = int.Parse(userIdClaim);
            var eventDto = await _eventService.UpdateAsync(id, updateDto, userId, userRole);
            return Ok(new ApiResponse<EventDto>(eventDto, "Evento actualizado exitosamente"));
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new ApiErrorResponse(404, ex.Message));
        }
        catch (UnauthorizedAccessException ex)
        {
            return StatusCode(403, new ApiErrorResponse(403, ex.Message));
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new ApiErrorResponse(400, ex.Message));
        }
        catch (Exception ex)
        {
            return StatusCode(500, new ApiErrorResponse(500, $"Error al actualizar evento: {ex.Message}"));
        }
    }

    /// <summary>
    /// Elimina un evento
    /// </summary>
    [HttpDelete("{id}")]
    [Authorize(Roles = "Organizer,Admin")]
    public async Task<ActionResult<ApiResponse<object>>> Delete(int id)
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value ?? "User";

            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized(new ApiErrorResponse(401, "Usuario no autenticado"));
            }

            var userId = int.Parse(userIdClaim);
            await _eventService.DeleteAsync(id, userId, userRole);
            return Ok(new ApiResponse<object>(null, "Evento eliminado exitosamente"));
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new ApiErrorResponse(404, ex.Message));
        }
        catch (UnauthorizedAccessException ex)
        {
            return StatusCode(403, new ApiErrorResponse(403, ex.Message));
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new ApiErrorResponse(400, ex.Message));
        }
        catch (Exception ex)
        {
            return StatusCode(500, new ApiErrorResponse(500, $"Error al eliminar evento: {ex.Message}"));
        }
    }

    /// <summary>
    /// Publica un evento
    /// </summary>
    [HttpPost("{id}/publish")]
    [Authorize(Roles = "Organizer,Admin")]
    public async Task<ActionResult<ApiResponse<EventDto>>> Publish(int id)
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value ?? "User";

            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized(new ApiErrorResponse(401, "Usuario no autenticado"));
            }

            var userId = int.Parse(userIdClaim);
            var eventDto = await _eventService.PublishEventAsync(id, userId, userRole);
            return Ok(new ApiResponse<EventDto>(eventDto, "Evento publicado exitosamente"));
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new ApiErrorResponse(404, ex.Message));
        }
        catch (UnauthorizedAccessException ex)
        {
            return StatusCode(403, new ApiErrorResponse(403, ex.Message));
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new ApiErrorResponse(400, ex.Message));
        }
        catch (Exception ex)
        {
            return StatusCode(500, new ApiErrorResponse(500, $"Error al publicar evento: {ex.Message}"));
        }
    }

    /// <summary>
    /// Cancela un evento
    /// </summary>
    [HttpPost("{id}/cancel")]
    [Authorize(Roles = "Organizer,Admin")]
    public async Task<ActionResult<ApiResponse<EventDto>>> Cancel(int id)
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value ?? "User";

            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized(new ApiErrorResponse(401, "Usuario no autenticado"));
            }

            var userId = int.Parse(userIdClaim);
            var eventDto = await _eventService.CancelEventAsync(id, userId, userRole);
            return Ok(new ApiResponse<EventDto>(eventDto, "Evento cancelado exitosamente"));
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new ApiErrorResponse(404, ex.Message));
        }
        catch (UnauthorizedAccessException ex)
        {
            return StatusCode(403, new ApiErrorResponse(403, ex.Message));
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new ApiErrorResponse(400, ex.Message));
        }
        catch (Exception ex)
        {
            return StatusCode(500, new ApiErrorResponse(500, $"Error al cancelar evento: {ex.Message}"));
        }
    }

    /// <summary>
    /// Obtiene estadísticas de eventos para dashboard
    /// </summary>
    [HttpGet("stats")]
    [Authorize(Roles = "Organizer,Admin")]
    public async Task<ActionResult<ApiResponse<EventStatsDto>>> GetStats()
    {
        try
        {
            var stats = await _eventService.GetStatsAsync();
            return Ok(new ApiResponse<EventStatsDto>(stats, "Estadísticas obtenidas exitosamente"));
        }
        catch (Exception ex)
        {
            return StatusCode(500, new ApiErrorResponse(500, $"Error al obtener estadísticas: {ex.Message}"));
        }
    }
}
