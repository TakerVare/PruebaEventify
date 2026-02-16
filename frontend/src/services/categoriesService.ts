

import apiClient from './apiClient'
import type { Category } from '@/types'





const CATEGORIES_ENDPOINTS = {
  BASE: '/categories',
  DETAIL: (id: number) => `/categories/${id}`
}





export const categoriesService = {
  
  async getAll(): Promise<Category[]> {
    const response = await apiClient.get<Category[]>(CATEGORIES_ENDPOINTS.BASE)
    return response.data
  },

  
  async getCategoryById(id: number): Promise<Category> {
    const response = await apiClient.get<Category>(CATEGORIES_ENDPOINTS.DETAIL(id))
    return response.data
  }
}

export default categoriesService
