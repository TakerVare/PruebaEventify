

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





interface UserSearchParams {
  search?: string
  role?: UserRole
  isActive?: boolean
  sortBy?: 'email' | 'firstName' | 'lastName' | 'createdAt'
  sortOrder?: 'asc' | 'desc'
  page?: number
  pageSize?: number
}





export const useUsersStore = defineStore('users', () => {
  
  
  

  
  const users = ref<User[]>([])

  
  const currentUser = ref<User | null>(null)

  
  const pagination = ref({
    page: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 0,
    hasPreviousPage: false,
    hasNextPage: false
  })

  
  const searchParams = ref<UserSearchParams>({
    search: '',
    role: undefined,
    isActive: undefined,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    page: 1,
    pageSize: 10
  })

  
  const loading = ref(false)

  
  const error = ref<string | null>(null)

  
  
  

  
  const adminUsers = computed(() => {
    return users.value.filter(user => user.role === 'Admin')
  })

  
  const organizerUsers = computed(() => {
    return users.value.filter(user => user.role === 'Organizer')
  })

  
  const regularUsers = computed(() => {
    return users.value.filter(user => user.role === 'User')
  })

  
  const activeUsers = computed(() => {
    return users.value.filter(user => user.isActive)
  })

  
  const inactiveUsers = computed(() => {
    return users.value.filter(user => !user.isActive)
  })

  
  const userStatsByRole = computed(() => {
    return {
      admin: adminUsers.value.length,
      organizer: organizerUsers.value.length,
      user: regularUsers.value.length,
      total: users.value.length
    }
  })

  
  const hasUsers = computed(() => users.value.length > 0)

  
  const hasMorePages = computed(() => pagination.value.hasNextPage)

  
  
  

  
  async function fetchUsers(params?: UserSearchParams) {
    const uiStore = useUiStore()
    const authStore = useAuthStore()

    
    if (!authStore.isAdmin) {
      error.value = 'No tienes permisos para acceder a esta funcionalidad'
      uiStore.showError(error.value)
      return false
    }

    try {
      loading.value = true
      error.value = null

      
      if (params) {
        searchParams.value = { ...searchParams.value, ...params }
      }

      
      

      
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

  
  async function searchUsers(searchTerm: string) {
    searchParams.value.search = searchTerm
    searchParams.value.page = 1 
    return await fetchUsers()
  }

  
  async function applyFilters(filters: Partial<UserSearchParams>) {
    searchParams.value = { ...searchParams.value, ...filters, page: 1 }
    return await fetchUsers()
  }

  
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

  
  async function changePage(page: number) {
    searchParams.value.page = page
    return await fetchUsers()
  }

  
  async function changePageSize(pageSize: number) {
    searchParams.value.pageSize = pageSize
    searchParams.value.page = 1
    return await fetchUsers()
  }

  
  
  

  
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

  
  async function changeUserRole(id: number, role: UserRole) {
    return await updateUser(id, { role })
  }

  
  async function activateUser(id: number) {
    return await updateUser(id, { isActive: true })
  }

  
  async function deactivateUser(id: number) {
    return await updateUser(id, { isActive: false })
  }

  
  
  

  
  function getUserById(id: number): User | undefined {
    return users.value.find(u => u.id === id)
  }

  
  function clearCurrentUser() {
    currentUser.value = null
  }

  
  function setCurrentUser(user: User) {
    currentUser.value = user
  }

  
  
  

  
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

  
  
  

  return {
    
    users,
    currentUser,
    pagination,
    searchParams,
    loading,
    error,

    
    adminUsers,
    organizerUsers,
    regularUsers,
    activeUsers,
    inactiveUsers,
    userStatsByRole,
    hasUsers,
    hasMorePages,

    
    fetchUsers,
    fetchUserById,
    searchUsers,
    applyFilters,
    clearFilters,
    changePage,
    changePageSize,

    
    updateUser,
    changeUserRole,
    activateUser,
    deactivateUser,

    
    getUserById,
    clearCurrentUser,
    setCurrentUser,

    
    $reset
  }
})






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
      isActive: i % 7 !== 0, 
      createdAt: createdDate.toISOString(),
      avatarUrl: `https:
    })
  }

  return users
}
