

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





export const useLocationsStore = defineStore('locations', () => {
  
  
  

  
  const locations = ref<Location[]>([])

  
  const currentLocation = ref<Location | null>(null)

  
  const pagination = ref({
    page: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 0,
    hasPreviousPage: false,
    hasNextPage: false
  })

  
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

  
  const loading = ref(false)

  
  const error = ref<string | null>(null)

  
  
  

  
  const activeLocations = computed(() => {
    return locations.value.filter(location => location.isActive)
  })

  
  const inactiveLocations = computed(() => {
    return locations.value.filter(location => !location.isActive)
  })

  
  const locationOptions = computed((): LocationOption[] => {
    return activeLocations.value.map(location => ({
      value: location.id,
      title: location.name,
      subtitle: location.address,
      capacity: location.capacity,
      disabled: !location.isActive
    }))
  })

  
  const locationsByCapacity = computed(() => {
    const small = locations.value.filter(l => l.capacity < 50)
    const medium = locations.value.filter(l => l.capacity >= 50 && l.capacity < 100)
    const large = locations.value.filter(l => l.capacity >= 100)

    return { small, medium, large }
  })

  
  const hasLocations = computed(() => locations.value.length > 0)

  
  const hasMorePages = computed(() => pagination.value.hasNextPage)

  
  const currentPage = computed(() => pagination.value.page)

  
  const totalPages = computed(() => pagination.value.totalPages)

  
  
  

  
  async function fetchLocations(params?: LocationSearchParams) {
    const uiStore = useUiStore()

    try {
      loading.value = true
      error.value = null

      
      if (params) {
        searchParams.value = { ...searchParams.value, ...params }
      }

      
      

      
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

  
  async function fetchAllActiveLocations() {
    const uiStore = useUiStore()

    try {
      loading.value = true
      error.value = null

      
      

      
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

  
  async function fetchLocationById(id: number) {
    const uiStore = useUiStore()

    try {
      loading.value = true
      error.value = null

      
      

      
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

  
  async function searchLocations(searchTerm: string) {
    searchParams.value.search = searchTerm
    searchParams.value.page = 1 
    return await fetchLocations()
  }

  
  async function applyFilters(filters: Partial<LocationSearchParams>) {
    searchParams.value = { ...searchParams.value, ...filters, page: 1 }
    return await fetchLocations()
  }

  
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

  
  async function changePage(page: number) {
    searchParams.value.page = page
    return await fetchLocations()
  }

  
  async function changePageSize(pageSize: number) {
    searchParams.value.pageSize = pageSize
    searchParams.value.page = 1 
    return await fetchLocations()
  }

  
  async function changeSorting(sortBy: string, sortOrder: 'asc' | 'desc') {
    searchParams.value.sortBy = sortBy as any
    searchParams.value.sortOrder = sortOrder
    return await fetchLocations()
  }

  
  
  

  
  async function createLocation(locationData: CreateLocationDto) {
    const uiStore = useUiStore()

    try {
      loading.value = true
      error.value = null

      
      

      
      const newLocation: Location = {
        id: Date.now(),
        ...locationData,
        isActive: true,
        createdAt: new Date().toISOString()
      }

      
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

  
  async function updateLocation(id: number, locationData: UpdateLocationDto) {
    const uiStore = useUiStore()

    try {
      loading.value = true
      error.value = null

      
      

      
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

  
  async function deleteLocation(id: number) {
    const uiStore = useUiStore()

    try {
      loading.value = true
      error.value = null

      
      

      
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

  
  async function activateLocation(id: number) {
    return await updateLocation(id, { isActive: true })
  }

  
  async function deactivateLocation(id: number) {
    return await updateLocation(id, { isActive: false })
  }

  
  
  

  
  function clearCurrentLocation() {
    currentLocation.value = null
  }

  
  function setCurrentLocation(location: Location) {
    currentLocation.value = location
  }

  
  function getLocationById(id: number): Location | undefined {
    return locations.value.find(l => l.id === id)
  }

  
  
  

  
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

  
  
  

  return {
    
    locations,
    currentLocation,
    pagination,
    searchParams,
    loading,
    error,

    
    activeLocations,
    inactiveLocations,
    locationOptions,
    locationsByCapacity,
    hasLocations,
    hasMorePages,
    currentPage,
    totalPages,

    
    fetchLocations,
    fetchAllActiveLocations,
    fetchLocationById,
    searchLocations,
    applyFilters,
    clearFilters,
    changePage,
    changePageSize,
    changeSorting,

    
    createLocation,
    updateLocation,
    deleteLocation,
    activateLocation,
    deactivateLocation,

    
    clearCurrentLocation,
    setCurrentLocation,
    getLocationById,

    
    $reset
  }
})






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
      imageUrl: `https:
      isActive: i % 5 !== 0, 
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
