/**
 * =============================================================================
 * EVENTS SERVICE - Servicio de eventos
 * =============================================================================
 * Gestiona todas las operaciones relacionadas con eventos:
 * - CRUD de eventos
 * - Búsqueda y filtrado
 * - Paginación
 * - Estadísticas
 * =============================================================================
 */

import apiClient, { buildQueryString } from './apiClient'
import type {
  Event,
  EventSummary,
  CreateEventDto,
  UpdateEventDto,
  EventSearchParams,
  EventStats,
  PaginatedResponse
} from '@/types'

// -----------------------------------------------------------------------------
// ENDPOINTS
// -----------------------------------------------------------------------------

const EVENTS_ENDPOINTS = {
  BASE: 'events',
  DETAIL: (id: number) => `events/${id}`,
  MY_EVENTS: 'events/my-events',
  STATS: 'events/stats',
  PUBLISH: (id: number) => `events/${id}/publish`,
  CANCEL: (id: number) => `events/${id}/cancel`
}

// -----------------------------------------------------------------------------
// SERVICIO DE EVENTOS
// -----------------------------------------------------------------------------

export const eventsService = {
  /**
   * Obtiene lista de eventos con filtros y paginación
   * @param params - Parámetros de búsqueda
   * @returns Promise<PaginatedResponse<Event>>
   */
  async getEvents(params?: EventSearchParams): Promise<PaginatedResponse<Event>> {
    const queryString = buildQueryString(params || {})
    const response = await apiClient.get<PaginatedResponse<Event>>(
      `${EVENTS_ENDPOINTS.BASE}${queryString}`
    )
    return response.data
  },

  /**
   * Obtiene un evento por su ID
   * @param id - ID del evento
   * @returns Promise<Event>
   */
  async getEventById(id: number): Promise<Event> {
    const response = await apiClient.get<Event>(EVENTS_ENDPOINTS.DETAIL(id))
    return response.data
  },

  /**
   * Obtiene los eventos del usuario autenticado (organizador)
   * @param params - Parámetros de búsqueda
   * @returns Promise<PaginatedResponse<Event>>
   */
  async getMyEvents(params?: EventSearchParams): Promise<PaginatedResponse<Event>> {
    const queryString = buildQueryString(params || {})
    const response = await apiClient.get<PaginatedResponse<Event>>(
      `${EVENTS_ENDPOINTS.MY_EVENTS}${queryString}`
    )
    return response.data
  },

  /**
   * Crea un nuevo evento
   * @param eventData - Datos del evento
   * @returns Promise<Event>
   */
  async createEvent(eventData: CreateEventDto): Promise<Event> {
    const response = await apiClient.post<Event>(EVENTS_ENDPOINTS.BASE, eventData)
    return response.data
  },

  /**
   * Actualiza un evento existente
   * @param id - ID del evento
   * @param eventData - Datos actualizados
   * @returns Promise<Event>
   */
  async updateEvent(id: number, eventData: UpdateEventDto): Promise<Event> {
    const response = await apiClient.put<Event>(
      EVENTS_ENDPOINTS.DETAIL(id),
      eventData
    )
    return response.data
  },

  /**
   * Elimina un evento
   * @param id - ID del evento
   * @returns Promise<void>
   */
  async deleteEvent(id: number): Promise<void> {
    await apiClient.delete(EVENTS_ENDPOINTS.DETAIL(id))
  },

  /**
   * Publica un evento (cambia estado a Published)
   * @param id - ID del evento
   * @returns Promise<Event>
   */
  async publishEvent(id: number): Promise<Event> {
    const response = await apiClient.post<Event>(EVENTS_ENDPOINTS.PUBLISH(id))
    return response.data
  },

  /**
   * Cancela un evento (cambia estado a Cancelled)
   * @param id - ID del evento
   * @returns Promise<Event>
   */
  async cancelEvent(id: number): Promise<Event> {
    const response = await apiClient.post<Event>(EVENTS_ENDPOINTS.CANCEL(id))
    return response.data
  },

  /**
   * Obtiene estadísticas de eventos
   * @returns Promise<EventStats>
   */
  async getStats(): Promise<EventStats> {
    const response = await apiClient.get<EventStats>(EVENTS_ENDPOINTS.STATS)
    return response.data
  }
}

export default eventsService
