namespace EventifyApi.Helpers;

/// <summary>
/// Helper para operaciones de hashing y verificación de contraseñas
/// </summary>
public static class PasswordHelper
{
    /// <summary>
    /// Hashea una contraseña usando BCrypt
    /// </summary>
    public static string HashPassword(string password)
    {
        return BCrypt.Net.BCrypt.HashPassword(password, workFactor: 12);
    }

    /// <summary>
    /// Verifica si una contraseña coincide con su hash
    /// </summary>
    public static bool VerifyPassword(string password, string passwordHash)
    {
        return BCrypt.Net.BCrypt.Verify(password, passwordHash);
    }
}
