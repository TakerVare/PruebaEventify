

import type { UserSummary } from './user'
import type { LocationSummary } from './location'






export enum EventStatus {
  
  Draft = 'Draft',
  
  
  Published = 'Published',
  
  
  Cancelled = 'Cancelled',
  
  
  Completed = 'Completed'
}


export enum RegistrationStatus {
  
  Pending = 'Pending',
  
  
  Confirmed = 'Confirmed',
  
  
  Cancelled = 'Cancelled',
  
  
  Attended = 'Attended',
  
  
  NoShow = 'NoShow'
}






export interface Category {
  
  id: number
  
  
  name: string
  
  
  color: string
  
  
  icon: string
  
  
  description?: string
}


export interface Event {
  
  id: number
  
  
  title: string
  
  
  description: string
  
  
  startDate: string
  
  
  endDate: string
  
  
  capacity: number
  
  
  registeredCount: number
  
  
  imageUrl?: string
  
  
  status: EventStatus
  
  
  locationId: number
  
  
  location?: LocationSummary
  
  
  organizerId: number
  
  
  organizer?: UserSummary
  
  
  categoryId: number
  
  
  category?: Category
  
  
  createdAt: string
  
  
  updatedAt?: string
}


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


export interface Registration {
  
  id: number
  
  
  userId: number
  
  
  user?: UserSummary
  
  
  eventId: number
  
  
  event?: EventSummary
  
  
  status: RegistrationStatus
  
  
  registrationDate: string
  
  
  notes?: string
}






export interface CreateEventDto {
  
  title: string
  
  
  description: string
  
  
  startDate: string
  
  
  endDate: string
  
  
  capacity: number
  
  
  imageUrl?: string
  
  
  locationId: number
  
  
  categoryId: number
  
  
  status?: EventStatus
}


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


export interface CreateRegistrationDto {
  
  eventId: number
  
  
  notes?: string
}


export interface UpdateRegistrationDto {
  
  status?: RegistrationStatus
  
  
  notes?: string
}






export interface EventSearchParams {
  
  search?: string

  
  categoryId?: number

  
  locationId?: number

  
  status?: EventStatus | string

  
  startDate?: string

  
  endDate?: string

  
  organizerId?: number

  
  sortBy?: string

  
  sortDescending?: boolean

  
  page?: number

  
  pageSize?: number
}






export interface EventStats {
  
  totalEvents: number
  
  
  activeEvents: number
  
  
  totalRegistrations: number
  
  
  averageOccupancy: number
  
  
  eventsByCategory: CategoryCount[]
  
  
  registrationsByMonth: MonthCount[]
  
  
  eventsByStatus: StatusCount[]
}


export interface CategoryCount {
  category: Category
  count: number
}


export interface MonthCount {
  month: string
  count: number
}


export interface StatusCount {
  status: EventStatus
  count: number
}
