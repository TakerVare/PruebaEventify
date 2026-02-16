using EventifyApi.Models.Entities;
using EventifyApi.Models.Entities.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace EventifyApi.Data.Configurations;

/// <summary>
/// Configuración Fluent API para la entidad User
/// </summary>
public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        // =========================================================================
        // TABLA Y CLAVE PRIMARIA
        // =========================================================================
        builder.ToTable("Users");
        builder.HasKey(u => u.Id);

        // =========================================================================
        // PROPIEDADES
        // =========================================================================

        // Email - Requerido, único, máximo 255 caracteres
        builder.Property(u => u.Email)
            .IsRequired()
            .HasMaxLength(255);

        builder.HasIndex(u => u.Email)
            .IsUnique()
            .HasDatabaseName("IX_Users_Email");

        // PasswordHash - Requerido
        builder.Property(u => u.PasswordHash)
            .IsRequired()
            .HasMaxLength(500);

        // FirstName - Requerido, máximo 100 caracteres
        builder.Property(u => u.FirstName)
            .IsRequired()
            .HasMaxLength(100);

        // LastName - Requerido, máximo 100 caracteres
        builder.Property(u => u.LastName)
            .IsRequired()
            .HasMaxLength(100);

        // Role - Almacenar como string
        builder.Property(u => u.Role)
            .IsRequired()
            .HasConversion<string>()
            .HasMaxLength(50);

        // IsActive - Valor por defecto true
        builder.Property(u => u.IsActive)
            .IsRequired()
            .HasDefaultValue(true);

        // AvatarUrl - Opcional
        builder.Property(u => u.AvatarUrl)
            .HasMaxLength(500);

        // CreatedAt - Requerido
        builder.Property(u => u.CreatedAt)
            .IsRequired()
            .HasDefaultValueSql("GETUTCDATE()");

        // UpdatedAt - Opcional
        builder.Property(u => u.UpdatedAt)
            .IsRequired(false);

        // =========================================================================
        // RELACIONES
        // =========================================================================

        // User tiene muchos Events (como organizador)
        builder.HasMany(u => u.OrganizedEvents)
            .WithOne(e => e.Organizer)
            .HasForeignKey(e => e.OrganizerId)
            .OnDelete(DeleteBehavior.Restrict); // No borrar usuarios con eventos

        // User tiene muchas Registrations
        builder.HasMany(u => u.Registrations)
            .WithOne(r => r.User)
            .HasForeignKey(r => r.UserId)
            .OnDelete(DeleteBehavior.Cascade); // Si se borra user, borrar registrations
    }
}
