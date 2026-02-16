

import apiClient from './apiClient'
import type { LoginDto, RegisterDto, AuthResponse, User } from '@/types'





const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  REFRESH: '/auth/refresh',
  CURRENT_USER: '/auth/me',
  CHANGE_PASSWORD: '/auth/change-password'
}





export const authService = {
  
  async login(credentials: LoginDto): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      AUTH_ENDPOINTS.LOGIN,
      credentials
    )
    return response.data
  },

  
  async register(userData: RegisterDto): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      AUTH_ENDPOINTS.REGISTER,
      userData
    )
    return response.data
  },

  
  async logout(): Promise<void> {
    await apiClient.post(AUTH_ENDPOINTS.LOGOUT)
  },

  
  async refreshToken(currentToken: string): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      AUTH_ENDPOINTS.REFRESH,
      { token: currentToken }
    )
    return response.data
  },

  
  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>(AUTH_ENDPOINTS.CURRENT_USER)
    return response.data
  },

  
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await apiClient.post(AUTH_ENDPOINTS.CHANGE_PASSWORD, {
      currentPassword,
      newPassword
    })
  }
}

export default authService
