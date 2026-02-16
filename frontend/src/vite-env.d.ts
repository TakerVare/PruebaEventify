/**
 * =============================================================================
 * VITE-ENV.D.TS - Declaraciones de tipos para Vite
 * =============================================================================
 * Este archivo proporciona tipos TypeScript para las características
 * específicas de Vite como variables de entorno y módulos especiales.
 * =============================================================================
 */

/// <reference types="vite/client" />

/**
 * Declaración de tipos para variables de entorno de Vite.
 * Todas las variables deben comenzar con VITE_ para ser expuestas al cliente.
 */
interface ImportMetaEnv {
  /** URL base de la API del backend */
  readonly VITE_API_URL: string
  
  /** Modo de ejecución (development, production, test) */
  readonly MODE: string
  
  /** Si estamos en modo desarrollo */
  readonly DEV: boolean
  
  /** Si estamos en modo producción */
  readonly PROD: boolean
}

/**
 * Extensión de ImportMeta para incluir las variables de entorno
 */
interface ImportMeta {
  readonly env: ImportMetaEnv
}

/**
 * Declaración para importar archivos .vue como módulos
 * Permite que TypeScript entienda las importaciones de componentes Vue
 */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

/**
 * Declaración para importar archivos de imagen
 */
declare module '*.png' {
  const src: string
  export default src
}

declare module '*.jpg' {
  const src: string
  export default src
}

declare module '*.jpeg' {
  const src: string
  export default src
}

declare module '*.svg' {
  const src: string
  export default src
}

declare module '*.gif' {
  const src: string
  export default src
}

declare module '*.webp' {
  const src: string
  export default src
}
