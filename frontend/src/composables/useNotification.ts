

import { useUiStore } from '@/stores/ui'

export function useNotification() {
  const uiStore = useUiStore()

  
  function showSuccess(message: string, duration = 3000) {
    uiStore.showSuccess(message, duration)
  }

  
  function showError(message: string, duration = 5000) {
    uiStore.showError(message, duration)
  }

  
  function showWarning(message: string, duration = 4000) {
    uiStore.showWarning(message, duration)
  }

  
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
