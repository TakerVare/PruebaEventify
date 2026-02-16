/**
 * =============================================================================
 * TYPES/API.TS - Tipos relacionados con la API
 * =============================================================================
 * Define interfaces genéricas para respuestas de API, paginación,
 * errores y otros tipos comunes usados en las comunicaciones HTTP.
 * =============================================================================
 */

// -----------------------------------------------------------------------------
// RESPUESTAS GENÉRICAS
// -----------------------------------------------------------------------------

/**
 * Respuesta genérica de la API para operaciones exitosas.
 * Envuelve cualquier tipo de datos con metadatos adicionales.
 * 
 * @template T - Tipo de datos contenidos en la respuesta
 */
export interface ApiResponse<T> {
  /** Datos de la respuesta */
  data: T
  
  /** Mensaje descriptivo (opcional) */
  message?: string
  
  /** Indica si la operación fue exitosa */
  success: boolean
}

/**
 * Respuesta paginada de la API.
 * Usada para listados con paginación del lado del servidor.
 * 
 * @template T - Tipo de elementos en la lista
 */
export interface PaginatedResponse<T> {
  /** Lista de elementos de la página actual */
  items: T[]
  
  /** Página actual (1-indexed) */
  page: number
  
  /** Elementos por página */
  pageSize: number
  
  /** Total de elementos en todas las páginas */
  totalCount: number
  
  /** Total de páginas disponibles */
  totalPages: number
  
  /** Indica si hay una página anterior */
  hasPreviousPage: boolean
  
  /** Indica si hay una página siguiente */
  hasNextPage: boolean
}

// -----------------------------------------------------------------------------
// ERRORES
// -----------------------------------------------------------------------------

/**
 * Estructura de error de la API.
 * Formato estándar para errores del backend.
 */
export interface ApiError {
  /** Código de estado HTTP */
  statusCode: number
  
  /** Mensaje de error general */
  message: string
  
  /** Errores de validación por campo (si aplica) */
  errors?: Record<string, string[]>
  
  /** Identificador único del error para tracking */
  traceId?: string
}

/**
 * Error de validación con detalles por campo.
 * Usado para mostrar errores en formularios.
 */
export interface ValidationError {
  /** Campo que tiene el error */
  field: string
  
  /** Mensajes de error para ese campo */
  messages: string[]
}

// -----------------------------------------------------------------------------
// PARÁMETROS DE CONSULTA
// -----------------------------------------------------------------------------

/**
 * Parámetros base de paginación.
 * Extendido por los SearchParams específicos de cada entidad.
 */
export interface PaginationParams {
  /** Número de página (1-indexed) */
  page?: number
  
  /** Elementos por página */
  pageSize?: number
}

/**
 * Parámetros base de ordenación.
 */
export interface SortParams {
  /** Campo por el que ordenar */
  sortBy?: string
  
  /** Dirección de ordenación */
  sortOrder?: 'asc' | 'desc'
}

/**
 * Parámetros de búsqueda combinados.
 * Une paginación y ordenación.
 */
export interface SearchParams extends PaginationParams, SortParams {
  /** Término de búsqueda */
  search?: string
}

// -----------------------------------------------------------------------------
// ESTADOS DE PETICIÓN
// -----------------------------------------------------------------------------

/**
 * Estado de una petición HTTP.
 * Usado en stores para tracking de operaciones asíncronas.
 */
export interface RequestState {
  /** Indica si la petición está en curso */
  loading: boolean
  
  /** Error de la última petición (null si exitosa) */
  error: string | null
}

/**
 * Estado de una entidad en el store.
 * Combina datos con estado de petición.
 * 
 * @template T - Tipo de la entidad
 */
export interface EntityState<T> extends RequestState {
  /** Datos de la entidad */
  data: T | null
}

/**
 * Estado de una lista de entidades en el store.
 * Incluye paginación y estado de petición.
 * 
 * @template T - Tipo de elementos en la lista
 */
export interface ListState<T> extends RequestState {
  /** Lista de elementos */
  items: T[]
  
  /** Información de paginación */
  pagination: {
    page: number
    pageSize: number
    totalCount: number
    totalPages: number
  }
}

// -----------------------------------------------------------------------------
// TIPOS AUXILIARES
// -----------------------------------------------------------------------------

/**
 * Objeto clave-valor genérico.
 * Útil para parámetros dinámicos y queries.
 */
export type QueryParams = Record<string, string | number | boolean | undefined>

/**
 * Función de ordenación para tablas.
 */
export interface SortOption {
  /** Campo a ordenar */
  key: string
  
  /** Dirección de ordenación */
  order: 'asc' | 'desc'
}

/**
 * Opciones de filtro para componentes de filtrado.
 */
export interface FilterOption<T = string | number> {
  /** Valor del filtro */
  value: T
  
  /** Texto a mostrar */
  label: string
  
  /** Icono opcional */
  icon?: string
  
  /** Color opcional */
  color?: string
}
