/**
 * =============================================================================
 * STORE UI - Gestión del estado de la interfaz de usuario
 * =============================================================================
 * Este store maneja todo el estado relacionado con la UI:
 * - Tema (claro/oscuro)
 * - Idioma (español/inglés)
 * - Notificaciones (snackbars)
 * - Estados de carga global
 * - Estado de la barra lateral (drawer)
 * =============================================================================
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// -----------------------------------------------------------------------------
// TIPOS
// -----------------------------------------------------------------------------

/**
 * Tipo de notificación (determina el color)
 */
export type NotificationType = 'success' | 'error' | 'warning' | 'info'

/**
 * Interfaz de una notificación
 */
export interface Notification {
  /** Mensaje a mostrar */
  message: string

  /** Tipo de notificación */
  type: NotificationType

  /** Duración en ms (0 = infinito) */
  duration?: number

  /** Mostrar botón de cerrar */
  closeable?: boolean
}

/**
 * Tema de la aplicación
 */
export type Theme = 'light' | 'dark'

/**
 * Idioma de la aplicación
 */
export type Locale = 'es' | 'en'

// -----------------------------------------------------------------------------
// DEFINICIÓN DEL STORE
// -----------------------------------------------------------------------------

export const useUiStore = defineStore('ui', () => {
  // ===========================================================================
  // ESTADO
  // ===========================================================================

  /**
   * Tema actual de la aplicación
   */
  const theme = ref<Theme>('light')

  /**
   * Idioma actual de la aplicación
   */
  const locale = ref<Locale>('es')

  /**
   * Cola de notificaciones pendientes
   */
  const notifications = ref<Notification[]>([])

  /**
   * Notificación actualmente visible
   */
  const currentNotification = ref<Notification | null>(null)

  /**
   * Indica si hay una operación global en curso
   */
  const isLoading = ref(false)

  /**
   * Mensaje de carga global
   */
  const loadingMessage = ref('')

  /**
   * Estado del drawer de navegación (abierto/cerrado)
   */
  const drawerOpen = ref(false)

  /**
   * Indica si el drawer debe ser persistente (en pantallas grandes)
   */
  const drawerPersistent = ref(false)

  // ===========================================================================
  // GETTERS
  // ===========================================================================

  /**
   * Indica si hay notificaciones pendientes
   */
  const hasNotifications = computed(() => notifications.value.length > 0)

  /**
   * Indica si hay una notificación visible
   */
  const isNotificationVisible = computed(() => currentNotification.value !== null)

  /**
   * Indica si el tema es oscuro
   */
  const isDarkTheme = computed(() => theme.value === 'dark')

  /**
   * Indica si el idioma es español
   */
  const isSpanish = computed(() => locale.value === 'es')

  // ===========================================================================
  // ACCIONES - TEMA
  // ===========================================================================

  /**
   * Cambia el tema de la aplicación
   * @param newTheme - Nuevo tema a aplicar
   */
  function setTheme(newTheme: Theme) {
    theme.value = newTheme
  }

  /**
   * Alterna entre tema claro y oscuro
   */
  function toggleTheme() {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }

  // ===========================================================================
  // ACCIONES - IDIOMA
  // ===========================================================================

  /**
   * Cambia el idioma de la aplicación
   * @param newLocale - Nuevo idioma a aplicar
   */
  function setLocale(newLocale: Locale) {
    locale.value = newLocale
  }

  /**
   * Alterna entre español e inglés
   */
  function toggleLocale() {
    locale.value = locale.value === 'es' ? 'en' : 'es'
  }

  // ===========================================================================
  // ACCIONES - NOTIFICACIONES
  // ===========================================================================

  /**
   * Muestra una notificación
   * @param notification - Notificación a mostrar
   */
  function showNotification(notification: Notification) {
    // Añadir valores por defecto
    const fullNotification: Notification = {
      duration: 3000,
      closeable: true,
      ...notification
    }

    // Si hay una notificación visible, añadirla a la cola
    if (currentNotification.value) {
      notifications.value.push(fullNotification)
    } else {
      // Mostrar inmediatamente
      currentNotification.value = fullNotification

      // Auto-ocultar después de la duración especificada
      if (fullNotification.duration && fullNotification.duration > 0) {
        setTimeout(() => {
          hideNotification()
        }, fullNotification.duration)
      }
    }
  }

  /**
   * Oculta la notificación actual y muestra la siguiente en la cola
   */
  function hideNotification() {
    currentNotification.value = null

    // Si hay notificaciones pendientes, mostrar la siguiente
    if (notifications.value.length > 0) {
      const next = notifications.value.shift()!
      showNotification(next)
    }
  }

  /**
   * Muestra una notificación de éxito
   * @param message - Mensaje a mostrar
   * @param duration - Duración en ms
   */
  function showSuccess(message: string, duration = 3000) {
    showNotification({ message, type: 'success', duration })
  }

  /**
   * Muestra una notificación de error
   * @param message - Mensaje a mostrar
   * @param duration - Duración en ms (0 = infinito)
   */
  function showError(message: string, duration = 5000) {
    showNotification({ message, type: 'error', duration })
  }

  /**
   * Muestra una notificación de advertencia
   * @param message - Mensaje a mostrar
   * @param duration - Duración en ms
   */
  function showWarning(message: string, duration = 4000) {
    showNotification({ message, type: 'warning', duration })
  }

  /**
   * Muestra una notificación de información
   * @param message - Mensaje a mostrar
   * @param duration - Duración en ms
   */
  function showInfo(message: string, duration = 3000) {
    showNotification({ message, type: 'info', duration })
  }

  /**
   * Limpia todas las notificaciones (actual y cola)
   */
  function clearNotifications() {
    currentNotification.value = null
    notifications.value = []
  }

  // ===========================================================================
  // ACCIONES - CARGA GLOBAL
  // ===========================================================================

  /**
   * Inicia un estado de carga global
   * @param message - Mensaje de carga (opcional)
   */
  function startLoading(message = '') {
    isLoading.value = true
    loadingMessage.value = message
  }

  /**
   * Detiene el estado de carga global
   */
  function stopLoading() {
    isLoading.value = false
    loadingMessage.value = ''
  }

  // ===========================================================================
  // ACCIONES - DRAWER
  // ===========================================================================

  /**
   * Abre el drawer de navegación
   */
  function openDrawer() {
    drawerOpen.value = true
  }

  /**
   * Cierra el drawer de navegación
   */
  function closeDrawer() {
    drawerOpen.value = false
  }

  /**
   * Alterna el estado del drawer
   */
  function toggleDrawer() {
    drawerOpen.value = !drawerOpen.value
  }

  /**
   * Establece si el drawer debe ser persistente
   * @param persistent - True para hacer el drawer persistente
   */
  function setDrawerPersistent(persistent: boolean) {
    drawerPersistent.value = persistent
  }

  // ===========================================================================
  // RESET
  // ===========================================================================

  /**
   * Resetea el store a sus valores por defecto
   * (mantiene tema e idioma, pero limpia notificaciones y estados temporales)
   */
  function $reset() {
    notifications.value = []
    currentNotification.value = null
    isLoading.value = false
    loadingMessage.value = ''
    drawerOpen.value = false
  }

  // ===========================================================================
  // RETURN (API PÚBLICA DEL STORE)
  // ===========================================================================

  return {
    // Estado
    theme,
    locale,
    notifications,
    currentNotification,
    isLoading,
    loadingMessage,
    drawerOpen,
    drawerPersistent,

    // Getters
    hasNotifications,
    isNotificationVisible,
    isDarkTheme,
    isSpanish,

    // Acciones - Tema
    setTheme,
    toggleTheme,

    // Acciones - Idioma
    setLocale,
    toggleLocale,

    // Acciones - Notificaciones
    showNotification,
    hideNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    clearNotifications,

    // Acciones - Carga
    startLoading,
    stopLoading,

    // Acciones - Drawer
    openDrawer,
    closeDrawer,
    toggleDrawer,
    setDrawerPersistent,

    // Reset
    $reset
  }
}, {
  // ===========================================================================
  // PERSISTENCIA
  // ===========================================================================
  persist: {
    // Clave en localStorage
    key: 'eventify-ui',

    // Persistir solo tema e idioma (no notificaciones ni estados temporales)
    paths: ['theme', 'locale', 'drawerPersistent']
  }
})
