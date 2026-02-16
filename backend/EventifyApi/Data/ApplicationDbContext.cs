using EventifyApi.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace EventifyApi.Data;

/// <summary>
/// DbContext principal de la aplicación Eventify
/// </summary>
public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    // =============================================================================
    // DBSETS - Tablas de la base de datos
    // =============================================================================

    /// <summary>
    /// Usuarios del sistema
    /// </summary>
    public DbSet<User> Users { get; set; }

    /// <summary>
    /// Eventos
    /// </summary>
    public DbSet<Event> Events { get; set; }

    /// <summary>
    /// Ubicaciones donde se realizan eventos
    /// </summary>
    public DbSet<Location> Locations { get; set; }

    /// <summary>
    /// Categorías de eventos
    /// </summary>
    public DbSet<Category> Categories { get; set; }

    /// <summary>
    /// Inscripciones de usuarios a eventos
    /// </summary>
    public DbSet<Registration> Registrations { get; set; }

    // =============================================================================
    // CONFIGURACIÓN DEL MODELO
    // =============================================================================

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Aplicar todas las configuraciones Fluent API del assembly actual
        // Esto busca automáticamente todas las clases que implementen IEntityTypeConfiguration<T>
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);
    }
}
