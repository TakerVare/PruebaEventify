# Eventify - Frontend

Aplicación web de gestión de eventos construida con Vue 3, TypeScript y Vuetify 3.

## 📋 Tabla de Contenidos

- [Características](#características)
- [Tecnologías](#tecnologías)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Ejecución](#ejecución)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Componentes Principales](#componentes-principales)
- [Guía de Desarrollo](#guía-de-desarrollo)

## ✨ Características

### Funcionalidades Públicas
- 🏠 **Página de Inicio**: Hero section, eventos destacados, categorías populares
- 📅 **Explorar Eventos**: Lista de eventos con filtros avanzados y paginación
- 🔍 **Detalle de Evento**: Información completa del evento con opción de registro
- 👤 **Perfil de Usuario**: Gestión de información personal y cambio de contraseña
- 🎫 **Mis Registros**: Vista de eventos registrados con opciones de gestión

### Funcionalidades de Administración
- 📊 **Dashboard**: KPIs, gráficas y estadísticas en tiempo real
- 📝 **Gestión de Eventos**: CRUD completo de eventos con publicación
- 📍 **Gestión de Ubicaciones**: CRUD de ubicaciones con capacidad
- 👥 **Gestión de Usuarios**: Administración de usuarios y roles (solo Admin)

### Características Técnicas
- 🔐 **Autenticación JWT**: Login/registro con protección de rutas
- 🌐 **Internacionalización**: Soporte para español e inglés
- 🎨 **Temas**: Modo claro y oscuro
- 📱 **Diseño Responsive**: Optimizado para móvil, tablet y desktop
- ✅ **Validación de Formularios**: Validación en tiempo real con VeeValidate y Yup
- 🔔 **Notificaciones**: Sistema de notificaciones toast
- 🎯 **Control de Acceso**: Sistema de roles (Admin, Organizer, User)

## 🛠️ Tecnologías

- **Vue 3.4** - Framework JavaScript progresivo
- **TypeScript 5.3** - Tipado estático
- **Vuetify 3.5** - Framework de componentes Material Design
- **Pinia 2.1** - Gestión de estado
- **Vue Router 4.3** - Enrutamiento SPA
- **VeeValidate 4.12** + **Yup 1.4** - Validación de formularios
- **Vue I18n 9.10** - Internacionalización
- **Axios 1.6** - Cliente HTTP
- **Chart.js 4.4** - Gráficas y visualización de datos
- **Vite 5.1** - Build tool y dev server

## 📦 Requisitos Previos

- **Node.js**: v18 o superior
- **npm**: v9 o superior (incluido con Node.js)

## 🚀 Instalación

1. Clona el repositorio:
```bash
git clone <url-del-repositorio>
cd eventify-app/frontend
```

2. Instala las dependencias:
```bash
npm install
```

## ⚙️ Configuración

1. Copia el archivo de ejemplo de variables de entorno:
```bash
cp .env.example .env
```

2. Edita el archivo `.env` con tu configuración:
```env
# URL del backend API
VITE_API_URL=http://localhost:5000/api

# Configuración de autenticación
VITE_JWT_SECRET=your-secret-key-here
VITE_JWT_EXPIRES_IN=3600000

# Características opcionales
VITE_ENABLE_MOCK_DATA=true
VITE_ENABLE_DEVTOOLS=true
```

## 🏃 Ejecución

### Modo Desarrollo
Inicia el servidor de desarrollo con hot-reload:
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### Build de Producción
Compila y optimiza para producción:
```bash
npm run build
```

Los archivos optimizados se generarán en el directorio `dist/`

### Vista Previa de Producción
Previsualiza el build de producción localmente:
```bash
npm run preview
```

### Linting y Formateo
Ejecuta el linter:
```bash
npm run lint
```

Formatea el código:
```bash
npm run format
```

## 📁 Estructura del Proyecto

```
frontend/
├── public/                 # Archivos estáticos
├── src/
│   ├── assets/            # Recursos (estilos, imágenes)
│   │   └── styles/        # Estilos globales SCSS
│   ├── components/        # Componentes reutilizables
│   │   ├── common/        # Componentes comunes
│   │   ├── events/        # Componentes de eventos
│   │   └── locations/     # Componentes de ubicaciones
│   ├── composables/       # Composables de Vue
│   │   ├── useAuth.ts     # Lógica de autenticación
│   │   ├── useValidation.ts # Esquemas de validación
│   │   ├── useNotification.ts # Sistema de notificaciones
│   │   └── usePagination.ts # Lógica de paginación
│   ├── layouts/           # Layouts de la aplicación
│   │   ├── DefaultLayout.vue # Layout público
│   │   ├── AdminLayout.vue   # Layout de admin
│   │   └── AuthLayout.vue    # Layout de autenticación
│   ├── locales/           # Archivos de traducción i18n
│   │   ├── es.json        # Español
│   │   └── en.json        # Inglés
│   ├── plugins/           # Plugins de Vue
│   │   ├── vuetify.ts     # Configuración de Vuetify
│   │   └── i18n.ts        # Configuración de i18n
│   ├── router/            # Configuración de rutas
│   │   └── index.ts       # Definición de rutas y guards
│   ├── services/          # Servicios de API
│   │   ├── apiClient.ts   # Cliente Axios configurado
│   │   ├── authService.ts # Servicio de autenticación
│   │   ├── eventsService.ts # Servicio de eventos
│   │   ├── locationsService.ts # Servicio de ubicaciones
│   │   ├── usersService.ts # Servicio de usuarios
│   │   └── ...
│   ├── stores/            # Stores de Pinia
│   │   ├── auth.ts        # Store de autenticación
│   │   ├── events.ts      # Store de eventos
│   │   ├── locations.ts   # Store de ubicaciones
│   │   ├── users.ts       # Store de usuarios
│   │   ├── ui.ts          # Store de UI (tema, notificaciones)
│   │   └── ...
│   ├── types/             # Definiciones de tipos TypeScript
│   │   └── index.ts       # Tipos principales
│   ├── views/             # Vistas/Páginas
│   │   ├── admin/         # Vistas de administración
│   │   │   ├── DashboardView.vue
│   │   │   ├── events/    # CRUD de eventos
│   │   │   ├── locations/ # CRUD de ubicaciones
│   │   │   └── users/     # Gestión de usuarios
│   │   ├── auth/          # Vistas de autenticación
│   │   │   ├── LoginView.vue
│   │   │   └── RegisterView.vue
│   │   ├── error/         # Vistas de error
│   │   │   ├── NotFoundView.vue
│   │   │   └── UnauthorizedView.vue
│   │   ├── public/        # Vistas públicas
│   │   │   ├── HomeView.vue
│   │   │   ├── EventsListView.vue
│   │   │   └── EventDetailView.vue
│   │   └── user/          # Vistas de usuario
│   │       ├── ProfileView.vue
│   │       └── MyRegistrationsView.vue
│   ├── App.vue            # Componente raíz
│   └── main.ts            # Punto de entrada
├── .env.example           # Ejemplo de variables de entorno
├── .gitignore            # Archivos ignorados por git
├── index.html            # HTML principal
├── package.json          # Dependencias y scripts
├── tsconfig.json         # Configuración de TypeScript
├── vite.config.ts        # Configuración de Vite
└── README.md             # Este archivo
```

## 🧩 Componentes Principales

### Stores (Pinia)

- **authStore**: Gestión de autenticación, tokens JWT y usuario actual
- **eventsStore**: CRUD de eventos, filtros, paginación y registros
- **locationsStore**: CRUD de ubicaciones y gestión de capacidad
- **usersStore**: Gestión de usuarios (admin), cambio de roles
- **uiStore**: Tema (claro/oscuro), idioma, notificaciones, estado global de UI
- **categoriesStore**: Categorías de eventos (predefinidas)
- **registrationsStore**: Inscripciones de usuarios a eventos

### Layouts

- **DefaultLayout**: Layout público con header, footer y navegación
- **AdminLayout**: Layout de administración con sidebar, breadcrumbs y menú
- **AuthLayout**: Layout minimalista para login y registro

### Composables

- **useAuth**: Lógica de autenticación y verificación de permisos
- **useValidation**: Esquemas Yup para validación de formularios
- **useNotification**: Wrapper para mostrar notificaciones
- **usePagination**: Lógica reutilizable de paginación

## 📚 Guía de Desarrollo

### Usuarios de Prueba

En modo desarrollo, puedes usar estos usuarios de prueba:

```typescript
// Administrador
email: admin@eventify.com
password: Admin123!

// Organizador
email: organizer@eventify.com
password: Organizer123!

// Usuario regular
email: user@eventify.com
password: User123!
```

### Añadir una Nueva Vista

1. Crea el archivo en `src/views/`:
```typescript
// src/views/ejemplo/MiVista.vue
<script setup lang="ts">
// Tu código aquí
</script>

<template>
  <!-- Tu template aquí -->
</template>
```

2. Añade la ruta en `src/router/index.ts`:
```typescript
{
  path: '/mi-ruta',
  name: 'MiRuta',
  component: () => import('@/views/ejemplo/MiVista.vue'),
  meta: {
    title: 'Mi Vista',
    layout: 'default',
    requiresAuth: true
  }
}
```

### Añadir un Nuevo Store

1. Crea el archivo en `src/stores/`:
```typescript
// src/stores/miStore.ts
import { defineStore } from 'pinia'

export const useMiStore = defineStore('miStore', () => {
  // Estado, getters y actions aquí
  return { /* ... */ }
})
```

2. Usa el store en componentes:
```typescript
import { useMiStore } from '@/stores/miStore'

const miStore = useMiStore()
```

### Trabajar con API

Los servicios están configurados en `src/services/`. Ejemplo:

```typescript
// src/services/miServicio.ts
import { apiClient } from './apiClient'

export const miServicio = {
  async getData(): Promise<Data[]> {
    const response = await apiClient.get<Data[]>('/mi-endpoint')
    return response.data
  }
}
```

El `apiClient` ya incluye:
- Inyección automática del token JWT
- Manejo de errores 401, 403, 404
- Redirección automática en caso de sesión expirada

### Internacionalización

Añade traducciones en `src/locales/`:

```json
// src/locales/es.json
{
  "mi": {
    "traduccion": "Mi texto en español"
  }
}
```

Usa en componentes:
```typescript
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
console.log(t('mi.traduccion')) // "Mi texto en español"
```

### Temas y Estilos

Los colores del tema se configuran en `src/plugins/vuetify.ts`:

```typescript
const myTheme = {
  colors: {
    primary: '#6366F1',    // Indigo
    secondary: '#8B5CF6',  // Purple
    // ...
  }
}
```

Usa variables de Vuetify en componentes:
```scss
.mi-elemento {
  color: rgb(var(--v-theme-primary));
  background: rgb(var(--v-theme-surface));
}
```

## 🐛 Solución de Problemas

### Error: "Cannot find module '@/...'"
- Verifica que los paths estén configurados en `tsconfig.json`
- Reinicia el servidor de desarrollo

### Error de compilación con Vuetify
- Asegúrate de tener las dependencias correctas:
```bash
npm install vuetify @mdi/font
```

### Las notificaciones no se muestran
- Verifica que `ToastNotification.vue` esté incluido en `App.vue`
- Comprueba que el `uiStore` esté importado correctamente

### Error 401 al hacer peticiones
- Verifica que el backend esté corriendo
- Comprueba la URL del API en `.env`
- Asegúrate de estar autenticado (token JWT válido)

## 📄 Licencia

Este proyecto es parte de una actividad académica para el módulo de Desarrollo Web en Entorno Cliente.

## 👨‍💻 Autor

Desarrollado como proyecto académico para 2º DAW - Desarrollo de Aplicaciones Web

## 🔗 Enlaces Útiles

- [Vue 3 Docs](https://vuejs.org/)
- [Vuetify 3 Docs](https://vuetifyjs.com/)
- [Pinia Docs](https://pinia.vuejs.org/)
- [Vue Router Docs](https://router.vuejs.org/)
- [TypeScript Docs](https://www.typescriptlang.org/)
- [Vite Docs](https://vitejs.dev/)
