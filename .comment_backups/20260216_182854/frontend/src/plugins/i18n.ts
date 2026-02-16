/**
 * =============================================================================
 * PLUGINS/I18N.TS - Configuración de Vue I18n
 * =============================================================================
 * Este archivo configura Vue I18n para internacionalización de la aplicación.
 * Idiomas soportados:
 * - Español (es) - Idioma por defecto
 * - Inglés (en)
 * =============================================================================
 */

// -----------------------------------------------------------------------------
// IMPORTACIONES
// -----------------------------------------------------------------------------
import { createI18n } from 'vue-i18n'
import es from '@/i18n/es'
import en from '@/i18n/en'

// -----------------------------------------------------------------------------
// TIPO PARA MENSAJES
// -----------------------------------------------------------------------------

/**
 * Tipo que representa la estructura de mensajes de traducción.
 * Ayuda a mantener consistencia entre idiomas.
 */
export type MessageSchema = typeof es

// -----------------------------------------------------------------------------
// CREAR INSTANCIA DE I18N
// -----------------------------------------------------------------------------

/**
 * Crea y exporta la instancia de Vue I18n configurada.
 */
const i18n = createI18n<[MessageSchema], 'es' | 'en'>({
  // ===========================================================================
  // CONFIGURACIÓN GENERAL
  // ===========================================================================
  
  // Usar Composition API (recomendado para Vue 3)
  legacy: false,
  
  // Idioma por defecto
  locale: 'es',
  
  // Idioma de respaldo si falta una traducción
  fallbackLocale: 'en',
  
  // Silenciar advertencias de traducciones faltantes en producción
  silentTranslationWarn: import.meta.env.PROD,
  
  // Silenciar advertencias de fallback en producción
  silentFallbackWarn: import.meta.env.PROD,
  
  // Permitir que las claves actúen como mensaje si no hay traducción
  missingWarn: import.meta.env.DEV,
  
  // ===========================================================================
  // MENSAJES DE TRADUCCIÓN
  // ===========================================================================
  messages: {
    es,
    en
  },
  
  // ===========================================================================
  // FORMATO DE NÚMEROS
  // ===========================================================================
  numberFormats: {
    es: {
      // Formato de moneda (España)
      currency: {
        style: 'currency',
        currency: 'EUR',
        currencyDisplay: 'symbol'
      },
      // Formato decimal
      decimal: {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      },
      // Formato de porcentaje
      percent: {
        style: 'percent',
        minimumFractionDigits: 0,
        maximumFractionDigits: 1
      }
    },
    en: {
      // Formato de moneda (US)
      currency: {
        style: 'currency',
        currency: 'USD',
        currencyDisplay: 'symbol'
      },
      decimal: {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      },
      percent: {
        style: 'percent',
        minimumFractionDigits: 0,
        maximumFractionDigits: 1
      }
    }
  },
  
  // ===========================================================================
  // FORMATO DE FECHAS
  // ===========================================================================
  datetimeFormats: {
    es: {
      // Fecha corta: 14/02/2024
      short: {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      },
      // Fecha larga: 14 de febrero de 2024
      long: {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      },
      // Fecha con hora: 14/02/2024 18:30
      datetime: {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      },
      // Solo hora: 18:30
      time: {
        hour: '2-digit',
        minute: '2-digit'
      },
      // Fecha completa con día de la semana
      full: {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }
    },
    en: {
      // Fecha corta: 02/14/2024
      short: {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
      },
      // Fecha larga: February 14, 2024
      long: {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      },
      // Fecha con hora
      datetime: {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      },
      // Solo hora con AM/PM
      time: {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      },
      // Fecha completa
      full: {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }
    }
  }
})

// Exportar la instancia de i18n
export default i18n
