using EventifyApi.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace EventifyApi.Data.Configurations;

/// <summary>
/// Configuración Fluent API para la entidad Category
/// </summary>
public class CategoryConfiguration : IEntityTypeConfiguration<Category>
{
    public void Configure(EntityTypeBuilder<Category> builder)
    {
        // =========================================================================
        // TABLA Y CLAVE PRIMARIA
        // =========================================================================
        builder.ToTable("Categories");
        builder.HasKey(c => c.Id);

        // =========================================================================
        // PROPIEDADES
        // =========================================================================

        // Name - Requerido, máximo 100 caracteres
        builder.Property(c => c.Name)
            .IsRequired()
            .HasMaxLength(100);

        // Color - Requerido (formato hex: #RRGGBB)
        builder.Property(c => c.Color)
            .IsRequired()
            .HasMaxLength(7);

        // Icon - Requerido (Material Design Icons)
        builder.Property(c => c.Icon)
            .IsRequired()
            .HasMaxLength(100);

        // Description - Opcional
        builder.Property(c => c.Description)
            .HasMaxLength(500);
    }
}
