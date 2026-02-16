using AutoMapper;
using EventifyApi.Data;
using EventifyApi.Helpers;
using EventifyApi.Models.DTOs.Auth;
using EventifyApi.Models.DTOs.Users;
using EventifyApi.Models.Entities;
using EventifyApi.Models.Entities.Enums;
using Microsoft.EntityFrameworkCore;

namespace EventifyApi.Services.Auth;

/// <summary>
/// Servicio de autenticación con JWT
/// </summary>
public class AuthService : IAuthService
{
    private readonly ApplicationDbContext _context;
    private readonly JwtHelper _jwtHelper;
    private readonly IMapper _mapper;

    public AuthService(ApplicationDbContext context, JwtHelper jwtHelper, IMapper mapper)
    {
        _context = context;
        _jwtHelper = jwtHelper;
        _mapper = mapper;
    }

    /// <summary>
    /// Autentica un usuario con email y contraseña
    /// </summary>
    public async Task<AuthResponseDto> LoginAsync(LoginDto loginDto)
    {
        // Buscar usuario por email
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == loginDto.Email);

        if (user == null)
        {
            throw new UnauthorizedAccessException("Credenciales inválidas");
        }

        // Verificar contraseña
        if (!PasswordHelper.VerifyPassword(loginDto.Password, user.PasswordHash))
        {
            throw new UnauthorizedAccessException("Credenciales inválidas");
        }

        // Verificar que el usuario esté activo
        if (!user.IsActive)
        {
            throw new UnauthorizedAccessException("Usuario inactivo");
        }

        // Generar token JWT
        var token = _jwtHelper.GenerateToken(user);
        var expiresAt = _jwtHelper.GetTokenExpiration();

        // Mapear usuario a DTO
        var userDto = _mapper.Map<UserDto>(user);

        return new AuthResponseDto
        {
            Token = token,
            ExpiresAt = expiresAt,
            User = userDto
        };
    }

    /// <summary>
    /// Registra un nuevo usuario
    /// </summary>
    public async Task<AuthResponseDto> RegisterAsync(RegisterDto registerDto)
    {
        // Verificar si el email ya existe
        if (await _context.Users.AnyAsync(u => u.Email == registerDto.Email))
        {
            throw new InvalidOperationException("El email ya está registrado");
        }

        // Crear nuevo usuario
        var user = new User
        {
            Email = registerDto.Email,
            PasswordHash = PasswordHelper.HashPassword(registerDto.Password),
            FirstName = registerDto.FirstName,
            LastName = registerDto.LastName,
            Role = UserRole.User, // Por defecto, todos los registros son User
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        // Generar token JWT
        var token = _jwtHelper.GenerateToken(user);
        var expiresAt = _jwtHelper.GetTokenExpiration();

        // Mapear usuario a DTO
        var userDto = _mapper.Map<UserDto>(user);

        return new AuthResponseDto
        {
            Token = token,
            ExpiresAt = expiresAt,
            User = userDto
        };
    }

    /// <summary>
    /// Obtiene el usuario actual por ID
    /// </summary>
    public async Task<User> GetCurrentUserAsync(int userId)
    {
        var user = await _context.Users.FindAsync(userId);

        if (user == null)
        {
            throw new KeyNotFoundException("Usuario no encontrado");
        }

        return user;
    }

    /// <summary>
    /// Cambia la contraseña del usuario
    /// </summary>
    public async Task ChangePasswordAsync(int userId, ChangePasswordDto changePasswordDto)
    {
        var user = await GetCurrentUserAsync(userId);

        // Verificar contraseña actual
        if (!PasswordHelper.VerifyPassword(changePasswordDto.CurrentPassword, user.PasswordHash))
        {
            throw new UnauthorizedAccessException("La contraseña actual es incorrecta");
        }

        // Actualizar contraseña
        user.PasswordHash = PasswordHelper.HashPassword(changePasswordDto.NewPassword);
        user.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
    }
}
