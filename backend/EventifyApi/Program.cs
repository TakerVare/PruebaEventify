/**
 * =============================================================================
 * PROGRAM.CS - Eventify Backend API
 * =============================================================================
 * Punto de entrada de la aplicación ASP.NET Core 8.0
 * Configuración de servicios, middleware y pipeline HTTP
 * =============================================================================
 */

using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using FluentValidation;
using EventifyApi.Middleware;
using EventifyApi.Helpers;
using EventifyApi.Services.Auth;

var builder = WebApplication.CreateBuilder(args);

// =============================================================================
// CONFIGURACIÓN DE SERVICIOS
// =============================================================================

// DbContext con SQL Server
builder.Services.AddDbContext<EventifyApi.Data.ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// AutoMapper
builder.Services.AddAutoMapper(typeof(Program));

// FluentValidation - Registrar validadores para uso manual
builder.Services.AddValidatorsFromAssemblyContaining<Program>();

// Servicios de negocio
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<EventifyApi.Services.Categories.ICategoryService, EventifyApi.Services.Categories.CategoryService>();
builder.Services.AddScoped<EventifyApi.Services.Locations.ILocationService, EventifyApi.Services.Locations.LocationService>();
builder.Services.AddScoped<EventifyApi.Services.Events.IEventService, EventifyApi.Services.Events.EventService>();
builder.Services.AddScoped<EventifyApi.Services.Registrations.IRegistrationService, EventifyApi.Services.Registrations.RegistrationService>();
builder.Services.AddScoped<JwtHelper>();

// JWT Authentication
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

// Authorization policies
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy => policy.RequireRole("Admin"));
    options.AddPolicy("OrganizerOrAdmin", policy => policy.RequireRole("Organizer", "Admin"));
});

// Controllers con configuración JSON
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = null; // PascalCase
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
        // Convertir enums a strings en JSON (facilita binding desde query strings)
        options.JsonSerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter());
    });

// CORS - Permitir frontend desde múltiples orígenes
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
                "http://localhost:5173",   // Desarrollo local con Vite
                "http://localhost:5174",   // Vite con puerto alternativo
                "http://localhost:8080",   // Producción con Docker (nginx)
                "http://localhost:80"      // Nginx en puerto estándar
              )
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

// Swagger/OpenAPI
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

// =============================================================================
// BUILD APP
// =============================================================================

var app = builder.Build();

// =============================================================================
// EJECUTAR SEEDERS EN DESARROLLO
// =============================================================================

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var context = services.GetRequiredService<EventifyApi.Data.ApplicationDbContext>();

    try
    {
        // Aplicar migraciones automáticamente (crear BD y tablas si no existen)
        Console.WriteLine("🔄 Aplicando migraciones a la base de datos...");
        await context.Database.MigrateAsync();
        Console.WriteLine("✅ Migraciones aplicadas correctamente");

        // Ejecutar seeders
        await EventifyApi.Data.Seeders.DbSeeder.SeedAsync(context);
    }
    catch (Exception ex)
    {
        Console.WriteLine($"❌ Error al ejecutar seeders: {ex.Message}");
        throw;
    }
}

// =============================================================================
// CONFIGURACIÓN DEL PIPELINE HTTP
// =============================================================================

// Swagger en desarrollo
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "Eventify API V1");
        options.RoutePrefix = "swagger";
    });
}

// Middleware pipeline
app.UseMiddleware<ExceptionHandlerMiddleware>();
app.UseCors("AllowFrontend");
// HTTPS Redirection: Comentado para Docker (sin certificados SSL)
// En producción con HTTPS configurado, descomentar esta línea
// app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

// =============================================================================
// RUN APP
// =============================================================================

// No es necesario configurar URLs aquí porque ya se configuran con ASPNETCORE_URLS
// en las variables de entorno (Dockerfile y docker-compose.yml)

Console.WriteLine("=============================================================================");
Console.WriteLine("🚀 Eventify Backend API - Starting...");
Console.WriteLine("=============================================================================");
Console.WriteLine($"📅 Environment: {app.Environment.EnvironmentName}");
Console.WriteLine($"🌐 URL: {string.Join(", ", app.Urls)}");
Console.WriteLine($"📚 Swagger: http://localhost:5000/swagger");
Console.WriteLine("=============================================================================");

app.Run();
