/**
 * =============================================================================
 * USE AUTH - Composable de autenticación
 * =============================================================================
 * Composable que proporciona funcionalidades de autenticación de manera
 * reutilizable en cualquier componente.
 *
 * Uso:
 * ```ts
 * const { isAuthenticated, user, login, logout } = useAuth()
 * ```
 * =============================================================================
 */

import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import type { LoginDto, RegisterDto } from '@/types'

export function useAuth() {
  const authStore = useAuthStore()
  const router = useRouter()

  // ===========================================================================
  // GETTERS COMPUTADOS
  // ===========================================================================

  const isAuthenticated = computed(() => authStore.isAuthenticated)
  const user = computed(() => authStore.user)
  const isAdmin = computed(() => authStore.isAdmin)
  const isOrganizer = computed(() => authStore.isOrganizer)
  const isUser = computed(() => authStore.isRegularUser)
  const fullName = computed(() => authStore.fullName)
  const userInitials = computed(() => authStore.userInitials)
  const loading = computed(() => authStore.loading)

  // ===========================================================================
  // MÉTODOS
  // ===========================================================================

  /**
   * Inicia sesión y redirige al usuario
   * @param credentials - Email y contraseña
   * @param redirectTo - Ruta a la que redirigir después del login
   */
  async function login(credentials: LoginDto, redirectTo = '/') {
    const success = await authStore.login(credentials)

    if (success) {
      // Redirigir según el rol del usuario
      if (authStore.isAdmin || authStore.isOrganizer) {
        router.push('/admin/dashboard')
      } else {
        router.push(redirectTo)
      }
    }

    return success
  }

  /**
   * Registra un nuevo usuario y lo redirige
   * @param data - Datos de registro
   */
  async function register(data: RegisterDto) {
    const success = await authStore.register(data)

    if (success) {
      router.push('/')
    }

    return success
  }

  /**
   * Cierra sesión y redirige al login
   */
  async function logout() {
    await authStore.logout()
    router.push('/login')
  }

  /**
   * Verifica si el usuario tiene un rol específico
   * @param role - Rol a verificar
   */
  function hasRole(role: string) {
    return authStore.hasRole(role as any)
  }

  /**
   * Verifica si el usuario puede acceder a una ruta
   * @param requiredRoles - Roles requeridos
   */
  function canAccess(requiredRoles?: string[]) {
    return authStore.canAccess(requiredRoles as any)
  }

  /**
   * Redirige al usuario si no está autenticado
   */
  function requireAuth() {
    if (!isAuthenticated.value) {
      router.push('/login')
      return false
    }
    return true
  }

  /**
   * Redirige al usuario si no tiene el rol requerido
   * @param requiredRoles - Roles requeridos
   */
  function requireRole(requiredRoles: string[]) {
    if (!requireAuth()) return false

    if (!canAccess(requiredRoles)) {
      router.push('/unauthorized')
      return false
    }

    return true
  }

  // ===========================================================================
  // RETURN
  // ===========================================================================

  return {
    // Getters
    isAuthenticated,
    user,
    isAdmin,
    isOrganizer,
    isUser,
    fullName,
    userInitials,
    loading,

    // Métodos
    login,
    register,
    logout,
    hasRole,
    canAccess,
    requireAuth,
    requireRole
  }
}
