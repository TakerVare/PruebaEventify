using EventifyApi.Models.Entities;
using EventifyApi.Models.Entities.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace EventifyApi.Data.Configurations;

/// <summary>
/// Configuración Fluent API para la entidad Registration
/// </summary>
public class RegistrationConfiguration : IEntityTypeConfiguration<Registration>
{
    public void Configure(EntityTypeBuilder<Registration> builder)
    {
        // =========================================================================
        // TABLA Y CLAVE PRIMARIA
        // =========================================================================
        builder.ToTable("Registrations");
        builder.HasKey(r => r.Id);

        // =========================================================================
        // PROPIEDADES
        // =========================================================================

        // Status - Almacenar como string
        builder.Property(r => r.Status)
            .IsRequired()
            .HasConversion<string>()
            .HasMaxLength(50)
            .HasDefaultValue(RegistrationStatus.Pending);

        // RegistrationDate - Requerido
        builder.Property(r => r.RegistrationDate)
            .IsRequired()
            .HasDefaultValueSql("GETUTCDATE()");

        // Notes - Opcional
        builder.Property(r => r.Notes)
            .HasMaxLength(1000);

        // =========================================================================
        // ÍNDICES
        // =========================================================================

        // Índice único compuesto: Un usuario solo puede registrarse una vez a un evento
        builder.HasIndex(r => new { r.UserId, r.EventId })
            .IsUnique()
            .HasDatabaseName("IX_Registrations_User_Event_Unique");

        // Índice en EventId para consultas de registros por evento
        builder.HasIndex(r => r.EventId)
            .HasDatabaseName("IX_Registrations_EventId");

        // Índice en Status para filtros
        builder.HasIndex(r => r.Status)
            .HasDatabaseName("IX_Registrations_Status");

        // =========================================================================
        // RELACIONES
        // =========================================================================

        // Registration pertenece a un User
        builder.HasOne(r => r.User)
            .WithMany(u => u.Registrations)
            .HasForeignKey(r => r.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        // Registration pertenece a un Event
        builder.HasOne(r => r.Event)
            .WithMany(e => e.Registrations)
            .HasForeignKey(r => r.EventId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
