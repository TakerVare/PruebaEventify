# 🎫 Eventify - Gestión de Eventos

> Aplicación web de gestión de eventos desarrollada con Vue 3 + Vuetify 3 (Frontend) y ASP.NET Core 8 (Backend)

## 📋 Descripción

Eventify es una plataforma simplificada de gestión de eventos (tipo Eventbrite) que permite:
- **Usuarios públicos**: Ver eventos disponibles y registrarse
- **Organizadores**: Crear y gestionar sus propios eventos
- **Administradores**: Gestión completa del sistema

## 🛠️ Stack Tecnológico

### Frontend
| Tecnología | Versión | Descripción |
|------------|---------|-------------|
| Vue.js | 3.4+ | Framework JavaScript progresivo |
| TypeScript | 5.3+ | Tipado estático |
| Vuetify | 3.4+ | Framework de componentes UI Material Design |
| Pinia | 2.1+ | Gestión de estado |
| Vue Router | 4.2+ | Enrutamiento SPA |
| VeeValidate | 4.12+ | Validación de formularios |
| Yup | 1.3+ | Esquemas de validación |
| Vue I18n | 9.8+ | Internacionalización (ES/EN) |
| Chart.js | 4.4+ | Gráficos para dashboard |
| Axios | 1.6+ | Cliente HTTP |

### Backend
| Tecnología | Versión | Descripción |
|------------|---------|-------------|
| ASP.NET Core | 8.0 | Framework web |
| Entity Framework Core | 8.0 | ORM |
| SQL Server | 2022 | Base de datos |
| JWT | - | Autenticación |
| AutoMapper | 12.0+ | Mapeo de objetos |
| FluentValidation | 11.9+ | Validación de DTOs |

### DevOps
| Tecnología | Descripción |
|------------|-------------|
| Docker | Contenedorización |
| Docker Compose | Orquestación de contenedores |

## 🚀 Inicio Rápido

### Prerrequisitos
- Docker Desktop 4.0+
- Git

### Ejecución

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/eventify-app.git
cd eventify-app

# Construir y ejecutar
docker-compose build && docker compose up
```

La aplicación estará disponible en:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Swagger**: http://localhost:5000/swagger

## 👥 Usuarios de Prueba

| Rol | Email | Contraseña |
|-----|-------|------------|
| Administrador | admin@eventify.com | Admin123! |
| Organizador | organizador@eventify.com | Org123! |
| Usuario | usuario@eventify.com | User123! |

## 📁 Estructura del Proyecto

```
eventify-app/
├── 📄 docker-compose.yml      # Orquestación de contenedores
├── 📄 README.md               # Este archivo
├── 📄 .gitignore              # Archivos ignorados por Git
│
├── 📁 frontend/               # Aplicación Vue 3
│   ├── 📁 src/
│   │   ├── 📁 assets/         # Recursos estáticos
│   │   ├── 📁 components/     # Componentes reutilizables
│   │   ├── 📁 composables/    # Composables (hooks)
│   │   ├── 📁 i18n/           # Traducciones
│   │   ├── 📁 layouts/        # Plantillas de página
│   │   ├── 📁 plugins/        # Configuración de plugins
│   │   ├── 📁 router/         # Configuración de rutas
│   │   ├── 📁 services/       # Servicios API
│   │   ├── 📁 stores/         # Stores de Pinia
│   │   ├── 📁 types/          # Tipos TypeScript
│   │   └── 📁 views/          # Vistas/páginas
│   └── ...
│
└── 📁 backend/                # API ASP.NET Core
    └── 📁 EventifyApi/
        ├── 📁 Controllers/    # Controladores API
        ├── 📁 Data/           # Contexto BD y seeders
        ├── 📁 Helpers/        # Utilidades
        ├── 📁 Middleware/     # Middleware personalizado
        ├── 📁 Models/         # Entidades y DTOs
        └── 📁 Services/       # Lógica de negocio
```

## 📊 Modelo de Datos

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Users     │     │   Events    │     │  Locations  │
├─────────────┤     ├─────────────┤     ├─────────────┤
│ Id          │     │ Id          │     │ Id          │
│ Email       │     │ Title       │     │ Name        │
│ Password    │◄────│ OrganizerId │     │ Address     │
│ FirstName   │     │ LocationId  │────►│ Capacity    │
│ LastName    │     │ CategoryId  │     │ Description │
│ Role        │     │ StartDate   │     │ ImageUrl    │
│ CreatedAt   │     │ EndDate     │     │ IsActive    │
└─────────────┘     │ Capacity    │     │ CreatedAt   │
       │            │ Description │     └─────────────┘
       │            │ ImageUrl    │
       │            │ Status      │     ┌─────────────┐
       │            │ CreatedAt   │     │ Categories  │
       │            └─────────────┘     ├─────────────┤
       │                   │            │ Id          │
       │                   │            │ Name        │
       ▼                   ▼            │ Color       │
┌─────────────────────────────┐        │ Icon        │
│      Registrations          │        └─────────────┘
├─────────────────────────────┤               ▲
│ Id                          │               │
│ UserId ─────────────────────┤               │
│ EventId ────────────────────┘───────────────┘
│ RegistrationDate            │
│ Status                      │
└─────────────────────────────┘
```

## ✅ Funcionalidades

### Obligatorias (5 puntos)
- [x] **Vistas requeridas** (1 pto)
  - [x] Página principal pública
  - [x] Login/Registro
  - [x] Pantalla de administración
  - [x] 2 listados de entidades (Eventos y Ubicaciones)
  - [x] CRUD completo con validación (VeeValidate + Yup)

- [x] **Gestión de estado con Pinia** (1 pto)
  - [x] Store de Eventos
  - [x] Store de Ubicaciones
  - [x] Store de UI (notificaciones, loading, tema)
  - [x] Persistencia en backend

- [x] **Componentes estructurados** (1 pto)
  - [x] Header público con indicador de sección
  - [x] Footer público
  - [x] Header/Footer de administración (distintos)
  - [x] Login sin header/footer

- [x] **Arquitectura de componentes** (1 pto)
  - [x] Componentes separados para cards
  - [x] Lógica mínima en vistas
  - [x] Separación v-for / renderizado

- [x] **Maquetación con Vuetify 3** (1 pto)

### Extra (8 puntos)
- [x] **i18n** (1 pto) - Español e Inglés
- [x] **Autenticación JWT** (1 pto) - Login contra backend + protección de rutas
- [x] **Sistema de roles** (1 pto) - Admin, Organizador, Usuario
- [x] **Buscador avanzado** (2 ptos)
  - [x] Paginación
  - [x] Ordenación
  - [x] Filtro de fechas
  - [x] Acceso a detalle
- [x] **Temas visuales** (1 pto) - Claro/Oscuro con cambio en caliente
- [x] **Dashboard** (1 pto)
  - [x] KPIs (totales, medias)
  - [x] 3 gráficas distintas
  - [x] Filtros de fechas/categorías

## 🔧 Desarrollo Local (sin Docker)

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend/EventifyApi
dotnet restore
dotnet run
```

## 📝 Metodología Git

Este proyecto sigue **GitFlow**:

```
main
  └── develop
        ├── feature/auth
        ├── feature/events-crud
        ├── feature/locations-crud
        ├── feature/dashboard
        ├── feature/i18n
        ├── feature/themes
        └── feature/search
```

### Ramas principales
- `main`: Producción
- `develop`: Desarrollo

### Ramas de características
- `feature/*`: Nuevas funcionalidades
- `bugfix/*`: Correcciones
- `release/*`: Preparación de releases

## 📄 Licencia

Este proyecto es parte de la Actividad de Aprendizaje de la 2ª Evaluación del módulo "Desarrollo Web en Entorno Cliente" del ciclo DAW - Curso 2025-2026.

---

Desarrollado por: **Guillermo Algárate del Arco**
