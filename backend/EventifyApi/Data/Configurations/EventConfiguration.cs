using EventifyApi.Models.Entities;
using EventifyApi.Models.Entities.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace EventifyApi.Data.Configurations;




public class EventConfiguration : IEntityTypeConfiguration<Event>
{
    public void Configure(EntityTypeBuilder<Event> builder)
    {
        
        
        
        builder.ToTable("Events");
        builder.HasKey(e => e.Id);

        
        
        

        
        builder.Property(e => e.Title)
            .IsRequired()
            .HasMaxLength(200);

        
        builder.Property(e => e.Description)
            .IsRequired()
            .HasMaxLength(2000);

        
        builder.Property(e => e.StartDate)
            .IsRequired();

        
        builder.Property(e => e.EndDate)
            .IsRequired();

        
        builder.Property(e => e.Capacity)
            .IsRequired();

        
        builder.Property(e => e.RegisteredCount)
            .IsRequired()
            .HasDefaultValue(0);

        
        builder.Property(e => e.ImageUrl)
            .HasMaxLength(500);

        
        builder.Property(e => e.Status)
            .IsRequired()
            .HasConversion<string>()
            .HasMaxLength(50)
            .HasDefaultValue(EventStatus.Draft);

        
        builder.Property(e => e.CreatedAt)
            .IsRequired()
            .HasDefaultValueSql("GETUTCDATE()");

        
        builder.Property(e => e.UpdatedAt)
            .IsRequired(false);

        
        
        

        
        builder.HasIndex(e => e.StartDate)
            .HasDatabaseName("IX_Events_StartDate");

        
        builder.HasIndex(e => e.Status)
            .HasDatabaseName("IX_Events_Status");

        
        builder.HasIndex(e => new { e.LocationId, e.StartDate })
            .HasDatabaseName("IX_Events_Location_StartDate");

        
        
        

        
        builder.HasOne(e => e.Location)
            .WithMany(l => l.Events)
            .HasForeignKey(e => e.LocationId)
            .OnDelete(DeleteBehavior.Restrict); 

        
        builder.HasOne(e => e.Organizer)
            .WithMany(u => u.OrganizedEvents)
            .HasForeignKey(e => e.OrganizerId)
            .OnDelete(DeleteBehavior.Restrict); 

        
        builder.HasOne(e => e.Category)
            .WithMany(c => c.Events)
            .HasForeignKey(e => e.CategoryId)
            .OnDelete(DeleteBehavior.Restrict); 

        
        builder.HasMany(e => e.Registrations)
            .WithOne(r => r.Event)
            .HasForeignKey(r => r.EventId)
            .OnDelete(DeleteBehavior.Cascade); 
    }
}
