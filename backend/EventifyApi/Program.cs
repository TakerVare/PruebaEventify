

using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using FluentValidation;
using EventifyApi.Middleware;
using EventifyApi.Helpers;
using EventifyApi.Services.Auth;

var builder = WebApplication.CreateBuilder(args);






builder.Services.AddDbContext<EventifyApi.Data.ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));


builder.Services.AddAutoMapper(typeof(Program));


builder.Services.AddValidatorsFromAssemblyContaining<Program>();


builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<EventifyApi.Services.Categories.ICategoryService, EventifyApi.Services.Categories.CategoryService>();
builder.Services.AddScoped<EventifyApi.Services.Locations.ILocationService, EventifyApi.Services.Locations.LocationService>();
builder.Services.AddScoped<EventifyApi.Services.Events.IEventService, EventifyApi.Services.Events.EventService>();
builder.Services.AddScoped<EventifyApi.Services.Registrations.IRegistrationService, EventifyApi.Services.Registrations.RegistrationService>();
builder.Services.AddScoped<JwtHelper>();


var jwtKey = builder.Configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key no configurada");
var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? throw new InvalidOperationException("JWT Issuer no configurado");
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? throw new InvalidOperationException("JWT Audience no configurada");

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtIssuer,
        ValidAudience = jwtAudience,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
        ClockSkew = TimeSpan.Zero
    };
});


builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy => policy.RequireRole("Admin"));
    options.AddPolicy("OrganizerOrAdmin", policy => policy.RequireRole("Organizer", "Admin"));
});


builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = null; 
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
        
        options.JsonSerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter());
    });


builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
                "http://localhost:5173",   
                "http://localhost:5174",   
                "http://localhost:8080",   
                "http://localhost:80"      
              )
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});


builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "Eventify API",
        Version = "v1",
        Description = "API de gestión de eventos - Backend ASP.NET Core 8.0"
    });
});





var app = builder.Build();





using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var context = services.GetRequiredService<EventifyApi.Data.ApplicationDbContext>();

    try
    {
        
        Console.WriteLine("🔄 Aplicando migraciones a la base de datos...");
        await context.Database.MigrateAsync();
        Console.WriteLine("✅ Migraciones aplicadas correctamente");

        
        await EventifyApi.Data.Seeders.DbSeeder.SeedAsync(context);
    }
    catch (Exception ex)
    {
        Console.WriteLine($"❌ Error al ejecutar seeders: {ex.Message}");
        throw;
    }
}






if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "Eventify API V1");
        options.RoutePrefix = "swagger";
    });
}


app.UseMiddleware<ExceptionHandlerMiddleware>();
app.UseCors("AllowFrontend");



app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();








Console.WriteLine("=============================================================================");
Console.WriteLine("🚀 Eventify Backend API - Starting...");
Console.WriteLine("=============================================================================");
Console.WriteLine($"📅 Environment: {app.Environment.EnvironmentName}");
Console.WriteLine($"🌐 URL: {string.Join(", ", app.Urls)}");
Console.WriteLine($"📚 Swagger: http://localhost:5000/swagger");
Console.WriteLine("=============================================================================");

app.Run();
