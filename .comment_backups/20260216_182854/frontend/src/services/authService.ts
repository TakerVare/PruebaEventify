/**
 * =============================================================================
 * AUTH SERVICE - Servicio de autenticación
 * =============================================================================
 * Gestiona todas las operaciones relacionadas con autenticación:
 * - Login y registro
 * - Logout
 * - Refresh de tokens
 * - Obtención de datos del usuario actual
 * =============================================================================
 */

import apiClient from './apiClient'
import type { LoginDto, RegisterDto, AuthResponse, User } from '@/types'

// -----------------------------------------------------------------------------
// ENDPOINTS
// -----------------------------------------------------------------------------

const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  REFRESH: '/auth/refresh',
  CURRENT_USER: '/auth/me',
  CHANGE_PASSWORD: '/auth/change-password'
}

// -----------------------------------------------------------------------------
// SERVICIO DE AUTENTICACIÓN
// -----------------------------------------------------------------------------

export const authService = {
  /**
   * Inicia sesión con email y contraseña
   * @param credentials - Credenciales de login (email y password)
   * @returns Promise<AuthResponse> - Token y datos del usuario
   */
  async login(credentials: LoginDto): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      AUTH_ENDPOINTS.LOGIN,
      credentials
    )
    return response.data
  },

  /**
   * Registra un nuevo usuario
   * @param userData - Datos de registro
   * @returns Promise<AuthResponse> - Token y datos del usuario creado
   */
  async register(userData: RegisterDto): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      AUTH_ENDPOINTS.REGISTER,
      userData
    )
    return response.data
  },

  /**
   * Cierra la sesión del usuario actual
   * Invalida el token en el backend
   */
  async logout(): Promise<void> {
    await apiClient.post(AUTH_ENDPOINTS.LOGOUT)
  },

  /**
   * Refresca el token JWT cuando está próximo a expirar
   * @param currentToken - Token actual
   * @returns Promise<AuthResponse> - Nuevo token
   */
  async refreshToken(currentToken: string): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      AUTH_ENDPOINTS.REFRESH,
      { token: currentToken }
    )
    return response.data
  },

  /**
   * Obtiene los datos del usuario autenticado actual
   * @returns Promise<User> - Datos del usuario
   */
  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>(AUTH_ENDPOINTS.CURRENT_USER)
    return response.data
  },

  /**
   * Cambia la contraseña del usuario autenticado
   * @param currentPassword - Contraseña actual
   * @param newPassword - Nueva contraseña
   * @returns Promise<void>
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await apiClient.post(AUTH_ENDPOINTS.CHANGE_PASSWORD, {
      currentPassword,
      newPassword
    })
  }
}

export default authService
