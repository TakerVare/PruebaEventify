# =============================================================================
# DOCKERFILE - Eventify Backend API (ASP.NET Core 8.0)
# =============================================================================
# Multi-stage build para optimizar el tamaño de la imagen
# =============================================================================

# -----------------------------------------------------------------------------
# STAGE 1: BUILD
# -----------------------------------------------------------------------------
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copiar archivo de proyecto y restaurar dependencias
COPY ["EventifyApi/EventifyApi.csproj", "EventifyApi/"]
RUN dotnet restore "EventifyApi/EventifyApi.csproj"

# Copiar todo el código fuente y compilar
COPY EventifyApi/ EventifyApi/
WORKDIR "/src/EventifyApi"
RUN dotnet build "EventifyApi.csproj" -c Release -o /app/build

# -----------------------------------------------------------------------------
# STAGE 2: PUBLISH
# -----------------------------------------------------------------------------
FROM build AS publish
RUN dotnet publish "EventifyApi.csproj" -c Release -o /app/publish /p:UseAppHost=false

# -----------------------------------------------------------------------------
# STAGE 3: RUNTIME
# -----------------------------------------------------------------------------
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

# Copiar binarios publicados
COPY --from=publish /app/publish .

# Exponer puerto 5000
EXPOSE 5000

# Variables de entorno
ENV ASPNETCORE_URLS=http://+:5000
ENV ASPNETCORE_ENVIRONMENT=Production

# Punto de entrada
ENTRYPOINT ["dotnet", "EventifyApi.dll"]
