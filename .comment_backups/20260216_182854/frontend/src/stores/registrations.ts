/**
 * =============================================================================
 * STORE REGISTRATIONS - Gestión de inscripciones a eventos
 * =============================================================================
 * Este store maneja todo lo relacionado con inscripciones:
 * - Listado de inscripciones del usuario
 * - Inscripción y cancelación de eventos
 * - Estado de inscripciones
 * - Historial de asistencias
 * =============================================================================
 */

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

// -----------------------------------------------------------------------------
// DEFINICIÓN DEL STORE
// -----------------------------------------------------------------------------

export const useRegistrationsStore = defineStore('registrations', () => {
  // ===========================================================================
  // ESTADO
  // ===========================================================================

  /**
   * Lista de inscripciones del usuario actual
   */
  const registrations = ref<Registration[]>([])

  /**
   * Inscripción actualmente seleccionada
   */
  const currentRegistration = ref<Registration | null>(null)

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
   * Inscripciones activas (confirmadas o pendientes)
   */
  const activeRegistrations = computed(() => {
    return registrations.value.filter(
      r => r.status === 'Confirmed' || r.status === 'Pending'
    )
  })

  /**
   * Inscripciones canceladas
   */
  const cancelledRegistrations = computed(() => {
    return registrations.value.filter(r => r.status === 'Cancelled')
  })

  /**
   * Inscripciones pasadas (eventos completados)
   */
  const pastRegistrations = computed(() => {
    return registrations.value.filter(
      r => r.status === 'Attended' || r.status === 'NoShow'
    )
  })

  /**
   * IDs de eventos en los que el usuario está inscrito
   */
  const registeredEventIds = computed(() => {
    return new Set(
      activeRegistrations.value.map(r => r.eventId)
    )
  })

  /**
   * Indica si hay inscripciones cargadas
   */
  const hasRegistrations = computed(() => registrations.value.length > 0)

  /**
   * Total de eventos a los que el usuario ha asistido
   */
  const attendedCount = computed(() => {
    return registrations.value.filter(r => r.status === 'Attended').length
  })

  /**
   * Tasa de asistencia del usuario (porcentaje)
   */
  const attendanceRate = computed(() => {
    const total = pastRegistrations.value.length
    if (total === 0) return 0
    return (attendedCount.value / total) * 100
  })

  // ===========================================================================
  // ACCIONES - LISTADO
  // ===========================================================================

  /**
   * Obtiene las inscripciones del usuario actual
   * @param page - Número de página
   * @param pageSize - Elementos por página
   */
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

      // TODO: Llamar al servicio de inscripciones cuando se implemente
      // const response = await registrationsService.getMyRegistrations(page, pageSize)

      // MOCK: Simular respuesta del backend
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

  /**
   * Obtiene una inscripción por su ID
   * @param id - ID de la inscripción
   */
  async function fetchRegistrationById(id: number) {
    const uiStore = useUiStore()

    try {
      loading.value = true
      error.value = null

      // TODO: Llamar al servicio de inscripciones
      // const registration = await registrationsService.getById(id)

      // MOCK: Simular respuesta
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

  // ===========================================================================
  // ACCIONES - INSCRIPCIONES
  // ===========================================================================

  /**
   * Verifica si el usuario está inscrito en un evento
   * @param eventId - ID del evento
   */
  function isRegisteredToEvent(eventId: number): boolean {
    return registeredEventIds.value.has(eventId)
  }

  /**
   * Inscribe al usuario en un evento
   * @param eventId - ID del evento
   * @param notes - Notas opcionales
   */
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

      // TODO: Llamar al servicio de inscripciones
      // const newRegistration = await registrationsService.register(registrationData)

      // MOCK: Simular respuesta
      const newRegistration: Registration = {
        id: Date.now(),
        userId: authStore.user!.id,
        eventId,
        status: 'Confirmed',
        registrationDate: new Date().toISOString(),
        notes
      }

      // Añadir a la lista local
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

  /**
   * Cancela la inscripción del usuario a un evento
   * @param eventId - ID del evento
   */
  async function unregisterFromEvent(eventId: number) {
    const uiStore = useUiStore()

    try {
      loading.value = true
      error.value = null

      // Buscar la inscripción
      const registration = registrations.value.find(r => r.eventId === eventId)
      if (!registration) {
        throw new Error('Inscripción no encontrada')
      }

      // TODO: Llamar al servicio de inscripciones
      // await registrationsService.cancel(registration.id)

      // MOCK: Actualizar estado localmente
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

  /**
   * Actualiza el estado de una inscripción
   * @param id - ID de la inscripción
   * @param status - Nuevo estado
   */
  async function updateRegistrationStatus(id: number, status: RegistrationStatus) {
    const uiStore = useUiStore()

    try {
      loading.value = true
      error.value = null

      const updateData: UpdateRegistrationDto = { status }

      // TODO: Llamar al servicio de inscripciones
      // await registrationsService.update(id, updateData)

      // MOCK: Actualizar localmente
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

  /**
   * Confirma la asistencia a un evento
   * @param id - ID de la inscripción
   */
  async function confirmAttendance(id: number) {
    return await updateRegistrationStatus(id, 'Attended')
  }

  /**
   * Marca una inscripción como no asistida
   * @param id - ID de la inscripción
   */
  async function markAsNoShow(id: number) {
    return await updateRegistrationStatus(id, 'NoShow')
  }

  // ===========================================================================
  // ACCIONES - HELPERS
  // ===========================================================================

  /**
   * Obtiene la inscripción de un evento específico
   * @param eventId - ID del evento
   */
  function getRegistrationByEventId(eventId: number): Registration | undefined {
    return registrations.value.find(r => r.eventId === eventId)
  }

  /**
   * Limpia la inscripción actual
   */
  function clearCurrentRegistration() {
    currentRegistration.value = null
  }

  // ===========================================================================
  // RESET
  // ===========================================================================

  /**
   * Resetea el store a sus valores por defecto
   */
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

  // ===========================================================================
  // RETURN (API PÚBLICA DEL STORE)
  // ===========================================================================

  return {
    // Estado
    registrations,
    currentRegistration,
    pagination,
    loading,
    error,

    // Getters
    activeRegistrations,
    cancelledRegistrations,
    pastRegistrations,
    registeredEventIds,
    hasRegistrations,
    attendedCount,
    attendanceRate,

    // Acciones - Listado
    fetchMyRegistrations,
    fetchRegistrationById,

    // Acciones - Inscripciones
    isRegisteredToEvent,
    registerToEvent,
    unregisterFromEvent,
    updateRegistrationStatus,
    confirmAttendance,
    markAsNoShow,

    // Acciones - Helpers
    getRegistrationByEventId,
    clearCurrentRegistration,

    // Reset
    $reset
  }
})

// =============================================================================
// FUNCIONES AUXILIARES (MOCK DATA)
// =============================================================================

/**
 * Genera inscripciones mock para pruebas
 */
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
        imageUrl: `https://picsum.photos/seed/${i}/400/200`
      },
      status: statuses[i % statuses.length],
      registrationDate: registrationDate.toISOString(),
      notes: i % 3 === 0 ? 'Notas de la inscripción' : undefined
    })
  }

  return registrations
}
