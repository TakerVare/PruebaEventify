






export enum UserRole {
  Admin = 'Admin',
  Organizer = 'Organizer',
  User = 'User'
}






export interface User {
  
  id: number
  
  
  email: string
  
  
  firstName: string
  
  
  lastName: string
  
  
  role: UserRole
  
  
  isActive: boolean
  
  
  createdAt: string
  
  
  updatedAt?: string
  
  
  avatarUrl?: string
}


export interface UserSummary {
  id: number
  email: string
  firstName: string
  lastName: string
  role: UserRole
  isActive: boolean
}






export interface LoginDto {
  
  email: string
  
  
  password: string
}


export interface RegisterDto {
  
  email: string
  
  
  password: string
  
  
  confirmPassword: string
  
  
  firstName: string
  
  
  lastName: string
}


export interface AuthResponse {
  
  token: string
  
  
  expiresAt: string
  
  
  user: User
}






export interface UpdateUserDto {
  
  firstName?: string
  
  
  lastName?: string
  
  
  avatarUrl?: string
}


export interface AdminUpdateUserDto extends UpdateUserDto {
  
  role?: UserRole
  
  
  isActive?: boolean
}


export interface ChangePasswordDto {
  
  currentPassword: string
  
  
  newPassword: string
  
  
  confirmNewPassword: string
}






export interface AuthState {
  
  user: User | null
  
  
  token: string | null
  
  
  loading: boolean
  
  
  error: string | null
}


export interface StoredCredentials {
  token: string
  expiresAt: string
}
