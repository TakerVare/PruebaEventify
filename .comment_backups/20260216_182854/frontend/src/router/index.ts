/**
 * =============================================================================
 * ROUTER - Configuración de Vue Router
 * =============================================================================
 * Configuración completa de rutas de la aplicación con:
 * - Rutas públicas (Home, Events, Event Detail)
 * - Rutas de autenticación (Login, Register)
 * - Rutas protegidas de administración (Dashboard, CRUD)
 * - Guards de navegación para control de acceso
 * - Meta información para permisos y layouts
 * =============================================================================
 */

import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import type { UserRole } from '@/types'

// -----------------------------------------------------------------------------
// DEFINICIÓN DE RUTAS
// -----------------------------------------------------------------------------

const routes: RouteRecordRaw[] = [
  // ===========================================================================
  // RUTAS PÚBLICAS
  // ===========================================================================
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/public/HomeView.vue'),
    meta: {
      title: 'Inicio',
      layout: 'default',
      requiresAuth: false
    }
  },
  {
    path: '/events',
    name: 'EventsList',
    component: () => import('@/views/public/EventsListView.vue'),
    meta: {
      title: 'Eventos',
      layout: 'default',
      requiresAuth: false
    }
  },
  {
    path: '/events/:id',
    name: 'EventDetail',
    component: () => import('@/views/public/EventDetailView.vue'),
    meta: {
      title: 'Detalle del Evento',
      layout: 'default',
      requiresAuth: false
    },
    props: true
  },

  // ===========================================================================
  // RUTAS DE AUTENTICACIÓN
  // ===========================================================================
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/LoginView.vue'),
    meta: {
      title: 'Iniciar Sesión',
      layout: 'auth',
      requiresAuth: false,
      guestOnly: true // Solo accesible si NO estás autenticado
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/auth/RegisterView.vue'),
    meta: {
      title: 'Registrarse',
      layout: 'auth',
      requiresAuth: false,
      guestOnly: true
    }
  },

  // ===========================================================================
  // RUTAS DE ADMINISTRACIÓN (PROTEGIDAS)
  // ===========================================================================
  {
    path: '/admin',
    redirect: '/admin/dashboard',
    meta: {
      requiresAuth: true,
      roles: ['Admin', 'Organizer'] as UserRole[]
    }
  },
  {
    path: '/admin/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/admin/DashboardView.vue'),
    meta: {
      title: 'Dashboard',
      layout: 'admin',
      requiresAuth: true,
      roles: ['Admin', 'Organizer'] as UserRole[]
    }
  },

  // ---------------------------------------------------------------------------
  // RUTAS DE GESTIÓN DE EVENTOS
  // ---------------------------------------------------------------------------
  {
    path: '/admin/events',
    name: 'AdminEventsList',
    component: () => import('@/views/admin/events/EventsListView.vue'),
    meta: {
      title: 'Gestión de Eventos',
      layout: 'admin',
      requiresAuth: true,
      roles: ['Admin', 'Organizer'] as UserRole[]
    }
  },
  {
    path: '/admin/events/new',
    name: 'CreateEvent',
    component: () => import('@/views/admin/events/EventFormView.vue'),
    meta: {
      title: 'Crear Evento',
      layout: 'admin',
      requiresAuth: true,
      roles: ['Admin', 'Organizer'] as UserRole[]
    }
  },
  {
    path: '/admin/events/:id/edit',
    name: 'EditEvent',
    component: () => import('@/views/admin/events/EventFormView.vue'),
    meta: {
      title: 'Editar Evento',
      layout: 'admin',
      requiresAuth: true,
      roles: ['Admin', 'Organizer'] as UserRole[]
    },
    props: true
  },

  // ---------------------------------------------------------------------------
  // RUTAS DE GESTIÓN DE UBICACIONES
  // ---------------------------------------------------------------------------
  {
    path: '/admin/locations',
    name: 'AdminLocationsList',
    component: () => import('@/views/admin/locations/LocationsListView.vue'),
    meta: {
      title: 'Gestión de Ubicaciones',
      layout: 'admin',
      requiresAuth: true,
      roles: ['Admin'] as UserRole[]
    }
  },
  {
    path: '/admin/locations/new',
    name: 'CreateLocation',
    component: () => import('@/views/admin/locations/LocationFormView.vue'),
    meta: {
      title: 'Crear Ubicación',
      layout: 'admin',
      requiresAuth: true,
      roles: ['Admin'] as UserRole[]
    }
  },
  {
    path: '/admin/locations/:id/edit',
    name: 'EditLocation',
    component: () => import('@/views/admin/locations/LocationFormView.vue'),
    meta: {
      title: 'Editar Ubicación',
      layout: 'admin',
      requiresAuth: true,
      roles: ['Admin'] as UserRole[]
    },
    props: true
  },

  // ---------------------------------------------------------------------------
  // RUTAS DE GESTIÓN DE USUARIOS (SOLO ADMIN)
  // ---------------------------------------------------------------------------
  {
    path: '/admin/users',
    name: 'AdminUsersList',
    component: () => import('@/views/admin/users/UsersListView.vue'),
    meta: {
      title: 'Gestión de Usuarios',
      layout: 'admin',
      requiresAuth: true,
      roles: ['Admin'] as UserRole[]
    }
  },

  // ===========================================================================
  // RUTAS DE PERFIL DE USUARIO
  // ===========================================================================
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/user/ProfileView.vue'),
    meta: {
      title: 'Mi Perfil',
      layout: 'default',
      requiresAuth: true
    }
  },
  {
    path: '/my-registrations',
    name: 'MyRegistrations',
    component: () => import('@/views/user/MyRegistrationsView.vue'),
    meta: {
      title: 'Mis Inscripciones',
      layout: 'default',
      requiresAuth: true
    }
  },

  // ===========================================================================
  // RUTAS DE ERROR
  // ===========================================================================
  {
    path: '/unauthorized',
    name: 'Unauthorized',
    component: () => import('@/views/error/UnauthorizedView.vue'),
    meta: {
      title: 'Sin Autorización',
      layout: 'auth',
      requiresAuth: false
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/error/NotFoundView.vue'),
    meta: {
      title: 'Página No Encontrada',
      layout: 'default',
      requiresAuth: false
    }
  }
]

// -----------------------------------------------------------------------------
// CREAR INSTANCIA DEL ROUTER
// -----------------------------------------------------------------------------

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // Si hay una posición guardada, volver a ella
    if (savedPosition) {
      return savedPosition
    }
    // Si hay un hash, hacer scroll al elemento
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth'
      }
    }
    // Por defecto, hacer scroll al inicio
    return { top: 0, behavior: 'smooth' }
  }
})

// -----------------------------------------------------------------------------
// NAVIGATION GUARDS (PROTECCIÓN DE RUTAS)
// -----------------------------------------------------------------------------

/**
 * Guard global que se ejecuta antes de cada navegación
 * Verifica autenticación y permisos
 */
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  // Actualizar título de la página
  document.title = to.meta.title
    ? `${to.meta.title} | Eventify`
    : 'Eventify - Gestión de Eventos'

  // Log de navegación en desarrollo
  if (import.meta.env.DEV) {
    console.log(`[Router] Navegando de ${from.path} a ${to.path}`)
  }

  // -------------------------------------------------------------------------
  // VERIFICAR SI LA RUTA ES SOLO PARA INVITADOS (guestOnly)
  // -------------------------------------------------------------------------
  if (to.meta.guestOnly && authStore.isAuthenticated) {
    // Si está autenticado y trata de acceder a login/register, redirigir
    console.log('[Router] Usuario autenticado intentando acceder a ruta de invitado, redirigiendo...')

    // Redirigir según el rol
    if (authStore.isAdmin || authStore.isOrganizer) {
      next('/admin/dashboard')
    } else {
      next('/')
    }
    return
  }

  // -------------------------------------------------------------------------
  // VERIFICAR SI LA RUTA REQUIERE AUTENTICACIÓN
  // -------------------------------------------------------------------------
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    console.log('[Router] Ruta protegida, redirigiendo a login')
    next({
      path: '/login',
      query: { redirect: to.fullPath } // Guardar URL para redirigir después del login
    })
    return
  }

  // -------------------------------------------------------------------------
  // VERIFICAR PERMISOS POR ROL
  // -------------------------------------------------------------------------
  if (to.meta.requiresAuth && to.meta.roles) {
    const requiredRoles = to.meta.roles as UserRole[]
    const hasPermission = authStore.hasAnyRole(requiredRoles)

    if (!hasPermission) {
      console.warn('[Router] Usuario sin permisos suficientes')
      next('/unauthorized')
      return
    }
  }

  // -------------------------------------------------------------------------
  // PERMITIR NAVEGACIÓN
  // -------------------------------------------------------------------------
  next()
})

/**
 * Guard que se ejecuta después de cada navegación
 * Útil para analytics, logs, etc.
 */
router.afterEach((to, from) => {
  if (import.meta.env.DEV) {
    console.log(`[Router] Navegación completada: ${to.path}`)
  }

  // TODO: Aquí se puede añadir tracking de Google Analytics
  // if (window.gtag) {
  //   window.gtag('config', 'GA_MEASUREMENT_ID', {
  //     page_path: to.path
  //   })
  // }
})

/**
 * Manejador de errores de navegación
 */
router.onError((error) => {
  console.error('[Router] Error de navegación:', error)
})

// -----------------------------------------------------------------------------
// EXPORTAR ROUTER
// -----------------------------------------------------------------------------

export default router

// -----------------------------------------------------------------------------
// TIPOS PARA META DE RUTAS
// -----------------------------------------------------------------------------

/**
 * Extender tipos de Vue Router para incluir nuestra meta personalizada
 */
declare module 'vue-router' {
  interface RouteMeta {
    /** Título de la página */
    title?: string
    /** Layout a usar (default, admin, auth) */
    layout?: 'default' | 'admin' | 'auth'
    /** Indica si la ruta requiere autenticación */
    requiresAuth?: boolean
    /** Roles permitidos para acceder a la ruta */
    roles?: UserRole[]
    /** Indica si la ruta es solo para invitados (no autenticados) */
    guestOnly?: boolean
  }
}
