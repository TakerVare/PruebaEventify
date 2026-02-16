/**
 * =============================================================================
 * STORE USERS - Gestión de usuarios (Admin)
 * =============================================================================
 * Este store maneja la gestión de usuarios por parte de administradores:
 * - Listado de usuarios con paginación y filtros
 * - Actualización de roles y permisos
 * - Activación/desactivación de usuarios
 * - Búsqueda y filtrado de usuarios
 *
 * NOTA: Este store es diferente al authStore.
 * - authStore: Gestiona el usuario autenticado actual
 * - usersStore: Gestiona TODOS los usuarios del sistema (solo admins)
 * =============================================================================
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type {
  User,
  UserSummary,
  UserRole,
  AdminUpdateUserDto,
  PaginatedResponse
} from '@/types'
import { useUiStore } from './ui'
import { useAuthStore } from './auth'

// -----------------------------------------------------------------------------
// PARÁMETROS DE BÚSQUEDA
// -----------------------------------------------------------------------------

interface UserSearchParams {
  search?: string
  role?: UserRole
  isActive?: boolean
  sortBy?: 'email' | 'firstName' | 'lastName' | 'createdAt'
  sortOrder?: 'asc' | 'desc'
  page?: number
  pageSize?: number
}

// -----------------------------------------------------------------------------
// DEFINICIÓN DEL STORE
// -----------------------------------------------------------------------------

export const useUsersStore = defineStore('users', () => {
  // ===========================================================================
  // ESTADO
  // ===========================================================================

  /**
   * Lista de usuarios cargados
   */
  const users = ref<User[]>([])

  /**
   * Usuario actualmente seleccionado
   */
  const currentUser = ref<User | null>(null)

  /**
   * Información de paginación
   */
  const pagination = ref({
    page: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 0,
    hasPreviousPage: false,
    hasNextPage: false
  })

  /**
   * Filtros activos de búsqueda
   */
  const searchParams = ref<UserSearchParams>({
    search: '',
    role: undefined,
    isActive: undefined,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    page: 1,
    pageSize: 10
  })

  /**
   * Indica si hay una operación en curso
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
   * Usuarios administradores
   */
  const adminUsers = computed(() => {
    return users.value.filter(user => user.role === 'Admin')
  })

  /**
   * Usuarios organizadores
   */
  const organizerUsers = computed(() => {
    return users.value.filter(user => user.role === 'Organizer')
  })

  /**
   * Usuarios regulares
   */
  const regularUsers = computed(() => {
    return users.value.filter(user => user.role === 'User')
  })

  /**
   * Usuarios activos
   */
  const activeUsers = computed(() => {
    return users.value.filter(user => user.isActive)
  })

  /**
   * Usuarios inactivos
   */
  const inactiveUsers = computed(() => {
    return users.value.filter(user => !user.isActive)
  })

  /**
   * Estadísticas de usuarios por rol
   */
  const userStatsByRole = computed(() => {
    return {
      admin: adminUsers.value.length,
      organizer: organizerUsers.value.length,
      user: regularUsers.value.length,
      total: users.value.length
    }
  })

  /**
   * Indica si hay usuarios cargados
   */
  const hasUsers = computed(() => users.value.length > 0)

  /**
   * Indica si hay más páginas disponibles
   */
  const hasMorePages = computed(() => pagination.value.hasNextPage)

  // ===========================================================================
  // ACCIONES - LISTADO Y BÚSQUEDA
  // ===========================================================================

  /**
   * Obtiene la lista de usuarios con filtros y paginación
   * Solo accesible para administradores
   * @param params - Parámetros de búsqueda (opcional)
   */
  async function fetchUsers(params?: UserSearchParams) {
    const uiStore = useUiStore()
    const authStore = useAuthStore()

    // Verificar permisos de administrador
    if (!authStore.isAdmin) {
      error.value = 'No tienes permisos para acceder a esta funcionalidad'
      uiStore.showError(error.value)
      return false
    }

    try {
      loading.value = true
      error.value = null

      // Actualizar parámetros de búsqueda si se proporcionan
      if (params) {
        searchParams.value = { ...searchParams.value, ...params }
      }

      // TODO: Llamar al servicio de usuarios cuando se implemente
      // const response = await usersService.getUsers(searchParams.value)

      // MOCK: Simular respuesta del backend
      const mockResponse: PaginatedResponse<User> = {
        items: generateMockUsers(searchParams.value.pageSize || 10),
        page: searchParams.value.page || 1,
        pageSize: searchParams.value.pageSize || 10,
        totalCount: 50,
        totalPages: 5,
        hasPreviousPage: (searchParams.value.page || 1) > 1,
        hasNextPage: (searchParams.value.page || 1) < 5
      }

      users.value = mockResponse.items
      pagination.value = {
        page: mockResponse.page,
        pageSize: mockResponse.pageSize,
        totalCount: mockResponse.totalCount,
        totalPages: mockResponse.totalPages,
        hasPreviousPage: mockResponse.hasPreviousPage,
        hasNextPage: mockResponse.hasNextPage
      }

      return true
    } catch (err: any) {
      error.value = err.message || 'Error al cargar usuarios'
      uiStore.showError(error.value)
      return false
    } finally {
      loading.value = false
    }
  }

  /**
   * Obtiene un usuario por su ID
   * @param id - ID del usuario
   */
  async function fetchUserById(id: number) {
    const uiStore = useUiStore()
    const authStore = useAuthStore()

    if (!authStore.isAdmin) {
      error.value = 'No tienes permisos'
      uiStore.showError(error.value)
      return null
    }

    try {
      loading.value = true
      error.value = null

      // TODO: Llamar al servicio de usuarios
      // const user = await usersService.getUserById(id)

      // MOCK: Simular respuesta
      const mockUser = generateMockUsers(1)[0]
      mockUser.id = id

      currentUser.value = mockUser
      return mockUser
    } catch (err: any) {
      error.value = err.message || 'Error al cargar usuario'
      uiStore.showError(error.value)
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * Busca usuarios por término de búsqueda
   * @param searchTerm - Término de búsqueda
   */
  async function searchUsers(searchTerm: string) {
    searchParams.value.search = searchTerm
    searchParams.value.page = 1 // Reset a primera página
    return await fetchUsers()
  }

  /**
   * Aplica filtros de búsqueda
   * @param filters - Filtros a aplicar
   */
  async function applyFilters(filters: Partial<UserSearchParams>) {
    searchParams.value = { ...searchParams.value, ...filters, page: 1 }
    return await fetchUsers()
  }

  /**
   * Limpia todos los filtros
   */
  async function clearFilters() {
    searchParams.value = {
      search: '',
      role: undefined,
      isActive: undefined,
      sortBy: 'createdAt',
      sortOrder: 'desc',
      page: 1,
      pageSize: 10
    }
    return await fetchUsers()
  }

  /**
   * Cambia de página
   * @param page - Número de página
   */
  async function changePage(page: number) {
    searchParams.value.page = page
    return await fetchUsers()
  }

  /**
   * Cambia el tamaño de página
   * @param pageSize - Número de elementos por página
   */
  async function changePageSize(pageSize: number) {
    searchParams.value.pageSize = pageSize
    searchParams.value.page = 1
    return await fetchUsers()
  }

  // ===========================================================================
  // ACCIONES - ACTUALIZACIÓN DE USUARIOS
  // ===========================================================================

  /**
   * Actualiza los datos de un usuario (solo admin)
   * @param id - ID del usuario
   * @param userData - Datos actualizados
   */
  async function updateUser(id: number, userData: AdminUpdateUserDto) {
    const uiStore = useUiStore()
    const authStore = useAuthStore()

    if (!authStore.isAdmin) {
      error.value = 'No tienes permisos'
      uiStore.showError(error.value)
      return false
    }

    try {
      loading.value = true
      error.value = null

      // TODO: Llamar al servicio de usuarios
      // await usersService.updateUser(id, userData)

      // MOCK: Actualizar localmente
      const index = users.value.findIndex(u => u.id === id)
      if (index !== -1) {
        users.value[index] = { ...users.value[index], ...userData }
      }

      if (currentUser.value && currentUser.value.id === id) {
        currentUser.value = { ...currentUser.value, ...userData }
      }

      uiStore.showSuccess('Usuario actualizado correctamente')
      return true
    } catch (err: any) {
      error.value = err.message || 'Error al actualizar usuario'
      uiStore.showError(error.value)
      return false
    } finally {
      loading.value = false
    }
  }

  /**
   * Cambia el rol de un usuario
   * @param id - ID del usuario
   * @param role - Nuevo rol
   */
  async function changeUserRole(id: number, role: UserRole) {
    return await updateUser(id, { role })
  }

  /**
   * Activa un usuario
   * @param id - ID del usuario
   */
  async function activateUser(id: number) {
    return await updateUser(id, { isActive: true })
  }

  /**
   * Desactiva un usuario
   * @param id - ID del usuario
   */
  async function deactivateUser(id: number) {
    return await updateUser(id, { isActive: false })
  }

  // ===========================================================================
  // ACCIONES - HELPERS
  // ===========================================================================

  /**
   * Obtiene un usuario por ID desde la lista cargada (sin API call)
   * @param id - ID del usuario
   */
  function getUserById(id: number): User | undefined {
    return users.value.find(u => u.id === id)
  }

  /**
   * Limpia el usuario actual
   */
  function clearCurrentUser() {
    currentUser.value = null
  }

  /**
   * Establece el usuario actual
   * @param user - Usuario a establecer
   */
  function setCurrentUser(user: User) {
    currentUser.value = user
  }

  // ===========================================================================
  // RESET
  // ===========================================================================

  /**
   * Resetea el store a sus valores por defecto
   */
  function $reset() {
    users.value = []
    currentUser.value = null
    pagination.value = {
      page: 1,
      pageSize: 10,
      totalCount: 0,
      totalPages: 0,
      hasPreviousPage: false,
      hasNextPage: false
    }
    searchParams.value = {
      search: '',
      sortBy: 'createdAt',
      sortOrder: 'desc',
      page: 1,
      pageSize: 10
    }
    loading.value = false
    error.value = null
  }

  // ===========================================================================
  // RETURN (API PÚBLICA DEL STORE)
  // ===========================================================================

  return {
    // Estado
    users,
    currentUser,
    pagination,
    searchParams,
    loading,
    error,

    // Getters
    adminUsers,
    organizerUsers,
    regularUsers,
    activeUsers,
    inactiveUsers,
    userStatsByRole,
    hasUsers,
    hasMorePages,

    // Acciones - Listado y búsqueda
    fetchUsers,
    fetchUserById,
    searchUsers,
    applyFilters,
    clearFilters,
    changePage,
    changePageSize,

    // Acciones - Actualización
    updateUser,
    changeUserRole,
    activateUser,
    deactivateUser,

    // Acciones - Helpers
    getUserById,
    clearCurrentUser,
    setCurrentUser,

    // Reset
    $reset
  }
})

// =============================================================================
// FUNCIONES AUXILIARES (MOCK DATA)
// =============================================================================

/**
 * Genera usuarios mock para pruebas
 */
function generateMockUsers(count: number): User[] {
  const users: User[] = []
  const roles: UserRole[] = ['Admin', 'Organizer', 'User']
  const firstNames = ['Juan', 'María', 'Pedro', 'Ana', 'Luis', 'Carmen', 'José', 'Laura']
  const lastNames = ['García', 'Rodríguez', 'Martínez', 'López', 'González', 'Pérez', 'Sánchez', 'Fernández']

  for (let i = 0; i < count; i++) {
    const firstName = firstNames[i % firstNames.length]
    const lastName = lastNames[i % lastNames.length]
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@eventify.com`

    const createdDate = new Date()
    createdDate.setDate(createdDate.getDate() - i * 10)

    users.push({
      id: i + 1,
      email,
      firstName,
      lastName,
      role: roles[i % roles.length],
      isActive: i % 7 !== 0, // Uno de cada 7 inactivo
      createdAt: createdDate.toISOString(),
      avatarUrl: `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=random`
    })
  }

  return users
}
