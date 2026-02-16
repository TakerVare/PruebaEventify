using AutoMapper;
using EventifyApi.Data;
using EventifyApi.Helpers;
using EventifyApi.Models.DTOs.Auth;
using EventifyApi.Models.DTOs.Users;
using EventifyApi.Models.Entities;
using EventifyApi.Models.Entities.Enums;
using Microsoft.EntityFrameworkCore;

namespace EventifyApi.Services.Auth;




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

    
    
    
    public async Task<AuthResponseDto> LoginAsync(LoginDto loginDto)
    {
        
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == loginDto.Email);

        if (user == null)
        {
            throw new UnauthorizedAccessException("Credenciales inválidas");
        }

        
        if (!PasswordHelper.VerifyPassword(loginDto.Password, user.PasswordHash))
        {
            throw new UnauthorizedAccessException("Credenciales inválidas");
        }

        
        if (!user.IsActive)
        {
            throw new UnauthorizedAccessException("Usuario inactivo");
        }

        
        var token = _jwtHelper.GenerateToken(user);
        var expiresAt = _jwtHelper.GetTokenExpiration();

        
        var userDto = _mapper.Map<UserDto>(user);

        return new AuthResponseDto
        {
            Token = token,
            ExpiresAt = expiresAt,
            User = userDto
        };
    }

    
    
    
    public async Task<AuthResponseDto> RegisterAsync(RegisterDto registerDto)
    {
        
        if (await _context.Users.AnyAsync(u => u.Email == registerDto.Email))
        {
            throw new InvalidOperationException("El email ya está registrado");
        }

        
        var user = new User
        {
            Email = registerDto.Email,
            PasswordHash = PasswordHelper.HashPassword(registerDto.Password),
            FirstName = registerDto.FirstName,
            LastName = registerDto.LastName,
            Role = UserRole.User, 
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        
        var token = _jwtHelper.GenerateToken(user);
        var expiresAt = _jwtHelper.GetTokenExpiration();

        
        var userDto = _mapper.Map<UserDto>(user);

        return new AuthResponseDto
        {
            Token = token,
            ExpiresAt = expiresAt,
            User = userDto
        };
    }

    
    
    
    public async Task<User> GetCurrentUserAsync(int userId)
    {
        var user = await _context.Users.FindAsync(userId);

        if (user == null)
        {
            throw new KeyNotFoundException("Usuario no encontrado");
        }

        return user;
    }

    
    
    
    public async Task ChangePasswordAsync(int userId, ChangePasswordDto changePasswordDto)
    {
        var user = await GetCurrentUserAsync(userId);

        
        if (!PasswordHelper.VerifyPassword(changePasswordDto.CurrentPassword, user.PasswordHash))
        {
            throw new UnauthorizedAccessException("La contraseña actual es incorrecta");
        }

        
        user.PasswordHash = PasswordHelper.HashPassword(changePasswordDto.NewPassword);
        user.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
    }
}
