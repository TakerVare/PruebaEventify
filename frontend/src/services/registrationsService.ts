

import apiClient, { buildQueryString } from './apiClient'
import type {
  Registration,
  CreateRegistrationDto,
  UpdateRegistrationDto,
  PaginatedResponse
} from '@/types'





const REGISTRATIONS_ENDPOINTS = {
  BASE: '/registrations',
  DETAIL: (id: number) => `/registrations/${id}`,
  MY_REGISTRATIONS: '/registrations/my-registrations',
  REGISTER: '/registrations/register',
  CANCEL: (id: number) => `/registrations/${id}/cancel`
}





export const registrationsService = {
  
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

  
  async getById(id: number): Promise<Registration> {
    const response = await apiClient.get<Registration>(
      REGISTRATIONS_ENDPOINTS.DETAIL(id)
    )
    return response.data
  },

  
  async register(registrationData: CreateRegistrationDto): Promise<Registration> {
    const response = await apiClient.post<Registration>(
      REGISTRATIONS_ENDPOINTS.REGISTER,
      registrationData
    )
    return response.data
  },

  
  async cancel(id: number): Promise<void> {
    await apiClient.post(REGISTRATIONS_ENDPOINTS.CANCEL(id))
  },

  
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
