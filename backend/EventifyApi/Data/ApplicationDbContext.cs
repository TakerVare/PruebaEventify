using EventifyApi.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace EventifyApi.Data;




public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    
    
    

    
    
    
    public DbSet<User> Users { get; set; }

    
    
    
    public DbSet<Event> Events { get; set; }

    
    
    
    public DbSet<Location> Locations { get; set; }

    
    
    
    public DbSet<Category> Categories { get; set; }

    
    
    
    public DbSet<Registration> Registrations { get; set; }

    
    
    

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        
        
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);
    }
}
