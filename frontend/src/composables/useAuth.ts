

import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import type { LoginDto, RegisterDto } from '@/types'

export function useAuth() {
  const authStore = useAuthStore()
  const router = useRouter()

  
  
  

  const isAuthenticated = computed(() => authStore.isAuthenticated)
  const user = computed(() => authStore.user)
  const isAdmin = computed(() => authStore.isAdmin)
  const isOrganizer = computed(() => authStore.isOrganizer)
  const isUser = computed(() => authStore.isRegularUser)
  const fullName = computed(() => authStore.fullName)
  const userInitials = computed(() => authStore.userInitials)
  const loading = computed(() => authStore.loading)

  
  
  

  
  async function login(credentials: LoginDto, redirectTo = '/') {
    const success = await authStore.login(credentials)

    if (success) {
      
      if (authStore.isAdmin || authStore.isOrganizer) {
        router.push('/admin/dashboard')
      } else {
        router.push(redirectTo)
      }
    }

    return success
  }

  
  async function register(data: RegisterDto) {
    const success = await authStore.register(data)

    if (success) {
      router.push('/')
    }

    return success
  }

  
  async function logout() {
    await authStore.logout()
    router.push('/login')
  }

  
  function hasRole(role: string) {
    return authStore.hasRole(role as any)
  }

  
  function canAccess(requiredRoles?: string[]) {
    return authStore.canAccess(requiredRoles as any)
  }

  
  function requireAuth() {
    if (!isAuthenticated.value) {
      router.push('/login')
      return false
    }
    return true
  }

  
  function requireRole(requiredRoles: string[]) {
    if (!requireAuth()) return false

    if (!canAccess(requiredRoles)) {
      router.push('/unauthorized')
      return false
    }

    return true
  }

  
  
  

  return {
    
    isAuthenticated,
    user,
    isAdmin,
    isOrganizer,
    isUser,
    fullName,
    userInitials,
    loading,

    
    login,
    register,
    logout,
    hasRole,
    canAccess,
    requireAuth,
    requireRole
  }
}
