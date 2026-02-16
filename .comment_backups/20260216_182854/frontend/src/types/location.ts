/**
 * =============================================================================
 * TYPES/LOCATION.TS - Tipos relacionados con Ubicaciones/Salas
 * =============================================================================
 * Define todas las interfaces y tipos relacionados con la entidad Ubicación,
 * incluyendo DTOs de operaciones CRUD.
 * =============================================================================
 */

// -----------------------------------------------------------------------------
// INTERFACES PRINCIPALES
// -----------------------------------------------------------------------------

/**
 * Interfaz principal de Ubicación/Sala.
 * Representa la entidad completa tal como viene del backend.
 */
export interface Location {
  /** Identificador único */
  id: number
  
  /** Nombre de la ubicación */
  name: string
  
  /** Dirección completa */
  address: string
  
  /** Capacidad máxima de personas */
  capacity: number
  
  /** Descripción detallada */
  description?: string
  
  /** URL de la imagen de la ubicación */
  imageUrl?: string
  
  /** Indica si la ubicación está activa/disponible */
  isActive: boolean
  
  /** Fecha de creación */
  createdAt: string
  
  /** Fecha de última actualización */
  updatedAt?: string
  
  /** Coordenadas GPS (opcional, para mapas) */
  latitude?: number
  longitude?: number
  
  /** Información de contacto (opcional) */
  contactEmail?: string
  contactPhone?: string
  
  /** Equipamiento disponible (opcional) */
  amenities?: string[]
}

/**
 * Ubicación simplificada para listados y selects.
 * Contiene solo la información básica para mostrar en listas.
 */
export interface LocationSummary {
  /** Identificador único */
  id: number
  
  /** Nombre de la ubicación */
  name: string
  
  /** Dirección completa */
  address: string
  
  /** Capacidad máxima */
  capacity: number
  
  /** URL de la imagen */
  imageUrl?: string
  
  /** Estado activo */
  isActive: boolean
}

// -----------------------------------------------------------------------------
// DTOs DE CREACIÓN Y ACTUALIZACIÓN
// -----------------------------------------------------------------------------

/**
 * DTO para crear una nueva ubicación.
 * Todos los campos requeridos para crear una ubicación.
 */
export interface CreateLocationDto {
  /** Nombre de la ubicación */
  name: string
  
  /** Dirección completa */
  address: string
  
  /** Capacidad máxima de personas */
  capacity: number
  
  /** Descripción detallada (opcional) */
  description?: string
  
  /** URL de la imagen (opcional) */
  imageUrl?: string
  
  /** Coordenadas GPS (opcional) */
  latitude?: number
  longitude?: number
  
  /** Información de contacto (opcional) */
  contactEmail?: string
  contactPhone?: string
  
  /** Equipamiento disponible (opcional) */
  amenities?: string[]
}

/**
 * DTO para actualizar una ubicación existente.
 * Solo los campos proporcionados serán actualizados.
 */
export interface UpdateLocationDto {
  /** Nombre de la ubicación */
  name?: string
  
  /** Dirección completa */
  address?: string
  
  /** Capacidad máxima */
  capacity?: number
  
  /** Descripción */
  description?: string
  
  /** URL de la imagen */
  imageUrl?: string
  
  /** Estado activo/inactivo */
  isActive?: boolean
  
  /** Coordenadas GPS */
  latitude?: number
  longitude?: number
  
  /** Información de contacto */
  contactEmail?: string
  contactPhone?: string
  
  /** Equipamiento disponible */
  amenities?: string[]
}

// -----------------------------------------------------------------------------
// TIPOS PARA BÚSQUEDA Y FILTRADO
// -----------------------------------------------------------------------------

/**
 * Parámetros de búsqueda de ubicaciones.
 */
export interface LocationSearchParams {
  /** Término de búsqueda (busca en nombre y dirección) */
  search?: string
  
  /** Filtrar solo activas */
  isActive?: boolean
  
  /** Capacidad mínima */
  minCapacity?: number
  
  /** Capacidad máxima */
  maxCapacity?: number
  
  /** Campo por el que ordenar */
  sortBy?: 'name' | 'capacity' | 'createdAt'
  
  /** Dirección de ordenación */
  sortOrder?: 'asc' | 'desc'
  
  /** Número de página */
  page?: number
  
  /** Elementos por página */
  pageSize?: number
}

// -----------------------------------------------------------------------------
// TIPOS PARA SELECCIÓN
// -----------------------------------------------------------------------------

/**
 * Opción de ubicación para componentes de selección.
 * Formato simplificado para v-select y similares.
 */
export interface LocationOption {
  /** Valor (ID) */
  value: number
  
  /** Texto a mostrar */
  title: string
  
  /** Subtítulo (dirección) */
  subtitle: string
  
  /** Capacidad (para mostrar info adicional) */
  capacity: number
  
  /** Si está deshabilitada */
  disabled: boolean
}
