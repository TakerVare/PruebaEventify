using EventifyApi.Models.Entities;
using EventifyApi.Models.Entities.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace EventifyApi.Data.Configurations;




public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        
        
        
        builder.ToTable("Users");
        builder.HasKey(u => u.Id);

        
        
        

        
        builder.Property(u => u.Email)
            .IsRequired()
            .HasMaxLength(255);

        builder.HasIndex(u => u.Email)
            .IsUnique()
            .HasDatabaseName("IX_Users_Email");

        
        builder.Property(u => u.PasswordHash)
            .IsRequired()
            .HasMaxLength(500);

        
        builder.Property(u => u.FirstName)
            .IsRequired()
            .HasMaxLength(100);

        
        builder.Property(u => u.LastName)
            .IsRequired()
            .HasMaxLength(100);

        
        builder.Property(u => u.Role)
            .IsRequired()
            .HasConversion<string>()
            .HasMaxLength(50);

        
        builder.Property(u => u.IsActive)
            .IsRequired()
            .HasDefaultValue(true);

        
        builder.Property(u => u.AvatarUrl)
            .HasMaxLength(500);

        
        builder.Property(u => u.CreatedAt)
            .IsRequired()
            .HasDefaultValueSql("GETUTCDATE()");

        
        builder.Property(u => u.UpdatedAt)
            .IsRequired(false);

        
        
        

        
        builder.HasMany(u => u.OrganizedEvents)
            .WithOne(e => e.Organizer)
            .HasForeignKey(e => e.OrganizerId)
            .OnDelete(DeleteBehavior.Restrict); 

        
        builder.HasMany(u => u.Registrations)
            .WithOne(r => r.User)
            .HasForeignKey(r => r.UserId)
            .OnDelete(DeleteBehavior.Cascade); 
    }
}
