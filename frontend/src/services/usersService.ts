

import apiClient, { buildQueryString } from './apiClient'
import type { User, AdminUpdateUserDto, PaginatedResponse } from '@/types'





interface UserSearchParams {
  search?: string
  role?: string
  isActive?: boolean
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  page?: number
  pageSize?: number
}





const USERS_ENDPOINTS = {
  BASE: '/users',
  DETAIL: (id: number) => `/users/${id}`
}





export const usersService = {
  
  async getUsers(params?: UserSearchParams): Promise<PaginatedResponse<User>> {
    const queryString = buildQueryString(params || {})
    const response = await apiClient.get<PaginatedResponse<User>>(
      `${USERS_ENDPOINTS.BASE}${queryString}`
    )
    return response.data
  },

  
  async getUserById(id: number): Promise<User> {
    const response = await apiClient.get<User>(USERS_ENDPOINTS.DETAIL(id))
    return response.data
  },

  
  async updateUser(id: number, userData: AdminUpdateUserDto): Promise<User> {
    const response = await apiClient.put<User>(
      USERS_ENDPOINTS.DETAIL(id),
      userData
    )
    return response.data
  }
}

export default usersService
