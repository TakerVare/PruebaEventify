using EventifyApi.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace EventifyApi.Data.Configurations;




public class LocationConfiguration : IEntityTypeConfiguration<Location>
{
    public void Configure(EntityTypeBuilder<Location> builder)
    {
        
        
        
        builder.ToTable("Locations");
        builder.HasKey(l => l.Id);

        
        
        

        
        builder.Property(l => l.Name)
            .IsRequired()
            .HasMaxLength(200);

        
        builder.Property(l => l.Address)
            .IsRequired()
            .HasMaxLength(500);

        
        builder.Property(l => l.Capacity)
            .IsRequired();

        
        builder.Property(l => l.Description)
            .HasMaxLength(1000);

        
        builder.Property(l => l.ImageUrl)
            .HasMaxLength(500);

        
        builder.Property(l => l.IsActive)
            .IsRequired()
            .HasDefaultValue(true);

        
        builder.Property(l => l.Latitude)
            .HasPrecision(10, 8);

        
        builder.Property(l => l.Longitude)
            .HasPrecision(11, 8);

        
        builder.Property(l => l.ContactEmail)
            .HasMaxLength(255);

        
        builder.Property(l => l.ContactPhone)
            .HasMaxLength(50);

        
        builder.Property(l => l.CreatedAt)
            .IsRequired()
            .HasDefaultValueSql("GETUTCDATE()");

        
        builder.Property(l => l.UpdatedAt)
            .IsRequired(false);

        
        
        

        
        builder.HasIndex(l => l.Name)
            .HasDatabaseName("IX_Locations_Name");

        
        builder.HasIndex(l => l.IsActive)
            .HasDatabaseName("IX_Locations_IsActive");
    }
}
