using EventifyApi.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace EventifyApi.Data.Seeders;

/// <summary>
/// Seeder de categorías predefinidas
/// </summary>
public static class CategorySeeder
{
    /// <summary>
    /// Inserta las categorías predefinidas en la base de datos
    /// </summary>
    public static async Task SeedAsync(ApplicationDbContext context)
    {
        // Verificar si ya existen categorías
        if (await context.Categories.AnyAsync())
        {
            Console.WriteLine("✓ Categorías ya existen, omitiendo seeder...");
            return;
        }

        Console.WriteLine("→ Insertando categorías predefinidas...");

        var categories = new List<Category>
        {
            new Category
            {
                Name = "Conferencia",
                Color = "#3B82F6",
                Icon = "mdi-microphone",
                Description = "Eventos de conferencias y charlas profesionales"
            },
            new Category
            {
                Name = "Taller",
                Color = "#10B981",
                Icon = "mdi-tools",
                Description = "Talleres prácticos y workshops"
            },
            new Category
            {
                Name = "Networking",
                Color = "#8B5CF6",
                Icon = "mdi-account-group",
                Description = "Eventos de networking y conexión profesional"
            },
            new Category
            {
                Name = "Webinar",
                Color = "#F59E0B",
                Icon = "mdi-monitor",
                Description = "Seminarios web y eventos virtuales"
            },
            new Category
            {
                Name = "Concierto",
                Color = "#EF4444",
                Icon = "mdi-music",
                Description = "Eventos musicales y conciertos"
            }
        };

        await context.Categories.AddRangeAsync(categories);
        await context.SaveChangesAsync();

        Console.WriteLine($"✓ {categories.Count} categorías insertadas correctamente");
    }
}
