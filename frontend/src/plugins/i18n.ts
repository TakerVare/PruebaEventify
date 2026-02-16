




import { createI18n } from 'vue-i18n'
import es from '@/i18n/es'
import en from '@/i18n/en'






export type MessageSchema = typeof es






const i18n = createI18n<[MessageSchema], 'es' | 'en'>({
  
  
  
  
  
  legacy: false,
  
  
  locale: 'es',
  
  
  fallbackLocale: 'en',
  
  
  silentTranslationWarn: import.meta.env.PROD,
  
  
  silentFallbackWarn: import.meta.env.PROD,
  
  
  missingWarn: import.meta.env.DEV,
  
  
  
  
  messages: {
    es,
    en
  },
  
  
  
  
  numberFormats: {
    es: {
      
      currency: {
        style: 'currency',
        currency: 'EUR',
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
    },
    en: {
      
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
  
  
  
  
  datetimeFormats: {
    es: {
      
      short: {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      },
      
      long: {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      },
      
      datetime: {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      },
      
      time: {
        hour: '2-digit',
        minute: '2-digit'
      },
      
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
      
      short: {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
      },
      
      long: {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      },
      
      datetime: {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      },
      
      time: {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      },
      
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


export default i18n
