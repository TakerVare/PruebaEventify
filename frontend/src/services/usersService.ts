/**
 * =============================================================================
 * USERS SERVICE - Servicio de usuarios (Admin)
 * =============================================================================
 * Gestiona operaciones de usuarios para administradores:
 * - Listado de usuarios
 * - Actualización de roles
 * - Activación/desactivación
 * =============================================================================
 */

import apiClient, { buildQueryString } from './apiClient'
import type { User, AdminUpdateUserDto, PaginatedResponse } from '@/types'

// -----------------------------------------------------------------------------
// TIPOS LOCALES
// -----------------------------------------------------------------------------

interface UserSearchParams {
  search?: string
  role?: string
  isActive?: boolean
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  page?: number
  pageSize?: number
}

// -----------------------------------------------------------------------------
// ENDPOINTS
// -----------------------------------------------------------------------------

const USERS_ENDPOINTS = {
  BASE: '/users',
  DETAIL: (id: number) => `/users/${id}`
}

// -----------------------------------------------------------------------------
// SERVICIO DE USUARIOS
// -----------------------------------------------------------------------------

export const usersService = {
  /**
   * Obtiene lista de usuarios con filtros y paginación
   * Solo accesible para administradores
   * @param params - Parámetros de búsqueda
   * @returns Promise<PaginatedResponse<User>>
   */
  async getUsers(params?: UserSearchParams): Promise<PaginatedResponse<User>> {
    const queryString = buildQueryString(params || {})
    const response = await apiClient.get<PaginatedResponse<User>>(
      `${USERS_ENDPOINTS.BASE}${queryString}`
    )
    return response.data
  },

  /**
   * Obtiene un usuario por su ID
   * @param id - ID del usuario
   * @returns Promise<User>
   */
  async getUserById(id: number): Promise<User> {
    const response = await apiClient.get<User>(USERS_ENDPOINTS.DETAIL(id))
    return response.data
  },

  /**
   * Actualiza los datos de un usuario (solo admin)
   * @param id - ID del usuario
   * @param userData - Datos actualizados
   * @returns Promise<User>
   */
  async updateUser(id: number, userData: AdminUpdateUserDto): Promise<User> {
    const response = await apiClient.put<User>(
      USERS_ENDPOINTS.DETAIL(id),
      userData
    )
    return response.data
  }
}

export default usersService
