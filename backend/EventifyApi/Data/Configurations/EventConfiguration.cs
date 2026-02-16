using EventifyApi.Models.Entities;
using EventifyApi.Models.Entities.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace EventifyApi.Data.Configurations;

/// <summary>
/// Configuración Fluent API para la entidad Event
/// </summary>
public class EventConfiguration : IEntityTypeConfiguration<Event>
{
    public void Configure(EntityTypeBuilder<Event> builder)
    {
        // =========================================================================
        // TABLA Y CLAVE PRIMARIA
        // =========================================================================
        builder.ToTable("Events");
        builder.HasKey(e => e.Id);

        // =========================================================================
        // PROPIEDADES
        // =========================================================================

        // Title - Requerido, máximo 200 caracteres
        builder.Property(e => e.Title)
            .IsRequired()
            .HasMaxLength(200);

        // Description - Requerido, máximo 2000 caracteres
        builder.Property(e => e.Description)
            .IsRequired()
            .HasMaxLength(2000);

        // StartDate - Requerido
        builder.Property(e => e.StartDate)
            .IsRequired();

        // EndDate - Requerido
        builder.Property(e => e.EndDate)
            .IsRequired();

        // Capacity - Requerido, debe ser positivo
        builder.Property(e => e.Capacity)
            .IsRequired();

        // RegisteredCount - Valor por defecto 0
        builder.Property(e => e.RegisteredCount)
            .IsRequired()
            .HasDefaultValue(0);

        // ImageUrl - Opcional
        builder.Property(e => e.ImageUrl)
            .HasMaxLength(500);

        // Status - Almacenar como string
        builder.Property(e => e.Status)
            .IsRequired()
            .HasConversion<string>()
            .HasMaxLength(50)
            .HasDefaultValue(EventStatus.Draft);

        // CreatedAt - Requerido
        builder.Property(e => e.CreatedAt)
            .IsRequired()
            .HasDefaultValueSql("GETUTCDATE()");

        // UpdatedAt - Opcional
        builder.Property(e => e.UpdatedAt)
            .IsRequired(false);

        // =========================================================================
        // ÍNDICES
        // =========================================================================

        // Índice en StartDate para búsquedas por fecha
        builder.HasIndex(e => e.StartDate)
            .HasDatabaseName("IX_Events_StartDate");

        // Índice en Status para filtros
        builder.HasIndex(e => e.Status)
            .HasDatabaseName("IX_Events_Status");

        // Índice compuesto en LocationId y StartDate
        builder.HasIndex(e => new { e.LocationId, e.StartDate })
            .HasDatabaseName("IX_Events_Location_StartDate");

        // =========================================================================
        // RELACIONES
        // =========================================================================

        // Event pertenece a una Location
        builder.HasOne(e => e.Location)
            .WithMany(l => l.Events)
            .HasForeignKey(e => e.LocationId)
            .OnDelete(DeleteBehavior.Restrict); // No borrar locations con eventos

        // Event pertenece a un Organizer (User)
        builder.HasOne(e => e.Organizer)
            .WithMany(u => u.OrganizedEvents)
            .HasForeignKey(e => e.OrganizerId)
            .OnDelete(DeleteBehavior.Restrict); // No borrar organizadores con eventos

        // Event pertenece a una Category
        builder.HasOne(e => e.Category)
            .WithMany(c => c.Events)
            .HasForeignKey(e => e.CategoryId)
            .OnDelete(DeleteBehavior.Restrict); // No borrar categorías con eventos

        // Event tiene muchas Registrations
        builder.HasMany(e => e.Registrations)
            .WithOne(r => r.Event)
            .HasForeignKey(r => r.EventId)
            .OnDelete(DeleteBehavior.Cascade); // Si se borra evento, borrar registrations
    }
}
