namespace EventifyApi.Data.Seeders;




public static class DbSeeder
{
    
    
    
    public static async Task SeedAsync(ApplicationDbContext context)
    {
        Console.WriteLine("=============================================================================");
        Console.WriteLine("🌱 EJECUTANDO SEEDERS DE DATOS INICIALES");
        Console.WriteLine("=============================================================================");

        try
        {
            
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
