using EventifyApi.Models.Entities;
using EventifyApi.Models.Entities.Enums;
using Microsoft.EntityFrameworkCore;

namespace EventifyApi.Data.Seeders;

/// <summary>
/// Seeder de usuarios de prueba
/// </summary>
public static class UserSeeder
{
    /// <summary>
    /// Inserta los usuarios de prueba en la base de datos
    /// </summary>
    public static async Task SeedAsync(ApplicationDbContext context)
    {
        // Verificar si ya existen usuarios
        if (await context.Users.AnyAsync())
        {
            Console.WriteLine("✓ Usuarios ya existen, omitiendo seeder...");
            return;
        }

        Console.WriteLine("→ Insertando usuarios de prueba...");

        var users = new List<User>
        {
            // Administrador
            new User
            {
                Email = "admin@eventify.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123!"),
                FirstName = "Admin",
                LastName = "Sistema",
                Role = UserRole.Admin,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            // Organizador
            new User
            {
                Email = "organizador@eventify.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Org123!"),
                FirstName = "María",
                LastName = "Organizadora",
                Role = UserRole.Organizer,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            // Usuario regular
            new User
            {
                Email = "usuario@eventify.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("User123!"),
                FirstName = "Juan",
                LastName = "Usuario",
                Role = UserRole.User,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            }
        };

        await context.Users.AddRangeAsync(users);
        await context.SaveChangesAsync();

        Console.WriteLine($"✓ {users.Count} usuarios insertados correctamente");
        Console.WriteLine("  • admin@eventify.com / Admin123! (Admin)");
        Console.WriteLine("  • organizador@eventify.com / Org123! (Organizer)");
        Console.WriteLine("  • usuario@eventify.com / User123! (User)");
    }
}
