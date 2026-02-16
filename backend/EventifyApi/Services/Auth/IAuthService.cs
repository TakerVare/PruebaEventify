using EventifyApi.Models.DTOs.Auth;

namespace EventifyApi.Services.Auth;




public interface IAuthService
{
    
    
    
    Task<AuthResponseDto> LoginAsync(LoginDto loginDto);

    
    
    
    Task<AuthResponseDto> RegisterAsync(RegisterDto registerDto);

    
    
    
    Task<Models.Entities.User> GetCurrentUserAsync(int userId);

    
    
    
    Task ChangePasswordAsync(int userId, ChangePasswordDto changePasswordDto);
}
