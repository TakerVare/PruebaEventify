/**
 * =============================================================================
 * USE NOTIFICATION - Composable de notificaciones
 * =============================================================================
 * Composable que proporciona métodos para mostrar notificaciones de manera
 * sencilla desde cualquier componente.
 *
 * Uso:
 * ```ts
 * const { showSuccess, showError } = useNotification()
 * showSuccess('¡Operación exitosa!')
 * ```
 * =============================================================================
 */

import { useUiStore } from '@/stores/ui'

export function useNotification() {
  const uiStore = useUiStore()

  /**
   * Muestra una notificación de éxito
   * @param message - Mensaje a mostrar
   * @param duration - Duración en ms (por defecto 3000)
   */
  function showSuccess(message: string, duration = 3000) {
    uiStore.showSuccess(message, duration)
  }

  /**
   * Muestra una notificación de error
   * @param message - Mensaje a mostrar
   * @param duration - Duración en ms (por defecto 5000)
   */
  function showError(message: string, duration = 5000) {
    uiStore.showError(message, duration)
  }

  /**
   * Muestra una notificación de advertencia
   * @param message - Mensaje a mostrar
   * @param duration - Duración en ms (por defecto 4000)
   */
  function showWarning(message: string, duration = 4000) {
    uiStore.showWarning(message, duration)
  }

  /**
   * Muestra una notificación de información
   * @param message - Mensaje a mostrar
   * @param duration - Duración en ms (por defecto 3000)
   */
  function showInfo(message: string, duration = 3000) {
    uiStore.showInfo(message, duration)
  }

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo
  }
}
