/**
 * =============================================================================
 * TYPES/EVENT.TS - Tipos relacionados con Eventos
 * =============================================================================
 * Define todas las interfaces y tipos relacionados con la entidad Evento,
 * incluyendo categorías, inscripciones y DTOs de operaciones CRUD.
 * =============================================================================
 */

import type { UserSummary } from './user'
import type { LocationSummary } from './location'

// -----------------------------------------------------------------------------
// ENUMS
// -----------------------------------------------------------------------------

/**
 * Estados posibles de un evento.
 * Controla la visibilidad y disponibilidad del evento.
 */
export enum EventStatus {
  /** Borrador: Solo visible para el organizador */
  Draft = 'Draft',
  
  /** Publicado: Visible públicamente, abierto a inscripciones */
  Published = 'Published',
  
  /** Cancelado: Visible pero no permite inscripciones */
  Cancelled = 'Cancelled',
  
  /** Completado: El evento ya pasó */
  Completed = 'Completed'
}

/**
 * Estados de una inscripción a un evento.
 */
export enum RegistrationStatus {
  /** Pendiente: Esperando confirmación */
  Pending = 'Pending',
  
  /** Confirmada: Inscripción válida */
  Confirmed = 'Confirmed',
  
  /** Cancelada: El usuario canceló su inscripción */
  Cancelled = 'Cancelled',
  
  /** Asistió: El usuario asistió al evento */
  Attended = 'Attended',
  
  /** No asistió: El usuario no se presentó */
  NoShow = 'NoShow'
}

// -----------------------------------------------------------------------------
// INTERFACES PRINCIPALES
// -----------------------------------------------------------------------------

/**
 * Categoría de evento.
 * Permite clasificar eventos por tipo (conferencias, talleres, etc.)
 */
export interface Category {
  /** Identificador único */
  id: number
  
  /** Nombre de la categoría */
  name: string
  
  /** Color para identificar visualmente (hex) */
  color: string
  
  /** Icono de Material Design Icons */
  icon: string
  
  /** Descripción de la categoría */
  description?: string
}

/**
 * Interfaz principal del Evento.
 * Representa la entidad completa con todas sus relaciones.
 */
export interface Event {
  /** Identificador único */
  id: number
  
  /** Título del evento */
  title: string
  
  /** Descripción detallada */
  description: string
  
  /** Fecha y hora de inicio (ISO string) */
  startDate: string
  
  /** Fecha y hora de fin (ISO string) */
  endDate: string
  
  /** Capacidad máxima de asistentes */
  capacity: number
  
  /** Número actual de inscritos */
  registeredCount: number
  
  /** URL de la imagen del evento */
  imageUrl?: string
  
  /** Estado actual del evento */
  status: EventStatus
  
  /** ID de la ubicación */
  locationId: number
  
  /** Datos de la ubicación (cuando se incluye) */
  location?: LocationSummary
  
  /** ID del organizador */
  organizerId: number
  
  /** Datos del organizador (cuando se incluye) */
  organizer?: UserSummary
  
  /** ID de la categoría */
  categoryId: number
  
  /** Datos de la categoría (cuando se incluye) */
  category?: Category
  
  /** Fecha de creación */
  createdAt: string
  
  /** Fecha de última actualización */
  updatedAt?: string
}

/**
 * Evento simplificado para listados y cards.
 * Contiene solo la información necesaria para mostrar en listas.
 */
export interface EventSummary {
  id: number
  title: string
  description: string
  startDate: string
  endDate: string
  capacity: number
  registeredCount: number
  imageUrl?: string
  status: EventStatus
  location?: LocationSummary
  category?: Category
}

/**
 * Inscripción de un usuario a un evento.
 */
export interface Registration {
  /** Identificador único */
  id: number
  
  /** ID del usuario inscrito */
  userId: number
  
  /** Datos del usuario (cuando se incluye) */
  user?: UserSummary
  
  /** ID del evento */
  eventId: number
  
  /** Datos del evento (cuando se incluye) */
  event?: EventSummary
  
  /** Estado de la inscripción */
  status: RegistrationStatus
  
  /** Fecha de inscripción */
  registrationDate: string
  
  /** Notas adicionales del usuario */
  notes?: string
}

// -----------------------------------------------------------------------------
// DTOs DE CREACIÓN Y ACTUALIZACIÓN
// -----------------------------------------------------------------------------

/**
 * DTO para crear un nuevo evento.
 * Todos los campos requeridos para crear un evento.
 */
export interface CreateEventDto {
  /** Título del evento */
  title: string
  
  /** Descripción detallada */
  description: string
  
  /** Fecha y hora de inicio */
  startDate: string
  
  /** Fecha y hora de fin */
  endDate: string
  
  /** Capacidad máxima */
  capacity: number
  
  /** URL de la imagen (opcional) */
  imageUrl?: string
  
  /** ID de la ubicación */
  locationId: number
  
  /** ID de la categoría */
  categoryId: number
  
  /** Estado inicial (por defecto Draft) */
  status?: EventStatus
}

/**
 * DTO para actualizar un evento existente.
 * Solo los campos proporcionados serán actualizados.
 */
export interface UpdateEventDto {
  title?: string
  description?: string
  startDate?: string
  endDate?: string
  capacity?: number
  imageUrl?: string
  locationId?: number
  categoryId?: number
  status?: EventStatus
}

/**
 * DTO para registrarse a un evento.
 */
export interface CreateRegistrationDto {
  /** ID del evento */
  eventId: number
  
  /** Notas opcionales */
  notes?: string
}

/**
 * DTO para actualizar una inscripción.
 */
export interface UpdateRegistrationDto {
  /** Nuevo estado de la inscripción */
  status?: RegistrationStatus
  
  /** Notas actualizadas */
  notes?: string
}

// -----------------------------------------------------------------------------
// TIPOS PARA BÚSQUEDA Y FILTRADO
// -----------------------------------------------------------------------------

/**
 * Parámetros de búsqueda y filtrado de eventos.
 * Usado para el buscador avanzado con paginación.
 * IMPORTANTE: Los nombres de parámetros coinciden con lo que espera el backend.
 */
export interface EventSearchParams {
  /** Término de búsqueda (busca en título y descripción) */
  search?: string

  /** Filtrar por categoría */
  categoryId?: number

  /** Filtrar por ubicación */
  locationId?: number

  /** Filtrar por estado */
  status?: EventStatus | string

  /** Filtrar por fecha de inicio mínima (backend: startDate) */
  startDate?: string

  /** Filtrar por fecha de fin máxima (backend: endDate) */
  endDate?: string

  /** Filtrar por organizador */
  organizerId?: number

  /** Campo por el que ordenar */
  sortBy?: string

  /** Orden descendente (backend espera boolean) */
  sortDescending?: boolean

  /** Número de página (1-indexed) */
  page?: number

  /** Elementos por página */
  pageSize?: number
}

// -----------------------------------------------------------------------------
// TIPOS PARA EL DASHBOARD
// -----------------------------------------------------------------------------

/**
 * Estadísticas para el dashboard.
 */
export interface EventStats {
  /** Total de eventos */
  totalEvents: number
  
  /** Eventos activos (publicados y futuros) */
  activeEvents: number
  
  /** Total de inscripciones */
  totalRegistrations: number
  
  /** Tasa media de ocupación */
  averageOccupancy: number
  
  /** Eventos por categoría */
  eventsByCategory: CategoryCount[]
  
  /** Inscripciones por mes */
  registrationsByMonth: MonthCount[]
  
  /** Eventos por estado */
  eventsByStatus: StatusCount[]
}

/**
 * Conteo por categoría para gráficas.
 */
export interface CategoryCount {
  category: Category
  count: number
}

/**
 * Conteo por mes para gráficas.
 */
export interface MonthCount {
  month: string
  count: number
}

/**
 * Conteo por estado para gráficas.
 */
export interface StatusCount {
  status: EventStatus
  count: number
}
