

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





const EVENTS_ENDPOINTS = {
  BASE: 'events',
  DETAIL: (id: number) => `events/${id}`,
  MY_EVENTS: 'events/my-events',
  STATS: 'events/stats',
  PUBLISH: (id: number) => `events/${id}/publish`,
  CANCEL: (id: number) => `events/${id}/cancel`
}





export const eventsService = {
  
  async getEvents(params?: EventSearchParams): Promise<PaginatedResponse<Event>> {
    const queryString = buildQueryString(params || {})
    const response = await apiClient.get<PaginatedResponse<Event>>(
      `${EVENTS_ENDPOINTS.BASE}${queryString}`
    )
    return response.data
  },

  
  async getEventById(id: number): Promise<Event> {
    const response = await apiClient.get<Event>(EVENTS_ENDPOINTS.DETAIL(id))
    return response.data
  },

  
  async getMyEvents(params?: EventSearchParams): Promise<PaginatedResponse<Event>> {
    const queryString = buildQueryString(params || {})
    const response = await apiClient.get<PaginatedResponse<Event>>(
      `${EVENTS_ENDPOINTS.MY_EVENTS}${queryString}`
    )
    return response.data
  },

  
  async createEvent(eventData: CreateEventDto): Promise<Event> {
    const response = await apiClient.post<Event>(EVENTS_ENDPOINTS.BASE, eventData)
    return response.data
  },

  
  async updateEvent(id: number, eventData: UpdateEventDto): Promise<Event> {
    const response = await apiClient.put<Event>(
      EVENTS_ENDPOINTS.DETAIL(id),
      eventData
    )
    return response.data
  },

  
  async deleteEvent(id: number): Promise<void> {
    await apiClient.delete(EVENTS_ENDPOINTS.DETAIL(id))
  },

  
  async publishEvent(id: number): Promise<Event> {
    const response = await apiClient.post<Event>(EVENTS_ENDPOINTS.PUBLISH(id))
    return response.data
  },

  
  async cancelEvent(id: number): Promise<Event> {
    const response = await apiClient.post<Event>(EVENTS_ENDPOINTS.CANCEL(id))
    return response.data
  },

  
  async getStats(): Promise<EventStats> {
    const response = await apiClient.get<EventStats>(EVENTS_ENDPOINTS.STATS)
    return response.data
  }
}

export default eventsService
