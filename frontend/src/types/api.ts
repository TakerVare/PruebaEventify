






export interface ApiResponse<T> {
  
  data: T
  
  
  message?: string
  
  
  success: boolean
}


export interface PaginatedResponse<T> {
  
  items: T[]
  
  
  page: number
  
  
  pageSize: number
  
  
  totalCount: number
  
  
  totalPages: number
  
  
  hasPreviousPage: boolean
  
  
  hasNextPage: boolean
}






export interface ApiError {
  
  statusCode: number
  
  
  message: string
  
  
  errors?: Record<string, string[]>
  
  
  traceId?: string
}


export interface ValidationError {
  
  field: string
  
  
  messages: string[]
}






export interface PaginationParams {
  
  page?: number
  
  
  pageSize?: number
}


export interface SortParams {
  
  sortBy?: string
  
  
  sortOrder?: 'asc' | 'desc'
}


export interface SearchParams extends PaginationParams, SortParams {
  
  search?: string
}






export interface RequestState {
  
  loading: boolean
  
  
  error: string | null
}


export interface EntityState<T> extends RequestState {
  
  data: T | null
}


export interface ListState<T> extends RequestState {
  
  items: T[]
  
  
  pagination: {
    page: number
    pageSize: number
    totalCount: number
    totalPages: number
  }
}






export type QueryParams = Record<string, string | number | boolean | undefined>


export interface SortOption {
  
  key: string
  
  
  order: 'asc' | 'desc'
}


export interface FilterOption<T = string | number> {
  
  value: T
  
  
  label: string
  
  
  icon?: string
  
  
  color?: string
}
