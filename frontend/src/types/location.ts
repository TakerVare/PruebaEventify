






export interface Location {
  
  id: number
  
  
  name: string
  
  
  address: string
  
  
  capacity: number
  
  
  description?: string
  
  
  imageUrl?: string
  
  
  isActive: boolean
  
  
  createdAt: string
  
  
  updatedAt?: string
  
  
  latitude?: number
  longitude?: number
  
  
  contactEmail?: string
  contactPhone?: string
  
  
  amenities?: string[]
}


export interface LocationSummary {
  
  id: number
  
  
  name: string
  
  
  address: string
  
  
  capacity: number
  
  
  imageUrl?: string
  
  
  isActive: boolean
}






export interface CreateLocationDto {
  
  name: string
  
  
  address: string
  
  
  capacity: number
  
  
  description?: string
  
  
  imageUrl?: string
  
  
  latitude?: number
  longitude?: number
  
  
  contactEmail?: string
  contactPhone?: string
  
  
  amenities?: string[]
}


export interface UpdateLocationDto {
  
  name?: string
  
  
  address?: string
  
  
  capacity?: number
  
  
  description?: string
  
  
  imageUrl?: string
  
  
  isActive?: boolean
  
  
  latitude?: number
  longitude?: number
  
  
  contactEmail?: string
  contactPhone?: string
  
  
  amenities?: string[]
}






export interface LocationSearchParams {
  
  search?: string
  
  
  isActive?: boolean
  
  
  minCapacity?: number
  
  
  maxCapacity?: number
  
  
  sortBy?: 'name' | 'capacity' | 'createdAt'
  
  
  sortOrder?: 'asc' | 'desc'
  
  
  page?: number
  
  
  pageSize?: number
}






export interface LocationOption {
  
  value: number
  
  
  title: string
  
  
  subtitle: string
  
  
  capacity: number
  
  
  disabled: boolean
}
