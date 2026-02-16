/**
 * =============================================================================
 * STORE LOCATIONS - Gestión de ubicaciones
 * =============================================================================
 * Este store maneja todo lo relacionado con ubicaciones/salas:
 * - Listado de ubicaciones con paginación y filtros
 * - CRUD de ubicaciones (crear, leer, actualizar, eliminar)
 * - Búsqueda y filtrado
 * - Opciones para selects
 * =============================================================================
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type {
  Location,
  LocationSummary,
  CreateLocationDto,
  UpdateLocationDto,
  LocationSearchParams,
  LocationOption,
  PaginatedResponse
} from '@/types'
import { useUiStore } from './ui'

// -----------------------------------------------------------------------------
// DEFINICIÓN DEL STORE
// -----------------------------------------------------------------------------

export const useLocationsStore = defineStore('locations', () => {
  // ===========================================================================
  // ESTADO
  // ===========================================================================

  /**
   * Lista de ubicaciones cargadas
   */
  const locations = ref<Location[]>([])

  /**
   * Ubicación actualmente seleccionada/en detalle
   */
  const currentLocation = ref<Location | null>(null)

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
  const searchParams = ref<LocationSearchParams>({
    search: '',
    isActive: undefined,
    minCapacity: undefined,
    maxCapacity: undefined,
    sortBy: 'name',
    sortOrder: 'asc',
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
   * Ubicaciones activas (disponibles para crear eventos)
   */
  const activeLocations = computed(() => {
    return locations.value.filter(location => location.isActive)
  })

  /**
   * Ubicaciones inactivas
   */
  const inactiveLocations = computed(() => {
    return locations.value.filter(location => !location.isActive)
  })

  /**
   * Opciones de ubicaciones para componentes de selección (v-select)
   */
  const locationOptions = computed((): LocationOption[] => {
    return activeLocations.value.map(location => ({
      value: location.id,
      title: location.name,
      subtitle: location.address,
      capacity: location.capacity,
      disabled: !location.isActive
    }))
  })

  /**
   * Ubicaciones agrupadas por capacidad (pequeñas, medianas, grandes)
   */
  const locationsByCapacity = computed(() => {
    const small = locations.value.filter(l => l.capacity < 50)
    const medium = locations.value.filter(l => l.capacity >= 50 && l.capacity < 100)
    const large = locations.value.filter(l => l.capacity >= 100)

    return { small, medium, large }
  })

  /**
   * Indica si hay ubicaciones cargadas
   */
  const hasLocations = computed(() => locations.value.length > 0)

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
   * Obtiene la lista de ubicaciones con filtros y paginación
   * @param params - Parámetros de búsqueda (opcional)
   */
  async function fetchLocations(params?: LocationSearchParams) {
    const uiStore = useUiStore()

    try {
      loading.value = true
      error.value = null

      // Actualizar parámetros de búsqueda si se proporcionan
      if (params) {
        searchParams.value = { ...searchParams.value, ...params }
      }

      // TODO: Llamar al servicio de ubicaciones cuando se implemente
      // const response = await locationsService.getLocations(searchParams.value)

      // MOCK: Simular respuesta del backend
      const mockResponse: PaginatedResponse<Location> = {
        items: generateMockLocations(searchParams.value.pageSize || 10),
        page: searchParams.value.page || 1,
        pageSize: searchParams.value.pageSize || 10,
        totalCount: 15,
        totalPages: 2,
        hasPreviousPage: (searchParams.value.page || 1) > 1,
        hasNextPage: (searchParams.value.page || 1) < 2
      }

      locations.value = mockResponse.items
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
      error.value = err.message || 'Error al cargar ubicaciones'
      uiStore.showError(error.value)
      return false
    } finally {
      loading.value = false
    }
  }

  /**
   * Obtiene todas las ubicaciones activas (sin paginación)
   * Útil para llenar selects y dropdowns
   */
  async function fetchAllActiveLocations() {
    const uiStore = useUiStore()

    try {
      loading.value = true
      error.value = null

      // TODO: Llamar al servicio de ubicaciones
      // const allLocations = await locationsService.getAllActive()

      // MOCK: Simular respuesta
      const mockLocations = generateMockLocations(5)
      locations.value = mockLocations.filter(l => l.isActive)

      return locations.value
    } catch (err: any) {
      error.value = err.message || 'Error al cargar ubicaciones'
      uiStore.showError(error.value)
      return []
    } finally {
      loading.value = false
    }
  }

  /**
   * Obtiene una ubicación por su ID
   * @param id - ID de la ubicación
   */
  async function fetchLocationById(id: number) {
    const uiStore = useUiStore()

    try {
      loading.value = true
      error.value = null

      // TODO: Llamar al servicio de ubicaciones
      // const location = await locationsService.getLocationById(id)

      // MOCK: Simular respuesta
      const mockLocation = generateMockLocations(1)[0]
      mockLocation.id = id

      currentLocation.value = mockLocation
      return mockLocation
    } catch (err: any) {
      error.value = err.message || 'Error al cargar ubicación'
      uiStore.showError(error.value)
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * Busca ubicaciones por término de búsqueda
   * @param searchTerm - Término de búsqueda
   */
  async function searchLocations(searchTerm: string) {
    searchParams.value.search = searchTerm
    searchParams.value.page = 1 // Reset a primera página
    return await fetchLocations()
  }

  /**
   * Aplica filtros de búsqueda
   * @param filters - Filtros a aplicar
   */
  async function applyFilters(filters: Partial<LocationSearchParams>) {
    searchParams.value = { ...searchParams.value, ...filters, page: 1 }
    return await fetchLocations()
  }

  /**
   * Limpia todos los filtros
   */
  async function clearFilters() {
    searchParams.value = {
      search: '',
      isActive: undefined,
      minCapacity: undefined,
      maxCapacity: undefined,
      sortBy: 'name',
      sortOrder: 'asc',
      page: 1,
      pageSize: 10
    }
    return await fetchLocations()
  }

  /**
   * Cambia de página
   * @param page - Número de página
   */
  async function changePage(page: number) {
    searchParams.value.page = page
    return await fetchLocations()
  }

  /**
   * Cambia el tamaño de página
   * @param pageSize - Número de elementos por página
   */
  async function changePageSize(pageSize: number) {
    searchParams.value.pageSize = pageSize
    searchParams.value.page = 1 // Reset a primera página
    return await fetchLocations()
  }

  /**
   * Cambia la ordenación
   * @param sortBy - Campo por el que ordenar
   * @param sortOrder - Dirección de ordenación
   */
  async function changeSorting(sortBy: string, sortOrder: 'asc' | 'desc') {
    searchParams.value.sortBy = sortBy as any
    searchParams.value.sortOrder = sortOrder
    return await fetchLocations()
  }

  // ===========================================================================
  // ACCIONES - CRUD
  // ===========================================================================

  /**
   * Crea una nueva ubicación
   * @param locationData - Datos de la ubicación a crear
   */
  async function createLocation(locationData: CreateLocationDto) {
    const uiStore = useUiStore()

    try {
      loading.value = true
      error.value = null

      // TODO: Llamar al servicio de ubicaciones
      // const newLocation = await locationsService.createLocation(locationData)

      // MOCK: Simular respuesta
      const newLocation: Location = {
        id: Date.now(),
        ...locationData,
        isActive: true,
        createdAt: new Date().toISOString()
      }

      // Añadir a la lista local
      locations.value.unshift(newLocation)

      uiStore.showSuccess('Ubicación creada exitosamente')
      return newLocation
    } catch (err: any) {
      error.value = err.message || 'Error al crear ubicación'
      uiStore.showError(error.value)
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * Actualiza una ubicación existente
   * @param id - ID de la ubicación
   * @param locationData - Datos actualizados
   */
  async function updateLocation(id: number, locationData: UpdateLocationDto) {
    const uiStore = useUiStore()

    try {
      loading.value = true
      error.value = null

      // TODO: Llamar al servicio de ubicaciones
      // const updatedLocation = await locationsService.updateLocation(id, locationData)

      // MOCK: Simular respuesta
      const index = locations.value.findIndex(l => l.id === id)
      if (index !== -1) {
        locations.value[index] = { ...locations.value[index], ...locationData }
      }

      if (currentLocation.value && currentLocation.value.id === id) {
        currentLocation.value = { ...currentLocation.value, ...locationData }
      }

      uiStore.showSuccess('Ubicación actualizada correctamente')
      return true
    } catch (err: any) {
      error.value = err.message || 'Error al actualizar ubicación'
      uiStore.showError(error.value)
      return false
    } finally {
      loading.value = false
    }
  }

  /**
   * Elimina una ubicación
   * @param id - ID de la ubicación a eliminar
   */
  async function deleteLocation(id: number) {
    const uiStore = useUiStore()

    try {
      loading.value = true
      error.value = null

      // TODO: Llamar al servicio de ubicaciones
      // await locationsService.deleteLocation(id)

      // MOCK: Simular eliminación
      locations.value = locations.value.filter(l => l.id !== id)

      if (currentLocation.value && currentLocation.value.id === id) {
        currentLocation.value = null
      }

      uiStore.showSuccess('Ubicación eliminada correctamente')
      return true
    } catch (err: any) {
      error.value = err.message || 'Error al eliminar ubicación'
      uiStore.showError(error.value)
      return false
    } finally {
      loading.value = false
    }
  }

  /**
   * Activa una ubicación
   * @param id - ID de la ubicación
   */
  async function activateLocation(id: number) {
    return await updateLocation(id, { isActive: true })
  }

  /**
   * Desactiva una ubicación
   * @param id - ID de la ubicación
   */
  async function deactivateLocation(id: number) {
    return await updateLocation(id, { isActive: false })
  }

  // ===========================================================================
  // ACCIONES - HELPERS
  // ===========================================================================

  /**
   * Limpia la ubicación actual
   */
  function clearCurrentLocation() {
    currentLocation.value = null
  }

  /**
   * Establece la ubicación actual
   * @param location - Ubicación a establecer
   */
  function setCurrentLocation(location: Location) {
    currentLocation.value = location
  }

  /**
   * Obtiene una ubicación por ID desde la lista cargada (sin API call)
   * @param id - ID de la ubicación
   */
  function getLocationById(id: number): Location | undefined {
    return locations.value.find(l => l.id === id)
  }

  // ===========================================================================
  // RESET
  // ===========================================================================

  /**
   * Resetea el store a sus valores por defecto
   */
  function $reset() {
    locations.value = []
    currentLocation.value = null
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
      sortBy: 'name',
      sortOrder: 'asc',
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
    locations,
    currentLocation,
    pagination,
    searchParams,
    loading,
    error,

    // Getters
    activeLocations,
    inactiveLocations,
    locationOptions,
    locationsByCapacity,
    hasLocations,
    hasMorePages,
    currentPage,
    totalPages,

    // Acciones - Listado y búsqueda
    fetchLocations,
    fetchAllActiveLocations,
    fetchLocationById,
    searchLocations,
    applyFilters,
    clearFilters,
    changePage,
    changePageSize,
    changeSorting,

    // Acciones - CRUD
    createLocation,
    updateLocation,
    deleteLocation,
    activateLocation,
    deactivateLocation,

    // Acciones - Helpers
    clearCurrentLocation,
    setCurrentLocation,
    getLocationById,

    // Reset
    $reset
  }
})

// =============================================================================
// FUNCIONES AUXILIARES (MOCK DATA)
// =============================================================================

/**
 * Genera ubicaciones mock para pruebas
 */
function generateMockLocations(count: number): Location[] {
  const locations: Location[] = []
  const names = [
    'Sala Principal',
    'Auditorio Central',
    'Sala de Conferencias A',
    'Sala de Conferencias B',
    'Sala de Workshops',
    'Centro de Convenciones',
    'Sala Polivalente',
    'Aula Magna',
    'Salón de Actos',
    'Espacio Coworking'
  ]

  const addresses = [
    'Calle Principal 123, Madrid',
    'Avenida Central 456, Barcelona',
    'Plaza Mayor 789, Valencia',
    'Calle Gran Vía 101, Sevilla',
    'Paseo Marítimo 202, Málaga'
  ]

  for (let i = 0; i < count; i++) {
    locations.push({
      id: i + 1,
      name: names[i % names.length],
      address: addresses[i % addresses.length],
      capacity: [30, 50, 80, 100, 150, 200][i % 6],
      description: `Descripción de la ubicación ${names[i % names.length]}. Espacio moderno y equipado.`,
      imageUrl: `https://picsum.photos/seed/location${i}/800/600`,
      isActive: i % 5 !== 0, // Una de cada 5 inactiva
      createdAt: new Date().toISOString(),
      latitude: 40.4168 + (Math.random() - 0.5) * 0.1,
      longitude: -3.7038 + (Math.random() - 0.5) * 0.1,
      contactEmail: `contacto.${names[i % names.length].toLowerCase().replace(/ /g, '')}@eventify.com`,
      contactPhone: `+34 ${Math.floor(Math.random() * 900000000 + 600000000)}`,
      amenities: ['WiFi', 'Proyector', 'Aire acondicionado', 'Catering']
    })
  }

  return locations
}
