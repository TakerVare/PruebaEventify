

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type {
  Registration,
  CreateRegistrationDto,
  UpdateRegistrationDto,
  RegistrationStatus,
  PaginatedResponse
} from '@/types'
import { useUiStore } from './ui'
import { useAuthStore } from './auth'





export const useRegistrationsStore = defineStore('registrations', () => {
  
  
  

  
  const registrations = ref<Registration[]>([])

  
  const currentRegistration = ref<Registration | null>(null)

  
  const pagination = ref({
    page: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 0,
    hasPreviousPage: false,
    hasNextPage: false
  })

  
  const loading = ref(false)

  
  const error = ref<string | null>(null)

  
  
  

  
  const activeRegistrations = computed(() => {
    return registrations.value.filter(
      r => r.status === 'Confirmed' || r.status === 'Pending'
    )
  })

  
  const cancelledRegistrations = computed(() => {
    return registrations.value.filter(r => r.status === 'Cancelled')
  })

  
  const pastRegistrations = computed(() => {
    return registrations.value.filter(
      r => r.status === 'Attended' || r.status === 'NoShow'
    )
  })

  
  const registeredEventIds = computed(() => {
    return new Set(
      activeRegistrations.value.map(r => r.eventId)
    )
  })

  
  const hasRegistrations = computed(() => registrations.value.length > 0)

  
  const attendedCount = computed(() => {
    return registrations.value.filter(r => r.status === 'Attended').length
  })

  
  const attendanceRate = computed(() => {
    const total = pastRegistrations.value.length
    if (total === 0) return 0
    return (attendedCount.value / total) * 100
  })

  
  
  

  
  async function fetchMyRegistrations(page = 1, pageSize = 10) {
    const uiStore = useUiStore()
    const authStore = useAuthStore()

    if (!authStore.isAuthenticated) {
      error.value = 'Debes iniciar sesión para ver tus inscripciones'
      return false
    }

    try {
      loading.value = true
      error.value = null

      
      

      
      const mockResponse: PaginatedResponse<Registration> = {
        items: generateMockRegistrations(pageSize),
        page,
        pageSize,
        totalCount: 12,
        totalPages: Math.ceil(12 / pageSize),
        hasPreviousPage: page > 1,
        hasNextPage: page < Math.ceil(12 / pageSize)
      }

      registrations.value = mockResponse.items
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
      error.value = err.message || 'Error al cargar inscripciones'
      uiStore.showError(error.value)
      return false
    } finally {
      loading.value = false
    }
  }

  
  async function fetchRegistrationById(id: number) {
    const uiStore = useUiStore()

    try {
      loading.value = true
      error.value = null

      
      

      
      const mockRegistration = generateMockRegistrations(1)[0]
      mockRegistration.id = id

      currentRegistration.value = mockRegistration
      return mockRegistration
    } catch (err: any) {
      error.value = err.message || 'Error al cargar inscripción'
      uiStore.showError(error.value)
      return null
    } finally {
      loading.value = false
    }
  }

  
  
  

  
  function isRegisteredToEvent(eventId: number): boolean {
    return registeredEventIds.value.has(eventId)
  }

  
  async function registerToEvent(eventId: number, notes?: string) {
    const uiStore = useUiStore()
    const authStore = useAuthStore()

    if (!authStore.isAuthenticated) {
      uiStore.showError('Debes iniciar sesión para inscribirte')
      return null
    }

    try {
      loading.value = true
      error.value = null

      const registrationData: CreateRegistrationDto = {
        eventId,
        notes
      }

      
      

      
      const newRegistration: Registration = {
        id: Date.now(),
        userId: authStore.user!.id,
        eventId,
        status: 'Confirmed',
        registrationDate: new Date().toISOString(),
        notes
      }

      
      registrations.value.unshift(newRegistration)

      uiStore.showSuccess('¡Te has inscrito al evento!')
      return newRegistration
    } catch (err: any) {
      error.value = err.message || 'Error al inscribirse'
      uiStore.showError(error.value)
      return null
    } finally {
      loading.value = false
    }
  }

  
  async function unregisterFromEvent(eventId: number) {
    const uiStore = useUiStore()

    try {
      loading.value = true
      error.value = null

      
      const registration = registrations.value.find(r => r.eventId === eventId)
      if (!registration) {
        throw new Error('Inscripción no encontrada')
      }

      
      

      
      registration.status = 'Cancelled'

      uiStore.showSuccess('Has cancelado tu inscripción')
      return true
    } catch (err: any) {
      error.value = err.message || 'Error al cancelar inscripción'
      uiStore.showError(error.value)
      return false
    } finally {
      loading.value = false
    }
  }

  
  async function updateRegistrationStatus(id: number, status: RegistrationStatus) {
    const uiStore = useUiStore()

    try {
      loading.value = true
      error.value = null

      const updateData: UpdateRegistrationDto = { status }

      
      

      
      const registration = registrations.value.find(r => r.id === id)
      if (registration) {
        registration.status = status
      }

      uiStore.showSuccess('Estado de inscripción actualizado')
      return true
    } catch (err: any) {
      error.value = err.message || 'Error al actualizar inscripción'
      uiStore.showError(error.value)
      return false
    } finally {
      loading.value = false
    }
  }

  
  async function confirmAttendance(id: number) {
    return await updateRegistrationStatus(id, 'Attended')
  }

  
  async function markAsNoShow(id: number) {
    return await updateRegistrationStatus(id, 'NoShow')
  }

  
  
  

  
  function getRegistrationByEventId(eventId: number): Registration | undefined {
    return registrations.value.find(r => r.eventId === eventId)
  }

  
  function clearCurrentRegistration() {
    currentRegistration.value = null
  }

  
  
  

  
  function $reset() {
    registrations.value = []
    currentRegistration.value = null
    pagination.value = {
      page: 1,
      pageSize: 10,
      totalCount: 0,
      totalPages: 0,
      hasPreviousPage: false,
      hasNextPage: false
    }
    loading.value = false
    error.value = null
  }

  
  
  

  return {
    
    registrations,
    currentRegistration,
    pagination,
    loading,
    error,

    
    activeRegistrations,
    cancelledRegistrations,
    pastRegistrations,
    registeredEventIds,
    hasRegistrations,
    attendedCount,
    attendanceRate,

    
    fetchMyRegistrations,
    fetchRegistrationById,

    
    isRegisteredToEvent,
    registerToEvent,
    unregisterFromEvent,
    updateRegistrationStatus,
    confirmAttendance,
    markAsNoShow,

    
    getRegistrationByEventId,
    clearCurrentRegistration,

    
    $reset
  }
})






function generateMockRegistrations(count: number): Registration[] {
  const registrations: Registration[] = []
  const statuses: RegistrationStatus[] = ['Confirmed', 'Pending', 'Attended', 'NoShow']

  for (let i = 0; i < count; i++) {
    const registrationDate = new Date()
    registrationDate.setDate(registrationDate.getDate() - i * 5)

    registrations.push({
      id: i + 1,
      userId: 1,
      eventId: i + 1,
      event: {
        id: i + 1,
        title: `Evento ${i + 1}`,
        description: `Descripción del evento ${i + 1}`,
        startDate: new Date(Date.now() + i * 7 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(Date.now() + (i * 7 + 1) * 24 * 60 * 60 * 1000).toISOString(),
        capacity: 50,
        registeredCount: 25,
        status: 'Published',
        imageUrl: `https:
      },
      status: statuses[i % statuses.length],
      registrationDate: registrationDate.toISOString(),
      notes: i % 3 === 0 ? 'Notas de la inscripción' : undefined
    })
  }

  return registrations
}
