using AutoMapper;
using EventifyApi.Models.DTOs.Auth;
using EventifyApi.Models.DTOs.Common;
using EventifyApi.Models.DTOs.Users;
using EventifyApi.Services.Auth;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace EventifyApi.Controllers;

/// <summary>
/// Controlador de autenticación y gestión de sesión
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly IMapper _mapper;
    private readonly IValidator<LoginDto> _loginValidator;
    private readonly IValidator<RegisterDto> _registerValidator;
    private readonly IValidator<ChangePasswordDto> _changePasswordValidator;

    public AuthController(
        IAuthService authService,
        IMapper mapper,
        IValidator<LoginDto> loginValidator,
        IValidator<RegisterDto> registerValidator,
        IValidator<ChangePasswordDto> changePasswordValidator)
    {
        _authService = authService;
        _mapper = mapper;
        _loginValidator = loginValidator;
        _registerValidator = registerValidator;
        _changePasswordValidator = changePasswordValidator;
    }

    /// <summary>
    /// Login de usuario
    /// </summary>
    /// <param name="loginDto">Credenciales de acceso</param>
    /// <returns>Token JWT y datos del usuario</returns>
    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponse<AuthResponseDto>>> Login([FromBody] LoginDto loginDto)
    {
        // Validar DTO
        var validationResult = await _loginValidator.ValidateAsync(loginDto);
        if (!validationResult.IsValid)
        {
            var errors = validationResult.Errors
                .GroupBy(e => e.PropertyName)
                .ToDictionary(g => g.Key, g => g.Select(e => e.ErrorMessage).ToList());
            return BadRequest(new ApiErrorResponse(400, "Errores de validación", errors));
        }

        try
        {
            var result = await _authService.LoginAsync(loginDto);
            return Ok(new ApiResponse<AuthResponseDto>(result, "Login exitoso"));
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new ApiErrorResponse(401, ex.Message));
        }
    }

    /// <summary>
    /// Registro de nuevo usuario
    /// </summary>
    /// <param name="registerDto">Datos del nuevo usuario</param>
    /// <returns>Token JWT y datos del usuario registrado</returns>
    [HttpPost("register")]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponse<AuthResponseDto>>> Register([FromBody] RegisterDto registerDto)
    {
        // Validar DTO
        var validationResult = await _registerValidator.ValidateAsync(registerDto);
        if (!validationResult.IsValid)
        {
            var errors = validationResult.Errors
                .GroupBy(e => e.PropertyName)
                .ToDictionary(g => g.Key, g => g.Select(e => e.ErrorMessage).ToList());
            return BadRequest(new ApiErrorResponse(400, "Errores de validación", errors));
        }

        try
        {
            var result = await _authService.RegisterAsync(registerDto);
            return Ok(new ApiResponse<AuthResponseDto>(result, "Usuario registrado exitosamente"));
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new ApiErrorResponse(400, ex.Message));
        }
    }

    /// <summary>
    /// Obtiene los datos del usuario autenticado
    /// </summary>
    /// <returns>Datos del usuario actual</returns>
    [HttpGet("me")]
    [Authorize]
    public async Task<ActionResult<ApiResponse<UserDto>>> GetCurrentUser()
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized(new ApiErrorResponse(401, "Usuario no autenticado"));
            }

            var userId = int.Parse(userIdClaim);
            var user = await _authService.GetCurrentUserAsync(userId);
            var userDto = _mapper.Map<UserDto>(user);

            return Ok(new ApiResponse<UserDto>(userDto, "Usuario obtenido exitosamente"));
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new ApiErrorResponse(404, ex.Message));
        }
    }

    /// <summary>
    /// Cambia la contraseña del usuario autenticado
    /// </summary>
    /// <param name="changePasswordDto">Contraseña actual y nueva contraseña</param>
    /// <returns>Confirmación del cambio</returns>
    [HttpPost("change-password")]
    [Authorize]
    public async Task<ActionResult<ApiResponse<object>>> ChangePassword([FromBody] ChangePasswordDto changePasswordDto)
    {
        // Validar DTO
        var validationResult = await _changePasswordValidator.ValidateAsync(changePasswordDto);
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
            await _authService.ChangePasswordAsync(userId, changePasswordDto);

            return Ok(new ApiResponse<object>(null, "Contraseña cambiada exitosamente"));
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new ApiErrorResponse(401, ex.Message));
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new ApiErrorResponse(404, ex.Message));
        }
    }
}
