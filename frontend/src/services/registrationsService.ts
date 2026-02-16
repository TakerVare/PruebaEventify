/**
 * =============================================================================
 * REGISTRATIONS SERVICE - Servicio de inscripciones
 * =============================================================================
 * Gestiona operaciones relacionadas con inscripciones a eventos:
 * - Inscripción y cancelación
 * - Listado de inscripciones del usuario
 * - Actualización de estado
 * =============================================================================
 */

import apiClient, { buildQueryString } from './apiClient'
import type {
  Registration,
  CreateRegistrationDto,
  UpdateRegistrationDto,
  PaginatedResponse
} from '@/types'

// -----------------------------------------------------------------------------
// ENDPOINTS
// -----------------------------------------------------------------------------

const REGISTRATIONS_ENDPOINTS = {
  BASE: '/registrations',
  DETAIL: (id: number) => `/registrations/${id}`,
  MY_REGISTRATIONS: '/registrations/my-registrations',
  REGISTER: '/registrations/register',
  CANCEL: (id: number) => `/registrations/${id}/cancel`
}

// -----------------------------------------------------------------------------
// SERVICIO DE INSCRIPCIONES
// -----------------------------------------------------------------------------

export const registrationsService = {
  /**
   * Obtiene las inscripciones del usuario autenticado
   * @param page - Número de página
   * @param pageSize - Elementos por página
   * @returns Promise<PaginatedResponse<Registration>>
   */
  async getMyRegistrations(
    page = 1,
    pageSize = 10
  ): Promise<PaginatedResponse<Registration>> {
    const queryString = buildQueryString({ page, pageSize })
    const response = await apiClient.get<PaginatedResponse<Registration>>(
      `${REGISTRATIONS_ENDPOINTS.MY_REGISTRATIONS}${queryString}`
    )
    return response.data
  },

  /**
   * Obtiene una inscripción por su ID
   * @param id - ID de la inscripción
   * @returns Promise<Registration>
   */
  async getById(id: number): Promise<Registration> {
    const response = await apiClient.get<Registration>(
      REGISTRATIONS_ENDPOINTS.DETAIL(id)
    )
    return response.data
  },

  /**
   * Inscribe al usuario en un evento
   * @param registrationData - Datos de inscripción
   * @returns Promise<Registration>
   */
  async register(registrationData: CreateRegistrationDto): Promise<Registration> {
    const response = await apiClient.post<Registration>(
      REGISTRATIONS_ENDPOINTS.REGISTER,
      registrationData
    )
    return response.data
  },

  /**
   * Cancela una inscripción
   * @param id - ID de la inscripción
   * @returns Promise<void>
   */
  async cancel(id: number): Promise<void> {
    await apiClient.post(REGISTRATIONS_ENDPOINTS.CANCEL(id))
  },

  /**
   * Actualiza una inscripción (estado, notas)
   * @param id - ID de la inscripción
   * @param updateData - Datos actualizados
   * @returns Promise<Registration>
   */
  async update(
    id: number,
    updateData: UpdateRegistrationDto
  ): Promise<Registration> {
    const response = await apiClient.put<Registration>(
      REGISTRATIONS_ENDPOINTS.DETAIL(id),
      updateData
    )
    return response.data
  }
}

export default registrationsService
