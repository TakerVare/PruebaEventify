/**
 * =============================================================================
 * STORE EVENTS - Gestión de eventos
 * =============================================================================
 * Este store maneja todo lo relacionado con eventos:
 * - Listado de eventos con paginación y filtros
 * - CRUD de eventos (crear, leer, actualizar, eliminar)
 * - Búsqueda y filtrado avanzado
 * - Inscripciones a eventos
 * - Estadísticas de eventos
 * =============================================================================
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type {
  Event,
  EventSummary,
  CreateEventDto,
  UpdateEventDto,
  EventSearchParams,
  EventStatus,
  PaginatedResponse
} from '@/types'
import { useUiStore } from './ui'
import { useAuthStore } from './auth'
import { eventsService } from '@/services/eventsService'

// -----------------------------------------------------------------------------
// DEFINICIÓN DEL STORE
// -----------------------------------------------------------------------------

export const useEventsStore = defineStore('events', () => {
  // ===========================================================================
  // ESTADO
  // ===========================================================================

  /**
   * Lista de eventos cargados
   */
  const events = ref<Event[]>([])

  /**
   * Evento actualmente seleccionado/en detalle
   */
  const currentEvent = ref<Event | null>(null)

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
  const searchParams = ref<EventSearchParams>({
    search: '',
    categoryId: undefined,
    locationId: undefined,
    status: undefined,
    startDate: undefined,
    endDate: undefined,
    sortBy: 'startDate',
    sortDescending: false,
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

  /**
   * IDs de eventos en los que el usuario está inscrito
   */
  const userRegisteredEventIds = ref<Set<number>>(new Set())

  // ===========================================================================
  // GETTERS
  // ===========================================================================

  /**
   * Eventos publicados (visibles públicamente)
   */
  const publishedEvents = computed(() => {
    return events.value.filter(event => event.status === 'Published')
  })

  /**
   * Eventos del usuario autenticado (si es organizador)
   */
  const myEvents = computed(() => {
    const authStore = useAuthStore()
    if (!authStore.user) return []
    return events.value.filter(event => event.organizerId === authStore.user!.id)
  })

  /**
   * Eventos próximos (futuros)
   */
  const upcomingEvents = computed(() => {
    const now = new Date()
    return events.value.filter(event => new Date(event.startDate) > now)
  })

  /**
   * Eventos pasados
   */
  const pastEvents = computed(() => {
    const now = new Date()
    return events.value.filter(event => new Date(event.endDate) < now)
  })

  /**
   * Indica si hay eventos cargados
   */
  const hasEvents = computed(() => events.value.length > 0)

  /**
   * Indica si hay más páginas disponibles
   */
  const hasMorePages = computed(() => pagination.value.hasNextPage)

  /**
   * Página actual
   */
  const currentPage = computed(() => pagination.value.page)

  /**
   * Total de páginas
   */
  const totalPages = computed(() => pagination.value.totalPages)

  // ===========================================================================
  // ACCIONES - LISTADO Y BÚSQUEDA
  // ===========================================================================

  /**
   * Obtiene la lista de eventos con filtros y paginación
   * @param params - Parámetros de búsqueda (opcional, usa searchParams del store por defecto)
   */
  async function fetchEvents(params?: EventSearchParams) {
    const uiStore = useUiStore()

    try {
      loading.value = true
      error.value = null

      // Actualizar parámetros de búsqueda si se proporcionan
      if (params) {
        searchParams.value = { ...searchParams.value, ...params }
      }

      // Llamar al servicio de eventos
      const response = await eventsService.getEvents(searchParams.value)

      events.value = response.Items || response.items || []
      pagination.value = {
        page: response.Page || response.page || 1,
        pageSize: response.PageSize || response.pageSize || 10,
        totalCount: response.TotalCount || response.totalCount || 0,
        totalPages: response.TotalPages || response.totalPages || 0,
        hasPreviousPage: response.HasPreviousPage || response.hasPreviousPage || false,
        hasNextPage: response.HasNextPage || response.hasNextPage || false
      }

      return true
    } catch (err: any) {
      error.value = err.message || 'Error al cargar eventos'
      uiStore.showError(error.value)
      return false
    } finally {
      loading.value = false
    }
  }

  /**
   * Obtiene un evento por su ID
   * @param id - ID del evento
   */
  async function fetchEventById(id: number) {
    const uiStore = useUiStore()

    try {
      loading.value = true
      error.value = null

      // TODO: Llamar al servicio de eventos
      // const event = await eventsService.getEventById(id)

      // MOCK: Simular respuesta
      const mockEvent = generateMockEvents(1)[0]
      mockEvent.id = id

      currentEvent.value = mockEvent
      return mockEvent
    } catch (err: any) {
      error.value = err.message || 'Error al cargar evento'
      uiStore.showError(error.value)
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * Busca eventos por término de búsqueda
   * @param searchTerm - Término de búsqueda
   */
  async function searchEvents(searchTerm: string) {
    searchParams.value.search = searchTerm
    searchParams.value.page = 1 // Reset a primera página
    return await fetchEvents()
  }

  /**
   * Aplica filtros de búsqueda
   * @param filters - Filtros a aplicar
   */
  async function applyFilters(filters: Partial<EventSearchParams>) {
    searchParams.value = { ...searchParams.value, ...filters, page: 1 }
    return await fetchEvents()
  }

  /**
   * Limpia todos los filtros
   */
  async function clearFilters() {
    searchParams.value = {
      search: '',
      categoryId: undefined,
      locationId: undefined,
      status: undefined,
      startDate: undefined,
      endDate: undefined,
      sortBy: 'startDate',
      sortDescending: false,
      page: 1,
      pageSize: 10
    }
    return await fetchEvents()
  }

  /**
   * Cambia de página
   * @param page - Número de página
   */
  async function changePage(page: number) {
    searchParams.value.page = page
    return await fetchEvents()
  }

  /**
   * Cambia el tamaño de página
   * @param pageSize - Número de elementos por página
   */
  async function changePageSize(pageSize: number) {
    searchParams.value.pageSize = pageSize
    searchParams.value.page = 1 // Reset a primera página
    return await fetchEvents()
  }

  /**
   * Cambia la ordenación
   * @param sortBy - Campo por el que ordenar
   * @param sortDescending - Si es descendente
   */
  async function changeSorting(sortBy: string, sortDescending: boolean = false) {
    searchParams.value.sortBy = sortBy as any
    searchParams.value.sortDescending = sortDescending
    return await fetchEvents()
  }

  // ===========================================================================
  // ACCIONES - CRUD
  // ===========================================================================

  /**
   * Crea un nuevo evento
   * @param eventData - Datos del evento a crear
   */
  async function createEvent(eventData: CreateEventDto) {
    const uiStore = useUiStore()

    try {
      loading.value = true
      error.value = null

      // TODO: Llamar al servicio de eventos
      // const newEvent = await eventsService.createEvent(eventData)

      // MOCK: Simular respuesta
      const newEvent: Event = {
        id: Date.now(),
        ...eventData,
        registeredCount: 0,
        organizerId: 1, // TODO: Obtener del authStore
        createdAt: new Date().toISOString(),
        status: eventData.status || 'Draft'
      }

      // Añadir a la lista local
      events.value.unshift(newEvent)

      uiStore.showSuccess('Evento creado exitosamente')
      return newEvent
    } catch (err: any) {
      error.value = err.message || 'Error al crear evento'
      uiStore.showError(error.value)
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * Actualiza un evento existente
   * @param id - ID del evento
   * @param eventData - Datos actualizados
   */
  async function updateEvent(id: number, eventData: UpdateEventDto) {
    const uiStore = useUiStore()

    try {
      loading.value = true
      error.value = null

      // TODO: Llamar al servicio de eventos
      // const updatedEvent = await eventsService.updateEvent(id, eventData)

      // MOCK: Simular respuesta
      const index = events.value.findIndex(e => e.id === id)
      if (index !== -1) {
        events.value[index] = { ...events.value[index], ...eventData }
      }

      if (currentEvent.value && currentEvent.value.id === id) {
        currentEvent.value = { ...currentEvent.value, ...eventData }
      }

      uiStore.showSuccess('Evento actualizado correctamente')
      return true
    } catch (err: any) {
      error.value = err.message || 'Error al actualizar evento'
      uiStore.showError(error.value)
      return false
    } finally {
      loading.value = false
    }
  }

  /**
   * Elimina un evento
   * @param id - ID del evento a eliminar
   */
  async function deleteEvent(id: number) {
    const uiStore = useUiStore()

    try {
      loading.value = true
      error.value = null

      // TODO: Llamar al servicio de eventos
      // await eventsService.deleteEvent(id)

      // MOCK: Simular eliminación
      events.value = events.value.filter(e => e.id !== id)

      if (currentEvent.value && currentEvent.value.id === id) {
        currentEvent.value = null
      }

      uiStore.showSuccess('Evento eliminado correctamente')
      return true
    } catch (err: any) {
      error.value = err.message || 'Error al eliminar evento'
      uiStore.showError(error.value)
      return false
    } finally {
      loading.value = false
    }
  }

  /**
   * Cambia el estado de un evento
   * @param id - ID del evento
   * @param status - Nuevo estado
   */
  async function changeEventStatus(id: number, status: EventStatus) {
    return await updateEvent(id, { status })
  }

  /**
   * Publica un evento (cambia estado a Published)
   * @param id - ID del evento
   */
  async function publishEvent(id: number) {
    return await changeEventStatus(id, 'Published')
  }

  /**
   * Cancela un evento (cambia estado a Cancelled)
   * @param id - ID del evento
   */
  async function cancelEvent(id: number) {
    return await changeEventStatus(id, 'Cancelled')
  }

  // ===========================================================================
  // ACCIONES - INSCRIPCIONES
  // ===========================================================================

  /**
   * Verifica si el usuario está inscrito en un evento
   * @param eventId - ID del evento
   */
  function isUserRegistered(eventId: number): boolean {
    return userRegisteredEventIds.value.has(eventId)
  }

  /**
   * Inscribe al usuario en un evento
   * @param eventId - ID del evento
   */
  async function registerToEvent(eventId: number) {
    const uiStore = useUiStore()

    try {
      loading.value = true
      error.value = null

      // TODO: Llamar al servicio de inscripciones
      // await registrationsService.register(eventId)

      // MOCK: Simular inscripción
      userRegisteredEventIds.value.add(eventId)

      // Actualizar contador de inscritos
      const event = events.value.find(e => e.id === eventId)
      if (event) {
        event.registeredCount++
      }

      uiStore.showSuccess('¡Te has inscrito al evento!')
      return true
    } catch (err: any) {
      error.value = err.message || 'Error al inscribirse al evento'
      uiStore.showError(error.value)
      return false
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

      // TODO: Llamar al servicio de inscripciones
      // await registrationsService.unregister(eventId)

      // MOCK: Simular cancelación
      userRegisteredEventIds.value.delete(eventId)

      // Actualizar contador de inscritos
      const event = events.value.find(e => e.id === eventId)
      if (event && event.registeredCount > 0) {
        event.registeredCount--
      }

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

  // ===========================================================================
  // ACCIONES - HELPERS
  // ===========================================================================

  /**
   * Limpia el evento actual
   */
  function clearCurrentEvent() {
    currentEvent.value = null
  }

  /**
   * Establece el evento actual
   * @param event - Evento a establecer
   */
  function setCurrentEvent(event: Event) {
    currentEvent.value = event
  }

  // ===========================================================================
  // RESET
  // ===========================================================================

  /**
   * Resetea el store a sus valores por defecto
   */
  function $reset() {
    events.value = []
    currentEvent.value = null
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
      sortBy: 'startDate',
      sortDescending: false,
      page: 1,
      pageSize: 10
    }
    loading.value = false
    error.value = null
    userRegisteredEventIds.value.clear()
  }

  // ===========================================================================
  // RETURN (API PÚBLICA DEL STORE)
  // ===========================================================================

  return {
    // Estado
    events,
    currentEvent,
    pagination,
    searchParams,
    loading,
    error,
    userRegisteredEventIds,

    // Getters
    publishedEvents,
    myEvents,
    upcomingEvents,
    pastEvents,
    hasEvents,
    hasMorePages,
    currentPage,
    totalPages,

    // Acciones - Listado y búsqueda
    fetchEvents,
    fetchEventById,
    searchEvents,
    applyFilters,
    clearFilters,
    changePage,
    changePageSize,
    changeSorting,

    // Acciones - CRUD
    createEvent,
    updateEvent,
    deleteEvent,
    changeEventStatus,
    publishEvent,
    cancelEvent,

    // Acciones - Inscripciones
    isUserRegistered,
    registerToEvent,
    unregisterFromEvent,

    // Acciones - Helpers
    clearCurrentEvent,
    setCurrentEvent,

    // Reset
    $reset
  }
})

// =============================================================================
// FUNCIONES AUXILIARES (MOCK DATA)
// =============================================================================

/**
 * Genera eventos mock para pruebas
 */
function generateMockEvents(count: number): Event[] {
  const events: Event[] = []
  const categories = [
    { id: 1, name: 'Conferencia', color: '#1976D2', icon: 'mdi-presentation' },
    { id: 2, name: 'Taller', color: '#4CAF50', icon: 'mdi-tools' },
    { id: 3, name: 'Meetup', color: '#FF9800', icon: 'mdi-account-group' }
  ]

  for (let i = 0; i < count; i++) {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() + i * 7)
    const endDate = new Date(startDate)
    endDate.setHours(endDate.getHours() + 3)

    events.push({
      id: i + 1,
      title: `Evento ${i + 1}`,
      description: `Descripción del evento ${i + 1}`,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      capacity: 50,
      registeredCount: Math.floor(Math.random() * 50),
      imageUrl: `https://picsum.photos/seed/${i}/800/400`,
      status: 'Published',
      locationId: 1,
      location: {
        id: 1,
        name: 'Sala Principal',
        address: 'Calle Principal 123',
        capacity: 100,
        isActive: true
      },
      organizerId: 1,
      categoryId: categories[i % categories.length].id,
      category: categories[i % categories.length],
      createdAt: new Date().toISOString()
    })
  }

  return events
}
