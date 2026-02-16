

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





export const useEventsStore = defineStore('events', () => {
  
  
  

  
  const events = ref<Event[]>([])

  
  const currentEvent = ref<Event | null>(null)

  
  const pagination = ref({
    page: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 0,
    hasPreviousPage: false,
    hasNextPage: false
  })

  
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

  
  const loading = ref(false)

  
  const error = ref<string | null>(null)

  
  const userRegisteredEventIds = ref<Set<number>>(new Set())

  
  
  

  
  const publishedEvents = computed(() => {
    return events.value.filter(event => event.status === 'Published')
  })

  
  const myEvents = computed(() => {
    const authStore = useAuthStore()
    if (!authStore.user) return []
    return events.value.filter(event => event.organizerId === authStore.user!.id)
  })

  
  const upcomingEvents = computed(() => {
    const now = new Date()
    return events.value.filter(event => new Date(event.startDate) > now)
  })

  
  const pastEvents = computed(() => {
    const now = new Date()
    return events.value.filter(event => new Date(event.endDate) < now)
  })

  
  const hasEvents = computed(() => events.value.length > 0)

  
  const hasMorePages = computed(() => pagination.value.hasNextPage)

  
  const currentPage = computed(() => pagination.value.page)

  
  const totalPages = computed(() => pagination.value.totalPages)

  
  
  

  
  async function fetchEvents(params?: EventSearchParams) {
    const uiStore = useUiStore()

    try {
      loading.value = true
      error.value = null

      
      if (params) {
        searchParams.value = { ...searchParams.value, ...params }
      }

      
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

  
  async function fetchEventById(id: number) {
    const uiStore = useUiStore()

    try {
      loading.value = true
      error.value = null

      
      

      
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

  
  async function searchEvents(searchTerm: string) {
    searchParams.value.search = searchTerm
    searchParams.value.page = 1 
    return await fetchEvents()
  }

  
  async function applyFilters(filters: Partial<EventSearchParams>) {
    searchParams.value = { ...searchParams.value, ...filters, page: 1 }
    return await fetchEvents()
  }

  
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

  
  async function changePage(page: number) {
    searchParams.value.page = page
    return await fetchEvents()
  }

  
  async function changePageSize(pageSize: number) {
    searchParams.value.pageSize = pageSize
    searchParams.value.page = 1 
    return await fetchEvents()
  }

  
  async function changeSorting(sortBy: string, sortDescending: boolean = false) {
    searchParams.value.sortBy = sortBy as any
    searchParams.value.sortDescending = sortDescending
    return await fetchEvents()
  }

  
  
  

  
  async function createEvent(eventData: CreateEventDto) {
    const uiStore = useUiStore()

    try {
      loading.value = true
      error.value = null

      
      

      
      const newEvent: Event = {
        id: Date.now(),
        ...eventData,
        registeredCount: 0,
        organizerId: 1, 
        createdAt: new Date().toISOString(),
        status: eventData.status || 'Draft'
      }

      
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

  
  async function updateEvent(id: number, eventData: UpdateEventDto) {
    const uiStore = useUiStore()

    try {
      loading.value = true
      error.value = null

      
      

      
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

  
  async function deleteEvent(id: number) {
    const uiStore = useUiStore()

    try {
      loading.value = true
      error.value = null

      
      

      
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

  
  async function changeEventStatus(id: number, status: EventStatus) {
    return await updateEvent(id, { status })
  }

  
  async function publishEvent(id: number) {
    return await changeEventStatus(id, 'Published')
  }

  
  async function cancelEvent(id: number) {
    return await changeEventStatus(id, 'Cancelled')
  }

  
  
  

  
  function isUserRegistered(eventId: number): boolean {
    return userRegisteredEventIds.value.has(eventId)
  }

  
  async function registerToEvent(eventId: number) {
    const uiStore = useUiStore()

    try {
      loading.value = true
      error.value = null

      
      

      
      userRegisteredEventIds.value.add(eventId)

      
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

  
  async function unregisterFromEvent(eventId: number) {
    const uiStore = useUiStore()

    try {
      loading.value = true
      error.value = null

      
      

      
      userRegisteredEventIds.value.delete(eventId)

      
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

  
  
  

  
  function clearCurrentEvent() {
    currentEvent.value = null
  }

  
  function setCurrentEvent(event: Event) {
    currentEvent.value = event
  }

  
  
  

  
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

  
  
  

  return {
    
    events,
    currentEvent,
    pagination,
    searchParams,
    loading,
    error,
    userRegisteredEventIds,

    
    publishedEvents,
    myEvents,
    upcomingEvents,
    pastEvents,
    hasEvents,
    hasMorePages,
    currentPage,
    totalPages,

    
    fetchEvents,
    fetchEventById,
    searchEvents,
    applyFilters,
    clearFilters,
    changePage,
    changePageSize,
    changeSorting,

    
    createEvent,
    updateEvent,
    deleteEvent,
    changeEventStatus,
    publishEvent,
    cancelEvent,

    
    isUserRegistered,
    registerToEvent,
    unregisterFromEvent,

    
    clearCurrentEvent,
    setCurrentEvent,

    
    $reset
  }
})






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
      imageUrl: `https:
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
