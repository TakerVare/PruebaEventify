/**
 * =============================================================================
 * API CLIENT - Cliente HTTP base con Axios
 * =============================================================================
 * Configuración centralizada de Axios para todas las peticiones HTTP.
 * Incluye:
 * - Configuración base (URL, timeout, headers)
 * - Interceptores de peticiones (añadir token JWT)
 * - Interceptores de respuestas (manejo de errores)
 * - Refresh automático de tokens expirados
 * =============================================================================
 */

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import type { ApiError } from '@/types'

// -----------------------------------------------------------------------------
// CONFIGURACIÓN BASE
// -----------------------------------------------------------------------------

/**
 * URL base de la API desde variables de entorno
 * Por defecto: http://localhost:5000/api
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

/**
 * Timeout por defecto para las peticiones (30 segundos)
 */
const API_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT) || 30000

// -----------------------------------------------------------------------------
// CREAR INSTANCIA DE AXIOS
// -----------------------------------------------------------------------------

/**
 * Instancia principal de Axios con configuración base
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// -----------------------------------------------------------------------------
// INTERCEPTORES DE PETICIONES (REQUEST)
// -----------------------------------------------------------------------------

/**
 * Interceptor de peticiones: Añade el token JWT a todas las peticiones
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Obtener token del localStorage
    const authData = localStorage.getItem('eventify-auth')

    if (authData) {
      try {
        const parsed = JSON.parse(authData)
        const token = parsed.token

        // Añadir token al header Authorization
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`
        }
      } catch (error) {
        console.error('Error al parsear token:', error)
      }
    }

    // Log de petición en desarrollo
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

// -----------------------------------------------------------------------------
// INTERCEPTORES DE RESPUESTAS (RESPONSE)
// -----------------------------------------------------------------------------

/**
 * Interceptor de respuestas: Maneja respuestas exitosas y errores
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log de respuesta en desarrollo
    if (import.meta.env.DEV) {
      console.log(`[API Response] ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data)
    }

    // Retornar solo los datos de la respuesta
    return response
  },
  async (error: AxiosError<ApiError>) => {
    // Log de error en desarrollo
    if (import.meta.env.DEV) {
      console.error('[API Response Error]', error.response?.data || error.message)
    }

    // Manejar errores específicos
    if (error.response) {
      const { status, data } = error.response

      // 401 Unauthorized: Token inválido o expirado
      if (status === 401) {
        // Obtener configuración de la petición original
        const originalRequest = error.config

        // Si la petición original no ha sido reintentada
        if (originalRequest && !(originalRequest as any)._retry) {
          (originalRequest as any)._retry = true

          try {
            // Intentar refrescar el token
            // TODO: Implementar refresh token cuando el backend lo soporte
            // const newToken = await refreshAuthToken()
            // Actualizar header y reintentar petición
            // originalRequest.headers.Authorization = `Bearer ${newToken}`
            // return apiClient(originalRequest)

            // Por ahora, redirigir al login
            handleUnauthorized()
          } catch (refreshError) {
            // Si falla el refresh, redirigir al login
            handleUnauthorized()
            return Promise.reject(refreshError)
          }
        } else {
          // Ya se intentó refrescar, redirigir al login
          handleUnauthorized()
        }
      }

      // 403 Forbidden: Sin permisos
      if (status === 403) {
        handleForbidden()
      }

      // 404 Not Found
      if (status === 404) {
        console.warn('[API] Recurso no encontrado:', error.config?.url)
      }

      // 500 Server Error
      if (status >= 500) {
        console.error('[API] Error del servidor:', data?.message || error.message)
      }

      // Transformar respuesta de error a formato ApiError
      const apiError: ApiError = {
        statusCode: status,
        message: data?.message || 'Error desconocido',
        errors: data?.errors,
        traceId: data?.traceId
      }

      return Promise.reject(apiError)
    }

    // Error de red (sin respuesta del servidor)
    if (error.request) {
      const networkError: ApiError = {
        statusCode: 0,
        message: 'Error de conexión. Verifica tu conexión a internet.',
        errors: undefined,
        traceId: undefined
      }
      return Promise.reject(networkError)
    }

    // Error al configurar la petición
    return Promise.reject({
      statusCode: 0,
      message: error.message || 'Error al realizar la petición'
    } as ApiError)
  }
)

// -----------------------------------------------------------------------------
// FUNCIONES AUXILIARES
// -----------------------------------------------------------------------------

/**
 * Maneja errores 401 (Unauthorized)
 * Limpia el localStorage y redirige al login
 */
function handleUnauthorized() {
  // Limpiar datos de autenticación
  localStorage.removeItem('eventify-auth')

  // Redirigir al login (solo si no estamos ya ahí)
  if (!window.location.pathname.includes('/login')) {
    window.location.href = '/login?session=expired'
  }
}

/**
 * Maneja errores 403 (Forbidden)
 * Muestra mensaje de sin permisos
 */
function handleForbidden() {
  console.warn('[API] Acceso denegado: sin permisos suficientes')
  // TODO: Mostrar notificación o redirigir a página de error
}

/**
 * Intenta refrescar el token JWT
 * TODO: Implementar cuando el backend soporte refresh tokens
 */
// async function refreshAuthToken(): Promise<string> {
//   const authData = localStorage.getItem('eventify-auth')
//   if (!authData) throw new Error('No auth data')
//
//   const { token } = JSON.parse(authData)
//   const response = await axios.post(`${API_BASE_URL}/auth/refresh`, { token })
//
//   // Actualizar token en localStorage
//   const newAuthData = { ...JSON.parse(authData), token: response.data.token }
//   localStorage.setItem('eventify-auth', JSON.stringify(newAuthData))
//
//   return response.data.token
// }

// -----------------------------------------------------------------------------
// EXPORTAR CLIENTE
// -----------------------------------------------------------------------------

export default apiClient

// -----------------------------------------------------------------------------
// MÉTODOS DE UTILIDAD
// -----------------------------------------------------------------------------

/**
 * Helper para construir query strings desde objetos
 * @param params - Objeto con parámetros
 * @returns Query string formateado
 */
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

/**
 * Helper para manejar errores de Axios y convertirlos a mensajes amigables
 * @param error - Error de Axios
 * @returns Mensaje de error formateado
 */
export function getErrorMessage(error: any): string {
  if (error.message) {
    return error.message
  }

  if (error.response?.data?.message) {
    return error.response.data.message
  }

  return 'Ha ocurrido un error inesperado'
}
