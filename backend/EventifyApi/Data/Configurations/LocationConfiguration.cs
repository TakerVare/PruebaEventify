using EventifyApi.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace EventifyApi.Data.Configurations;

/// <summary>
/// Configuración Fluent API para la entidad Location
/// </summary>
public class LocationConfiguration : IEntityTypeConfiguration<Location>
{
    public void Configure(EntityTypeBuilder<Location> builder)
    {
        // =========================================================================
        // TABLA Y CLAVE PRIMARIA
        // =========================================================================
        builder.ToTable("Locations");
        builder.HasKey(l => l.Id);

        // =========================================================================
        // PROPIEDADES
        // =========================================================================

        // Name - Requerido, máximo 200 caracteres
        builder.Property(l => l.Name)
            .IsRequired()
            .HasMaxLength(200);

        // Address - Requerido, máximo 500 caracteres
        builder.Property(l => l.Address)
            .IsRequired()
            .HasMaxLength(500);

        // Capacity - Requerido
        builder.Property(l => l.Capacity)
            .IsRequired();

        // Description - Opcional
        builder.Property(l => l.Description)
            .HasMaxLength(1000);

        // ImageUrl - Opcional
        builder.Property(l => l.ImageUrl)
            .HasMaxLength(500);

        // IsActive - Valor por defecto true
        builder.Property(l => l.IsActive)
            .IsRequired()
            .HasDefaultValue(true);

        // Latitude - Opcional
        builder.Property(l => l.Latitude)
            .HasPrecision(10, 8);

        // Longitude - Opcional
        builder.Property(l => l.Longitude)
            .HasPrecision(11, 8);

        // ContactEmail - Opcional
        builder.Property(l => l.ContactEmail)
            .HasMaxLength(255);

        // ContactPhone - Opcional
        builder.Property(l => l.ContactPhone)
            .HasMaxLength(50);

        // CreatedAt - Requerido
        builder.Property(l => l.CreatedAt)
            .IsRequired()
            .HasDefaultValueSql("GETUTCDATE()");

        // UpdatedAt - Opcional
        builder.Property(l => l.UpdatedAt)
            .IsRequired(false);

        // =========================================================================
        // ÍNDICES
        // =========================================================================

        // Índice en Name para búsquedas
        builder.HasIndex(l => l.Name)
            .HasDatabaseName("IX_Locations_Name");

        // Índice en IsActive para filtros
        builder.HasIndex(l => l.IsActive)
            .HasDatabaseName("IX_Locations_IsActive");
    }
}
