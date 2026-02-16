

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'






export type NotificationType = 'success' | 'error' | 'warning' | 'info'


export interface Notification {
  
  message: string

  
  type: NotificationType

  
  duration?: number

  
  closeable?: boolean
}


export type Theme = 'light' | 'dark'


export type Locale = 'es' | 'en'





export const useUiStore = defineStore('ui', () => {
  
  
  

  
  const theme = ref<Theme>('light')

  
  const locale = ref<Locale>('es')

  
  const notifications = ref<Notification[]>([])

  
  const currentNotification = ref<Notification | null>(null)

  
  const isLoading = ref(false)

  
  const loadingMessage = ref('')

  
  const drawerOpen = ref(false)

  
  const drawerPersistent = ref(false)

  
  
  

  
  const hasNotifications = computed(() => notifications.value.length > 0)

  
  const isNotificationVisible = computed(() => currentNotification.value !== null)

  
  const isDarkTheme = computed(() => theme.value === 'dark')

  
  const isSpanish = computed(() => locale.value === 'es')

  
  
  

  
  function setTheme(newTheme: Theme) {
    theme.value = newTheme
  }

  
  function toggleTheme() {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }

  
  
  

  
  function setLocale(newLocale: Locale) {
    locale.value = newLocale
  }

  
  function toggleLocale() {
    locale.value = locale.value === 'es' ? 'en' : 'es'
  }

  
  
  

  
  function showNotification(notification: Notification) {
    
    const fullNotification: Notification = {
      duration: 3000,
      closeable: true,
      ...notification
    }

    
    if (currentNotification.value) {
      notifications.value.push(fullNotification)
    } else {
      
      currentNotification.value = fullNotification

      
      if (fullNotification.duration && fullNotification.duration > 0) {
        setTimeout(() => {
          hideNotification()
        }, fullNotification.duration)
      }
    }
  }

  
  function hideNotification() {
    currentNotification.value = null

    
    if (notifications.value.length > 0) {
      const next = notifications.value.shift()!
      showNotification(next)
    }
  }

  
  function showSuccess(message: string, duration = 3000) {
    showNotification({ message, type: 'success', duration })
  }

  
  function showError(message: string, duration = 5000) {
    showNotification({ message, type: 'error', duration })
  }

  
  function showWarning(message: string, duration = 4000) {
    showNotification({ message, type: 'warning', duration })
  }

  
  function showInfo(message: string, duration = 3000) {
    showNotification({ message, type: 'info', duration })
  }

  
  function clearNotifications() {
    currentNotification.value = null
    notifications.value = []
  }

  
  
  

  
  function startLoading(message = '') {
    isLoading.value = true
    loadingMessage.value = message
  }

  
  function stopLoading() {
    isLoading.value = false
    loadingMessage.value = ''
  }

  
  
  

  
  function openDrawer() {
    drawerOpen.value = true
  }

  
  function closeDrawer() {
    drawerOpen.value = false
  }

  
  function toggleDrawer() {
    drawerOpen.value = !drawerOpen.value
  }

  
  function setDrawerPersistent(persistent: boolean) {
    drawerPersistent.value = persistent
  }

  
  
  

  
  function $reset() {
    notifications.value = []
    currentNotification.value = null
    isLoading.value = false
    loadingMessage.value = ''
    drawerOpen.value = false
  }

  
  
  

  return {
    
    theme,
    locale,
    notifications,
    currentNotification,
    isLoading,
    loadingMessage,
    drawerOpen,
    drawerPersistent,

    
    hasNotifications,
    isNotificationVisible,
    isDarkTheme,
    isSpanish,

    
    setTheme,
    toggleTheme,

    
    setLocale,
    toggleLocale,

    
    showNotification,
    hideNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    clearNotifications,

    
    startLoading,
    stopLoading,

    
    openDrawer,
    closeDrawer,
    toggleDrawer,
    setDrawerPersistent,

    
    $reset
  }
}, {
  
  
  
  persist: {
    
    key: 'eventify-ui',

    
    paths: ['theme', 'locale', 'drawerPersistent']
  }
})
