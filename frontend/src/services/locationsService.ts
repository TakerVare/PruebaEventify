

import apiClient, { buildQueryString } from './apiClient'
import type {
  Location,
  LocationSummary,
  CreateLocationDto,
  UpdateLocationDto,
  LocationSearchParams,
  PaginatedResponse
} from '@/types'





const LOCATIONS_ENDPOINTS = {
  BASE: '/locations',
  DETAIL: (id: number) => `/locations/${id}`,
  ACTIVE: '/locations/active'
}





export const locationsService = {
  
  async getLocations(params?: LocationSearchParams): Promise<PaginatedResponse<Location>> {
    const queryString = buildQueryString(params || {})
    const response = await apiClient.get<PaginatedResponse<Location>>(
      `${LOCATIONS_ENDPOINTS.BASE}${queryString}`
    )
    return response.data
  },

  
  async getAllActive(): Promise<LocationSummary[]> {
    const response = await apiClient.get<LocationSummary[]>(LOCATIONS_ENDPOINTS.ACTIVE)
    return response.data
  },

  
  async getLocationById(id: number): Promise<Location> {
    const response = await apiClient.get<Location>(LOCATIONS_ENDPOINTS.DETAIL(id))
    return response.data
  },

  
  async createLocation(locationData: CreateLocationDto): Promise<Location> {
    const response = await apiClient.post<Location>(
      LOCATIONS_ENDPOINTS.BASE,
      locationData
    )
    return response.data
  },

  
  async updateLocation(id: number, locationData: UpdateLocationDto): Promise<Location> {
    const response = await apiClient.put<Location>(
      LOCATIONS_ENDPOINTS.DETAIL(id),
      locationData
    )
    return response.data
  },

  
  async deleteLocation(id: number): Promise<void> {
    await apiClient.delete(LOCATIONS_ENDPOINTS.DETAIL(id))
  }
}

export default locationsService
