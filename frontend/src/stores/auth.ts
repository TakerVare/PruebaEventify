

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, LoginDto, RegisterDto, AuthResponse, UserRole } from '@/types'
import { useUiStore } from './ui'








export const useAuthStore = defineStore('auth', () => {
  
  
  

  
  const user = ref<User | null>(null)

  
  const token = ref<string | null>(null)

  
  const tokenExpiresAt = ref<string | null>(null)

  
  const loading = ref(false)

  
  const error = ref<string | null>(null)

  
  
  

  
  const isAuthenticated = computed(() => {
    return user.value !== null && token.value !== null
  })

  
  const userRole = computed(() => user.value?.role ?? null)

  
  const isAdmin = computed(() => userRole.value === 'Admin')

  
  const isOrganizer = computed(() => userRole.value === 'Organizer')

  
  const isRegularUser = computed(() => userRole.value === 'User')

  
  const fullName = computed(() => {
    if (!user.value) return ''
    return `${user.value.firstName} ${user.value.lastName}`
  })

  
  const userInitials = computed(() => {
    if (!user.value) return ''
    return `${user.value.firstName.charAt(0)}${user.value.lastName.charAt(0)}`.toUpperCase()
  })

  
  const isTokenExpired = computed(() => {
    if (!tokenExpiresAt.value) return true
    return new Date(tokenExpiresAt.value) <= new Date()
  })

  
  
  

  
  async function login(credentials: LoginDto): Promise<boolean> {
    const uiStore = useUiStore()

    try {
      loading.value = true
      error.value = null

      
      

      
      const mockResponse: AuthResponse = {
        token: 'mock-jwt-token-' + Date.now(),
        expiresAt: new Date(Date.now() + 3600000).toISOString(), 
        user: {
          id: 1,
          email: credentials.email,
          firstName: 'Usuario',
          lastName: 'Demo',
          role: 'Admin' as UserRole,
          isActive: true,
          createdAt: new Date().toISOString()
        }
      }

      
      setAuthData(mockResponse)

      uiStore.showSuccess('¡Bienvenido de nuevo!')
      return true
    } catch (err: any) {
      error.value = err.message || 'Error al iniciar sesión'
      uiStore.showError(error.value)
      return false
    } finally {
      loading.value = false
    }
  }

  
  async function register(data: RegisterDto): Promise<boolean> {
    const uiStore = useUiStore()

    try {
      loading.value = true
      error.value = null

      
      

      
      const mockResponse: AuthResponse = {
        token: 'mock-jwt-token-' + Date.now(),
        expiresAt: new Date(Date.now() + 3600000).toISOString(),
        user: {
          id: Date.now(),
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          role: 'User' as UserRole,
          isActive: true,
          createdAt: new Date().toISOString()
        }
      }

      
      setAuthData(mockResponse)

      uiStore.showSuccess('¡Cuenta creada exitosamente!')
      return true
    } catch (err: any) {
      error.value = err.message || 'Error al registrar usuario'
      uiStore.showError(error.value)
      return false
    } finally {
      loading.value = false
    }
  }

  
  async function logout() {
    const uiStore = useUiStore()

    try {
      loading.value = true

      
      

      
      clearAuthData()

      uiStore.showInfo('Has cerrado sesión correctamente')
    } catch (err: any) {
      
      clearAuthData()
      uiStore.showError('Error al cerrar sesión')
    } finally {
      loading.value = false
    }
  }

  
  async function refreshToken(): Promise<boolean> {
    try {
      loading.value = true

      
      

      
      const mockResponse: AuthResponse = {
        token: 'mock-jwt-token-refreshed-' + Date.now(),
        expiresAt: new Date(Date.now() + 3600000).toISOString(),
        user: user.value!
      }

      setAuthData(mockResponse)
      return true
    } catch (err: any) {
      error.value = err.message || 'Error al refrescar token'
      
      await logout()
      return false
    } finally {
      loading.value = false
    }
  }

  
  async function fetchCurrentUser(): Promise<boolean> {
    if (!token.value) return false

    try {
      loading.value = true

      
      
      

      return true
    } catch (err: any) {
      error.value = err.message || 'Error al obtener datos del usuario'
      return false
    } finally {
      loading.value = false
    }
  }

  
  
  

  
  function hasRole(role: UserRole): boolean {
    return userRole.value === role
  }

  
  function hasAnyRole(roles: UserRole[]): boolean {
    return userRole.value !== null && roles.includes(userRole.value)
  }

  
  function canAccess(requiredRoles?: UserRole[]): boolean {
    
    if (!requiredRoles || requiredRoles.length === 0) {
      return isAuthenticated.value
    }

    
    return isAuthenticated.value && hasAnyRole(requiredRoles)
  }

  
  
  

  
  function setAuthData(authData: AuthResponse) {
    user.value = authData.user
    token.value = authData.token
    tokenExpiresAt.value = authData.expiresAt
    error.value = null
  }

  
  function clearAuthData() {
    user.value = null
    token.value = null
    tokenExpiresAt.value = null
    error.value = null
  }

  
  async function initialize() {
    
    if (token.value && !isTokenExpired.value) {
      
      const success = await fetchCurrentUser()

      
      if (!success) {
        clearAuthData()
      }
    } else if (token.value && isTokenExpired.value) {
      
      const success = await refreshToken()

      
      if (!success) {
        clearAuthData()
      }
    }
  }

  
  
  

  
  function $reset() {
    clearAuthData()
    loading.value = false
  }

  
  
  

  return {
    
    user,
    token,
    tokenExpiresAt,
    loading,
    error,

    
    isAuthenticated,
    userRole,
    isAdmin,
    isOrganizer,
    isRegularUser,
    fullName,
    userInitials,
    isTokenExpired,

    
    login,
    register,
    logout,
    refreshToken,
    fetchCurrentUser,
    initialize,

    
    hasRole,
    hasAnyRole,
    canAccess,

    
    $reset
  }
}, {
  
  
  
  persist: {
    key: 'eventify-auth',
    
    paths: ['user', 'token', 'tokenExpiresAt']
  }
})
