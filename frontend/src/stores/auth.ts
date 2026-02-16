/**
 * =============================================================================
 * STORE AUTH - Gestión de autenticación y usuario actual
 * =============================================================================
 * Este store maneja todo lo relacionado con autenticación:
 * - Login y registro
 * - Usuario autenticado actual
 * - Token JWT
 * - Permisos y roles
 * - Logout
 * =============================================================================
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, LoginDto, RegisterDto, AuthResponse, UserRole } from '@/types'
import { useUiStore } from './ui'

// NOTE: El servicio authService se creará en el siguiente paso
// import { authService } from '@/services/authService'

// -----------------------------------------------------------------------------
// DEFINICIÓN DEL STORE
// -----------------------------------------------------------------------------

export const useAuthStore = defineStore('auth', () => {
  // ===========================================================================
  // ESTADO
  // ===========================================================================

  /**
   * Usuario actualmente autenticado (null si no hay sesión)
   */
  const user = ref<User | null>(null)

  /**
   * Token JWT actual
   */
  const token = ref<string | null>(null)

  /**
   * Fecha de expiración del token
   */
  const tokenExpiresAt = ref<string | null>(null)

  /**
   * Indica si hay una operación de autenticación en curso
   */
  const loading = ref(false)

  /**
   * Mensaje de error de la última operación
   */
  const error = ref<string | null>(null)

  // ===========================================================================
  // GETTERS
  // ===========================================================================

  /**
   * Indica si el usuario está autenticado
   */
  const isAuthenticated = computed(() => {
    return user.value !== null && token.value !== null
  })

  /**
   * Rol del usuario autenticado
   */
  const userRole = computed(() => user.value?.role ?? null)

  /**
   * Indica si el usuario es administrador
   */
  const isAdmin = computed(() => userRole.value === 'Admin')

  /**
   * Indica si el usuario es organizador
   */
  const isOrganizer = computed(() => userRole.value === 'Organizer')

  /**
   * Indica si el usuario es usuario regular
   */
  const isRegularUser = computed(() => userRole.value === 'User')

  /**
   * Nombre completo del usuario
   */
  const fullName = computed(() => {
    if (!user.value) return ''
    return `${user.value.firstName} ${user.value.lastName}`
  })

  /**
   * Iniciales del usuario (para avatar)
   */
  const userInitials = computed(() => {
    if (!user.value) return ''
    return `${user.value.firstName.charAt(0)}${user.value.lastName.charAt(0)}`.toUpperCase()
  })

  /**
   * Indica si el token ha expirado
   */
  const isTokenExpired = computed(() => {
    if (!tokenExpiresAt.value) return true
    return new Date(tokenExpiresAt.value) <= new Date()
  })

  // ===========================================================================
  // ACCIONES - AUTENTICACIÓN
  // ===========================================================================

  /**
   * Inicia sesión con email y contraseña
   * @param credentials - Credenciales de login
   * @returns Promise<boolean> - True si el login fue exitoso
   */
  async function login(credentials: LoginDto): Promise<boolean> {
    const uiStore = useUiStore()

    try {
      loading.value = true
      error.value = null

      // TODO: Llamar al servicio de autenticación cuando se implemente
      // const response = await authService.login(credentials)

      // MOCK: Simular respuesta del backend por ahora
      const mockResponse: AuthResponse = {
        token: 'mock-jwt-token-' + Date.now(),
        expiresAt: new Date(Date.now() + 3600000).toISOString(), // 1 hora
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

      // Guardar datos de autenticación
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

  /**
   * Registra un nuevo usuario
   * @param data - Datos de registro
   * @returns Promise<boolean> - True si el registro fue exitoso
   */
  async function register(data: RegisterDto): Promise<boolean> {
    const uiStore = useUiStore()

    try {
      loading.value = true
      error.value = null

      // TODO: Llamar al servicio de autenticación cuando se implemente
      // const response = await authService.register(data)

      // MOCK: Simular respuesta del backend por ahora
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

      // Guardar datos de autenticación
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

  /**
   * Cierra la sesión del usuario
   */
  async function logout() {
    const uiStore = useUiStore()

    try {
      loading.value = true

      // TODO: Llamar al servicio para invalidar el token en el backend
      // await authService.logout()

      // Limpiar datos de autenticación
      clearAuthData()

      uiStore.showInfo('Has cerrado sesión correctamente')
    } catch (err: any) {
      // Incluso si falla el logout en el backend, limpiamos localmente
      clearAuthData()
      uiStore.showError('Error al cerrar sesión')
    } finally {
      loading.value = false
    }
  }

  /**
   * Refresca el token JWT
   * @returns Promise<boolean> - True si el refresh fue exitoso
   */
  async function refreshToken(): Promise<boolean> {
    try {
      loading.value = true

      // TODO: Llamar al servicio para refrescar el token
      // const response = await authService.refreshToken(token.value!)

      // MOCK: Simular respuesta
      const mockResponse: AuthResponse = {
        token: 'mock-jwt-token-refreshed-' + Date.now(),
        expiresAt: new Date(Date.now() + 3600000).toISOString(),
        user: user.value!
      }

      setAuthData(mockResponse)
      return true
    } catch (err: any) {
      error.value = err.message || 'Error al refrescar token'
      // Si falla el refresh, cerrar sesión
      await logout()
      return false
    } finally {
      loading.value = false
    }
  }

  /**
   * Obtiene los datos del usuario autenticado desde el backend
   * @returns Promise<boolean> - True si se obtuvieron los datos
   */
  async function fetchCurrentUser(): Promise<boolean> {
    if (!token.value) return false

    try {
      loading.value = true

      // TODO: Llamar al servicio para obtener datos del usuario
      // const userData = await authService.getCurrentUser()
      // user.value = userData

      return true
    } catch (err: any) {
      error.value = err.message || 'Error al obtener datos del usuario'
      return false
    } finally {
      loading.value = false
    }
  }

  // ===========================================================================
  // ACCIONES - PERMISOS
  // ===========================================================================

  /**
   * Verifica si el usuario tiene un rol específico
   * @param role - Rol a verificar
   * @returns boolean
   */
  function hasRole(role: UserRole): boolean {
    return userRole.value === role
  }

  /**
   * Verifica si el usuario tiene alguno de los roles especificados
   * @param roles - Array de roles a verificar
   * @returns boolean
   */
  function hasAnyRole(roles: UserRole[]): boolean {
    return userRole.value !== null && roles.includes(userRole.value)
  }

  /**
   * Verifica si el usuario puede acceder a una ruta protegida
   * @param requiredRoles - Roles requeridos para acceder
   * @returns boolean
   */
  function canAccess(requiredRoles?: UserRole[]): boolean {
    // Si no se requieren roles, solo verificar autenticación
    if (!requiredRoles || requiredRoles.length === 0) {
      return isAuthenticated.value
    }

    // Verificar si tiene alguno de los roles requeridos
    return isAuthenticated.value && hasAnyRole(requiredRoles)
  }

  // ===========================================================================
  // ACCIONES - HELPERS INTERNOS
  // ===========================================================================

  /**
   * Establece los datos de autenticación en el store
   * @param authData - Datos de autenticación del backend
   */
  function setAuthData(authData: AuthResponse) {
    user.value = authData.user
    token.value = authData.token
    tokenExpiresAt.value = authData.expiresAt
    error.value = null
  }

  /**
   * Limpia todos los datos de autenticación
   */
  function clearAuthData() {
    user.value = null
    token.value = null
    tokenExpiresAt.value = null
    error.value = null
  }

  /**
   * Inicializa el store (llamar al inicio de la app)
   * Verifica si hay un token guardado y lo valida
   */
  async function initialize() {
    // Si hay un token guardado, verificar si es válido
    if (token.value && !isTokenExpired.value) {
      // Intentar obtener los datos del usuario
      const success = await fetchCurrentUser()

      // Si falla, cerrar sesión
      if (!success) {
        clearAuthData()
      }
    } else if (token.value && isTokenExpired.value) {
      // Token expirado, intentar refrescar
      const success = await refreshToken()

      // Si falla el refresh, limpiar datos
      if (!success) {
        clearAuthData()
      }
    }
  }

  // ===========================================================================
  // RESET
  // ===========================================================================

  /**
   * Resetea el store a sus valores por defecto
   */
  function $reset() {
    clearAuthData()
    loading.value = false
  }

  // ===========================================================================
  // RETURN (API PÚBLICA DEL STORE)
  // ===========================================================================

  return {
    // Estado
    user,
    token,
    tokenExpiresAt,
    loading,
    error,

    // Getters
    isAuthenticated,
    userRole,
    isAdmin,
    isOrganizer,
    isRegularUser,
    fullName,
    userInitials,
    isTokenExpired,

    // Acciones - Autenticación
    login,
    register,
    logout,
    refreshToken,
    fetchCurrentUser,
    initialize,

    // Acciones - Permisos
    hasRole,
    hasAnyRole,
    canAccess,

    // Reset
    $reset
  }
}, {
  // ===========================================================================
  // PERSISTENCIA
  // ===========================================================================
  persist: {
    key: 'eventify-auth',
    // Persistir datos de autenticación en localStorage
    paths: ['user', 'token', 'tokenExpiresAt']
  }
})
