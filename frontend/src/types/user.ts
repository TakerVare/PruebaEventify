/**
 * =============================================================================
 * TYPES/USER.TS - Tipos relacionados con Usuarios
 * =============================================================================
 * Define todas las interfaces y tipos relacionados con la entidad Usuario,
 * incluyendo roles, DTOs de autenticación y respuestas de la API.
 * =============================================================================
 */

// -----------------------------------------------------------------------------
// ENUMS
// -----------------------------------------------------------------------------

/**
 * Roles disponibles en el sistema.
 * Cada rol tiene permisos diferentes:
 * - Admin: Acceso total al sistema
 * - Organizer: Puede crear y gestionar sus propios eventos
 * - User: Solo puede ver eventos y registrarse
 */
export enum UserRole {
  Admin = 'Admin',
  Organizer = 'Organizer',
  User = 'User'
}

// -----------------------------------------------------------------------------
// INTERFACES PRINCIPALES
// -----------------------------------------------------------------------------

/**
 * Interfaz principal del Usuario.
 * Representa la entidad completa tal como viene del backend.
 */
export interface User {
  /** Identificador único */
  id: number
  
  /** Correo electrónico (único, usado para login) */
  email: string
  
  /** Nombre del usuario */
  firstName: string
  
  /** Apellido del usuario */
  lastName: string
  
  /** Rol del usuario en el sistema */
  role: UserRole
  
  /** Indica si el usuario está activo */
  isActive: boolean
  
  /** Fecha de creación de la cuenta */
  createdAt: string
  
  /** Fecha de última actualización */
  updatedAt?: string
  
  /** URL de la imagen de perfil (opcional) */
  avatarUrl?: string
}

/**
 * Usuario simplificado para listados.
 * Contiene solo la información necesaria para mostrar en listas.
 */
export interface UserSummary {
  id: number
  email: string
  firstName: string
  lastName: string
  role: UserRole
  isActive: boolean
}

// -----------------------------------------------------------------------------
// DTOs DE AUTENTICACIÓN
// -----------------------------------------------------------------------------

/**
 * DTO para el login de usuario.
 * Campos requeridos para iniciar sesión.
 */
export interface LoginDto {
  /** Correo electrónico */
  email: string
  
  /** Contraseña */
  password: string
}

/**
 * DTO para el registro de nuevo usuario.
 * Campos requeridos para crear una cuenta.
 */
export interface RegisterDto {
  /** Correo electrónico */
  email: string
  
  /** Contraseña (mínimo 8 caracteres, incluir mayúscula, minúscula y número) */
  password: string
  
  /** Confirmación de contraseña */
  confirmPassword: string
  
  /** Nombre */
  firstName: string
  
  /** Apellido */
  lastName: string
}

/**
 * Respuesta del servidor tras autenticación exitosa.
 * Incluye el token JWT y los datos del usuario.
 */
export interface AuthResponse {
  /** Token JWT para autenticación de peticiones */
  token: string
  
  /** Fecha de expiración del token */
  expiresAt: string
  
  /** Datos del usuario autenticado */
  user: User
}

// -----------------------------------------------------------------------------
// DTOs DE ACTUALIZACIÓN
// -----------------------------------------------------------------------------

/**
 * DTO para actualizar datos de un usuario.
 * Solo los campos proporcionados serán actualizados.
 */
export interface UpdateUserDto {
  /** Nuevo nombre (opcional) */
  firstName?: string
  
  /** Nuevo apellido (opcional) */
  lastName?: string
  
  /** Nueva URL de avatar (opcional) */
  avatarUrl?: string
}

/**
 * DTO para que un admin actualice un usuario.
 * Incluye campos adicionales como rol y estado.
 */
export interface AdminUpdateUserDto extends UpdateUserDto {
  /** Nuevo rol (solo admin) */
  role?: UserRole
  
  /** Estado activo/inactivo (solo admin) */
  isActive?: boolean
}

/**
 * DTO para cambiar la contraseña.
 */
export interface ChangePasswordDto {
  /** Contraseña actual */
  currentPassword: string
  
  /** Nueva contraseña */
  newPassword: string
  
  /** Confirmación de nueva contraseña */
  confirmNewPassword: string
}

// -----------------------------------------------------------------------------
// TIPOS AUXILIARES
// -----------------------------------------------------------------------------

/**
 * Estado de autenticación para el store.
 */
export interface AuthState {
  /** Usuario actualmente autenticado (null si no hay sesión) */
  user: User | null
  
  /** Token JWT actual */
  token: string | null
  
  /** Indica si hay una operación de auth en curso */
  loading: boolean
  
  /** Mensaje de error si la autenticación falla */
  error: string | null
}

/**
 * Credenciales almacenadas en localStorage.
 */
export interface StoredCredentials {
  token: string
  expiresAt: string
}
