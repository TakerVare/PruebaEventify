

import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import type { UserRole } from '@/types'





const routes: RouteRecordRaw[] = [
  
  
  
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

  
  
  
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/LoginView.vue'),
    meta: {
      title: 'Iniciar Sesión',
      layout: 'auth',
      requiresAuth: false,
      guestOnly: true 
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





const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    
    if (savedPosition) {
      return savedPosition
    }
    
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth'
      }
    }
    
    return { top: 0, behavior: 'smooth' }
  }
})






router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  
  document.title = to.meta.title
    ? `${to.meta.title} | Eventify`
    : 'Eventify - Gestión de Eventos'

  
  if (import.meta.env.DEV) {
    console.log(`[Router] Navegando de ${from.path} a ${to.path}`)
  }

  
  
  
  if (to.meta.guestOnly && authStore.isAuthenticated) {
    
    console.log('[Router] Usuario autenticado intentando acceder a ruta de invitado, redirigiendo...')

    
    if (authStore.isAdmin || authStore.isOrganizer) {
      next('/admin/dashboard')
    } else {
      next('/')
    }
    return
  }

  
  
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    console.log('[Router] Ruta protegida, redirigiendo a login')
    next({
      path: '/login',
      query: { redirect: to.fullPath } 
    })
    return
  }

  
  
  
  if (to.meta.requiresAuth && to.meta.roles) {
    const requiredRoles = to.meta.roles as UserRole[]
    const hasPermission = authStore.hasAnyRole(requiredRoles)

    if (!hasPermission) {
      console.warn('[Router] Usuario sin permisos suficientes')
      next('/unauthorized')
      return
    }
  }

  
  
  
  next()
})


router.afterEach((to, from) => {
  if (import.meta.env.DEV) {
    console.log(`[Router] Navegación completada: ${to.path}`)
  }

  
  
  
  
  
  
})


router.onError((error) => {
  console.error('[Router] Error de navegación:', error)
})





export default router






declare module 'vue-router' {
  interface RouteMeta {
    
    title?: string
    
    layout?: 'default' | 'admin' | 'auth'
    
    requiresAuth?: boolean
    
    roles?: UserRole[]
    
    guestOnly?: boolean
  }
}
