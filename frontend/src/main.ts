/**
 * =============================================================================
 * MAIN.TS - Punto de entrada de la aplicación Eventify
 * =============================================================================
 * Este archivo configura e inicializa la aplicación Vue 3 con todos sus plugins:
 * - Vuetify 3 (UI Framework)
 * - Vue Router (Enrutamiento SPA)
 * - Pinia (Gestión de estado)
 * - Vue I18n (Internacionalización)
 * =============================================================================
 */

// -----------------------------------------------------------------------------
// IMPORTACIONES CORE
// -----------------------------------------------------------------------------
import { createApp } from 'vue'
import App from './App.vue'

// -----------------------------------------------------------------------------
// IMPORTACIONES DE PLUGINS
// -----------------------------------------------------------------------------
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import router from './router'
import vuetify from './plugins/vuetify'
import i18n from './plugins/i18n'

// -----------------------------------------------------------------------------
// IMPORTACIONES DE ESTILOS
// -----------------------------------------------------------------------------
// Estilos globales de la aplicación
import '@/assets/styles/main.scss'

// -----------------------------------------------------------------------------
// CREAR INSTANCIA DE LA APLICACIÓN
// -----------------------------------------------------------------------------
/**
 * Creamos la instancia principal de Vue 3.
 * App.vue es el componente raíz que contiene toda la aplicación.
 */
const app = createApp(App)

// -----------------------------------------------------------------------------
// CONFIGURAR PINIA (GESTIÓN DE ESTADO)
// -----------------------------------------------------------------------------
/**
 * Pinia es el store oficial de Vue 3, reemplaza a Vuex.
 * Ventajas:
 * - API más simple y TypeScript-friendly
 * - Soporte para Composition API
 * - DevTools integradas
 * - Modular por defecto
 * 
 * El plugin persistedstate permite persistir stores en localStorage
 */
const pinia = createPinia()

// Plugin para persistir estado en localStorage (útil para auth y preferencias)
pinia.use(piniaPluginPersistedstate)

// Registrar Pinia en la aplicación
app.use(pinia)

// -----------------------------------------------------------------------------
// CONFIGURAR VUE ROUTER (ENRUTAMIENTO)
// -----------------------------------------------------------------------------
/**
 * Vue Router maneja la navegación SPA (Single Page Application).
 * Configurado en ./router/index.ts con:
 * - Rutas públicas (home, detalle evento)
 * - Rutas de autenticación (login, registro)
 * - Rutas protegidas de administración
 * - Guards de navegación para control de acceso
 */
app.use(router)

// -----------------------------------------------------------------------------
// CONFIGURAR VUETIFY (UI FRAMEWORK)
// -----------------------------------------------------------------------------
/**
 * Vuetify 3 proporciona componentes Material Design pre-construidos.
 * Configurado en ./plugins/vuetify.ts con:
 * - Tema claro y oscuro
 * - Colores personalizados
 * - Iconos MDI
 */
app.use(vuetify)

// -----------------------------------------------------------------------------
// CONFIGURAR VUE I18N (INTERNACIONALIZACIÓN)
// -----------------------------------------------------------------------------
/**
 * Vue I18n permite traducir la aplicación a múltiples idiomas.
 * Configurado en ./plugins/i18n.ts con:
 * - Español (es) como idioma por defecto
 * - Inglés (en) como idioma alternativo
 */
app.use(i18n)

// -----------------------------------------------------------------------------
// CONFIGURACIÓN GLOBAL DE ERRORES
// -----------------------------------------------------------------------------
/**
 * Manejador global de errores no capturados en componentes Vue.
 * Útil para logging y debugging.
 */
app.config.errorHandler = (err, instance, info) => {
  // En desarrollo, mostrar errores en consola
  console.error('Error Vue:', err)
  console.error('Componente:', instance)
  console.error('Info:', info)
  
  // TODO: En producción, enviar a servicio de monitoreo (Sentry, etc.)
}

// -----------------------------------------------------------------------------
// CONFIGURACIÓN GLOBAL DE ADVERTENCIAS (solo desarrollo)
// -----------------------------------------------------------------------------
if (import.meta.env.DEV) {
  app.config.warnHandler = (msg, instance, trace) => {
    console.warn('Advertencia Vue:', msg)
    console.warn('Trace:', trace)
  }
}

// -----------------------------------------------------------------------------
// MONTAR LA APLICACIÓN
// -----------------------------------------------------------------------------
/**
 * Montamos la aplicación en el elemento #app del index.html.
 * A partir de este momento, Vue toma el control del DOM.
 */
app.mount('#app')

// -----------------------------------------------------------------------------
// LOG DE INICIALIZACIÓN (solo desarrollo)
// -----------------------------------------------------------------------------
if (import.meta.env.DEV) {
  console.log('🚀 Eventify iniciado correctamente')
  console.log('📦 Modo:', import.meta.env.MODE)
  console.log('🔗 API URL:', import.meta.env.VITE_API_URL)
}
