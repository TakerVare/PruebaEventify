

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import type { ApiError } from '@/types'






const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'


const API_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT) || 30000






const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})






apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    
    const authData = localStorage.getItem('eventify-auth')

    if (authData) {
      try {
        const parsed = JSON.parse(authData)
        const token = parsed.token

        
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`
        }
      } catch (error) {
        console.error('Error al parsear token:', error)
      }
    }

    
    if (import.meta.env.DEV) {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, config.data)
    }

    return config
  },
  (error: AxiosError) => {
    console.error('[API Request Error]', error)
    return Promise.reject(error)
  }
)






apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    
    if (import.meta.env.DEV) {
      console.log(`[API Response] ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data)
    }

    
    return response
  },
  async (error: AxiosError<ApiError>) => {
    
    if (import.meta.env.DEV) {
      console.error('[API Response Error]', error.response?.data || error.message)
    }

    
    if (error.response) {
      const { status, data } = error.response

      
      if (status === 401) {
        
        const originalRequest = error.config

        
        if (originalRequest && !(originalRequest as any)._retry) {
          (originalRequest as any)._retry = true

          try {
            
            
            
            
            
            

            
            handleUnauthorized()
          } catch (refreshError) {
            
            handleUnauthorized()
            return Promise.reject(refreshError)
          }
        } else {
          
          handleUnauthorized()
        }
      }

      
      if (status === 403) {
        handleForbidden()
      }

      
      if (status === 404) {
        console.warn('[API] Recurso no encontrado:', error.config?.url)
      }

      
      if (status >= 500) {
        console.error('[API] Error del servidor:', data?.message || error.message)
      }

      
      const apiError: ApiError = {
        statusCode: status,
        message: data?.message || 'Error desconocido',
        errors: data?.errors,
        traceId: data?.traceId
      }

      return Promise.reject(apiError)
    }

    
    if (error.request) {
      const networkError: ApiError = {
        statusCode: 0,
        message: 'Error de conexión. Verifica tu conexión a internet.',
        errors: undefined,
        traceId: undefined
      }
      return Promise.reject(networkError)
    }

    
    return Promise.reject({
      statusCode: 0,
      message: error.message || 'Error al realizar la petición'
    } as ApiError)
  }
)






function handleUnauthorized() {
  
  localStorage.removeItem('eventify-auth')

  
  if (!window.location.pathname.includes('/login')) {
    window.location.href = '/login?session=expired'
  }
}


function handleForbidden() {
  console.warn('[API] Acceso denegado: sin permisos suficientes')
  
}




















export default apiClient






export function buildQueryString(params: Record<string, any>): string {
  const query = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.append(key, String(value))
    }
  })

  const queryString = query.toString()
  return queryString ? `?${queryString}` : ''
}


export function getErrorMessage(error: any): string {
  if (error.message) {
    return error.message
  }

  if (error.response?.data?.message) {
    return error.response.data.message
  }

  return 'Ha ocurrido un error inesperado'
}
