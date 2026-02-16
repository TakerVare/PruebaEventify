using EventifyApi.Models.DTOs.Common;
using EventifyApi.Models.DTOs.Registrations;
using EventifyApi.Services.Registrations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace EventifyApi.Controllers;

/// <summary>
/// Controlador de inscripciones
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class RegistrationsController : ControllerBase
{
    private readonly IRegistrationService _registrationService;

    public RegistrationsController(IRegistrationService registrationService)
    {
        _registrationService = registrationService;
    }

    /// <summary>
    /// Registra al usuario actual en un evento
    /// </summary>
    [HttpPost("register")]
    public async Task<ActionResult<ApiResponse<RegistrationDto>>> Register([FromBody] CreateRegistrationDto createDto)
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized(new ApiErrorResponse(401, "Usuario no autenticado"));
            }

            var userId = int.Parse(userIdClaim);
            var registration = await _registrationService.RegisterToEventAsync(createDto, userId);
            return Ok(new ApiResponse<RegistrationDto>(registration, "Inscripción realizada exitosamente"));
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
            return StatusCode(500, new ApiErrorResponse(500, $"Error al registrar: {ex.Message}"));
        }
    }

    /// <summary>
    /// Obtiene las inscripciones del usuario actual
    /// </summary>
    [HttpGet("my-registrations")]
    public async Task<ActionResult<ApiResponse<List<RegistrationDto>>>> GetMyRegistrations()
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized(new ApiErrorResponse(401, "Usuario no autenticado"));
            }

            var userId = int.Parse(userIdClaim);
            var registrations = await _registrationService.GetMyRegistrationsAsync(userId);
            return Ok(new ApiResponse<List<RegistrationDto>>(registrations, "Inscripciones obtenidas exitosamente"));
        }
        catch (Exception ex)
        {
            return StatusCode(500, new ApiErrorResponse(500, $"Error al obtener inscripciones: {ex.Message}"));
        }
    }

    /// <summary>
    /// Obtiene una inscripción por ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<RegistrationDto>>> GetById(int id)
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
            var registration = await _registrationService.GetByIdAsync(id, userId, userRole);
            return Ok(new ApiResponse<RegistrationDto>(registration, "Inscripción obtenida exitosamente"));
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new ApiErrorResponse(404, ex.Message));
        }
        catch (UnauthorizedAccessException ex)
        {
            return StatusCode(403, new ApiErrorResponse(403, ex.Message));
        }
        catch (Exception ex)
        {
            return StatusCode(500, new ApiErrorResponse(500, $"Error al obtener inscripción: {ex.Message}"));
        }
    }

    /// <summary>
    /// Cancela una inscripción del usuario actual
    /// </summary>
    [HttpPost("{id}/cancel")]
    public async Task<ActionResult<ApiResponse<object>>> Cancel(int id)
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized(new ApiErrorResponse(401, "Usuario no autenticado"));
            }

            var userId = int.Parse(userIdClaim);
            await _registrationService.CancelRegistrationAsync(id, userId);
            return Ok(new ApiResponse<object>(null, "Inscripción cancelada exitosamente"));
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
            return StatusCode(500, new ApiErrorResponse(500, $"Error al cancelar inscripción: {ex.Message}"));
        }
    }

    /// <summary>
    /// Actualiza el estado de una inscripción (Organizer/Admin del evento)
    /// </summary>
    [HttpPut("{id}")]
    [Authorize(Roles = "Organizer,Admin")]
    public async Task<ActionResult<ApiResponse<RegistrationDto>>> UpdateStatus(int id, [FromBody] UpdateRegistrationDto updateDto)
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
            var registration = await _registrationService.UpdateStatusAsync(id, updateDto, userId, userRole);
            return Ok(new ApiResponse<RegistrationDto>(registration, "Inscripción actualizada exitosamente"));
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new ApiErrorResponse(404, ex.Message));
        }
        catch (UnauthorizedAccessException ex)
        {
            return StatusCode(403, new ApiErrorResponse(403, ex.Message));
        }
        catch (Exception ex)
        {
            return StatusCode(500, new ApiErrorResponse(500, $"Error al actualizar inscripción: {ex.Message}"));
        }
    }
}
