namespace EventifyApi.Data.Seeders;

/// <summary>
/// Seeder principal que orquesta todos los seeders de datos
/// </summary>
public static class DbSeeder
{
    /// <summary>
    /// Ejecuta todos los seeders en orden
    /// </summary>
    public static async Task SeedAsync(ApplicationDbContext context)
    {
        Console.WriteLine("=============================================================================");
        Console.WriteLine("🌱 EJECUTANDO SEEDERS DE DATOS INICIALES");
        Console.WriteLine("=============================================================================");

        try
        {
            // Ejecutar seeders en orden
            await CategorySeeder.SeedAsync(context);
            await UserSeeder.SeedAsync(context);

            Console.WriteLine("=============================================================================");
            Console.WriteLine("✅ SEEDERS COMPLETADOS EXITOSAMENTE");
            Console.WriteLine("=============================================================================");
        }
        catch (Exception ex)
        {
            Console.WriteLine("=============================================================================");
            Console.WriteLine("❌ ERROR AL EJECUTAR SEEDERS");
            Console.WriteLine($"Error: {ex.Message}");
            Console.WriteLine("=============================================================================");
            throw;
        }
    }
}
