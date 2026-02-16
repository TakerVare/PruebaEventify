/**
 * =============================================================================
 * CATEGORIES SERVICE - Servicio de categorías
 * =============================================================================
 * Gestiona operaciones relacionadas con categorías de eventos:
 * - Listado de categorías
 * =============================================================================
 */

import apiClient from './apiClient'
import type { Category } from '@/types'

// -----------------------------------------------------------------------------
// ENDPOINTS
// -----------------------------------------------------------------------------

const CATEGORIES_ENDPOINTS = {
  BASE: '/categories',
  DETAIL: (id: number) => `/categories/${id}`
}

// -----------------------------------------------------------------------------
// SERVICIO DE CATEGORÍAS
// -----------------------------------------------------------------------------

export const categoriesService = {
  /**
   * Obtiene todas las categorías disponibles
   * @returns Promise<Category[]>
   */
  async getAll(): Promise<Category[]> {
    const response = await apiClient.get<Category[]>(CATEGORIES_ENDPOINTS.BASE)
    return response.data
  },

  /**
   * Obtiene una categoría por su ID
   * @param id - ID de la categoría
   * @returns Promise<Category>
   */
  async getCategoryById(id: number): Promise<Category> {
    const response = await apiClient.get<Category>(CATEGORIES_ENDPOINTS.DETAIL(id))
    return response.data
  }
}

export default categoriesService
