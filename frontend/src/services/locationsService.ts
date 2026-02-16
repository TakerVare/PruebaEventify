/**
 * =============================================================================
 * LOCATIONS SERVICE - Servicio de ubicaciones
 * =============================================================================
 * Gestiona todas las operaciones relacionadas con ubicaciones/salas:
 * - CRUD de ubicaciones
 * - Búsqueda y filtrado
 * - Listado de ubicaciones activas
 * =============================================================================
 */

import apiClient, { buildQueryString } from './apiClient'
import type {
  Location,
  LocationSummary,
  CreateLocationDto,
  UpdateLocationDto,
  LocationSearchParams,
  PaginatedResponse
} from '@/types'

// -----------------------------------------------------------------------------
// ENDPOINTS
// -----------------------------------------------------------------------------

const LOCATIONS_ENDPOINTS = {
  BASE: '/locations',
  DETAIL: (id: number) => `/locations/${id}`,
  ACTIVE: '/locations/active'
}

// -----------------------------------------------------------------------------
// SERVICIO DE UBICACIONES
// -----------------------------------------------------------------------------

export const locationsService = {
  /**
   * Obtiene lista de ubicaciones con filtros y paginación
   * @param params - Parámetros de búsqueda
   * @returns Promise<PaginatedResponse<Location>>
   */
  async getLocations(params?: LocationSearchParams): Promise<PaginatedResponse<Location>> {
    const queryString = buildQueryString(params || {})
    const response = await apiClient.get<PaginatedResponse<Location>>(
      `${LOCATIONS_ENDPOINTS.BASE}${queryString}`
    )
    return response.data
  },

  /**
   * Obtiene todas las ubicaciones activas (sin paginación)
   * @returns Promise<LocationSummary[]>
   */
  async getAllActive(): Promise<LocationSummary[]> {
    const response = await apiClient.get<LocationSummary[]>(LOCATIONS_ENDPOINTS.ACTIVE)
    return response.data
  },

  /**
   * Obtiene una ubicación por su ID
   * @param id - ID de la ubicación
   * @returns Promise<Location>
   */
  async getLocationById(id: number): Promise<Location> {
    const response = await apiClient.get<Location>(LOCATIONS_ENDPOINTS.DETAIL(id))
    return response.data
  },

  /**
   * Crea una nueva ubicación
   * @param locationData - Datos de la ubicación
   * @returns Promise<Location>
   */
  async createLocation(locationData: CreateLocationDto): Promise<Location> {
    const response = await apiClient.post<Location>(
      LOCATIONS_ENDPOINTS.BASE,
      locationData
    )
    return response.data
  },

  /**
   * Actualiza una ubicación existente
   * @param id - ID de la ubicación
   * @param locationData - Datos actualizados
   * @returns Promise<Location>
   */
  async updateLocation(id: number, locationData: UpdateLocationDto): Promise<Location> {
    const response = await apiClient.put<Location>(
      LOCATIONS_ENDPOINTS.DETAIL(id),
      locationData
    )
    return response.data
  },

  /**
   * Elimina una ubicación
   * @param id - ID de la ubicación
   * @returns Promise<void>
   */
  async deleteLocation(id: number): Promise<void> {
    await apiClient.delete(LOCATIONS_ENDPOINTS.DETAIL(id))
  }
}

export default locationsService
