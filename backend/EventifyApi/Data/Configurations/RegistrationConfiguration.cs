using EventifyApi.Models.Entities;
using EventifyApi.Models.Entities.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace EventifyApi.Data.Configurations;




public class RegistrationConfiguration : IEntityTypeConfiguration<Registration>
{
    public void Configure(EntityTypeBuilder<Registration> builder)
    {
        
        
        
        builder.ToTable("Registrations");
        builder.HasKey(r => r.Id);

        
        
        

        
        builder.Property(r => r.Status)
            .IsRequired()
            .HasConversion<string>()
            .HasMaxLength(50)
            .HasDefaultValue(RegistrationStatus.Pending);

        
        builder.Property(r => r.RegistrationDate)
            .IsRequired()
            .HasDefaultValueSql("GETUTCDATE()");

        
        builder.Property(r => r.Notes)
            .HasMaxLength(1000);

        
        
        

        
        builder.HasIndex(r => new { r.UserId, r.EventId })
            .IsUnique()
            .HasDatabaseName("IX_Registrations_User_Event_Unique");

        
        builder.HasIndex(r => r.EventId)
            .HasDatabaseName("IX_Registrations_EventId");

        
        builder.HasIndex(r => r.Status)
            .HasDatabaseName("IX_Registrations_Status");

        
        
        

        
        builder.HasOne(r => r.User)
            .WithMany(u => u.Registrations)
            .HasForeignKey(r => r.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        
        builder.HasOne(r => r.Event)
            .WithMany(e => e.Registrations)
            .HasForeignKey(r => r.EventId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
