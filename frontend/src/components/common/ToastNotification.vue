<!--
  =============================================================================
  TOAST NOTIFICATION - Componente de notificaciones (Snackbar)
  =============================================================================
  Componente global que muestra notificaciones tipo snackbar.
  Se controla desde el store de UI usando useUiStore().

  Uso desde cualquier parte de la app:
  ```ts
  const uiStore = useUiStore()
  uiStore.showSuccess('¡Guardado correctamente!')
  uiStore.showError('Error al guardar')
  ```
  =============================================================================
-->

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useUiStore } from '@/stores/ui'

// -----------------------------------------------------------------------------
// STORE
// -----------------------------------------------------------------------------
const uiStore = useUiStore()

// -----------------------------------------------------------------------------
// ESTADO COMPUTADO
// -----------------------------------------------------------------------------

/**
 * Controla la visibilidad del snackbar
 */
const visible = computed({
  get: () => uiStore.isNotificationVisible,
  set: (value: boolean) => {
    if (!value) {
      uiStore.hideNotification()
    }
  }
})

/**
 * Notificación actual a mostrar
 */
const notification = computed(() => uiStore.currentNotification)

/**
 * Color del snackbar según el tipo de notificación
 */
const color = computed(() => {
  if (!notification.value) return 'info'

  switch (notification.value.type) {
    case 'success':
      return 'success'
    case 'error':
      return 'error'
    case 'warning':
      return 'warning'
    case 'info':
      return 'info'
    default:
      return 'info'
  }
})

/**
 * Icono según el tipo de notificación
 */
const icon = computed(() => {
  if (!notification.value) return 'mdi-information'

  switch (notification.value.type) {
    case 'success':
      return 'mdi-check-circle'
    case 'error':
      return 'mdi-alert-circle'
    case 'warning':
      return 'mdi-alert'
    case 'info':
      return 'mdi-information'
    default:
      return 'mdi-information'
  }
})

/**
 * Timeout del snackbar (0 = infinito, -1 = controlado manualmente)
 */
const timeout = computed(() => {
  if (!notification.value) return -1
  return notification.value.duration ?? 3000
})

/**
 * Indica si se muestra el botón de cerrar
 */
const closeable = computed(() => {
  return notification.value?.closeable ?? true
})

// -----------------------------------------------------------------------------
// MÉTODOS
// -----------------------------------------------------------------------------

/**
 * Cierra la notificación manualmente
 */
function close() {
  visible.value = false
}

// -----------------------------------------------------------------------------
// WATCHERS
// -----------------------------------------------------------------------------

/**
 * Log de notificaciones en desarrollo
 */
if (import.meta.env.DEV) {
  watch(notification, (newNotification) => {
    if (newNotification) {
      console.log(`[Notification ${newNotification.type}]:`, newNotification.message)
    }
  })
}
</script>

<template>
  <!--
    =========================================================================
    SNACKBAR DE VUETIFY
    =========================================================================
    Posicionado en la parte inferior derecha de la pantalla.
    Se muestra automáticamente cuando hay una notificación en el store.
    =========================================================================
  -->
  <v-snackbar
    v-model="visible"
    :color="color"
    :timeout="timeout"
    location="bottom right"
    :multi-line="notification?.message && notification.message.length > 50"
    :vertical="notification?.message && notification.message.length > 100"
    rounded="lg"
  >
    <!--
      =======================================================================
      CONTENIDO DE LA NOTIFICACIÓN
      =======================================================================
    -->
    <div class="d-flex align-center">
      <!-- Icono -->
      <v-icon
        :icon="icon"
        size="24"
        class="mr-3"
      />

      <!-- Mensaje -->
      <div class="flex-grow-1">
        {{ notification?.message }}
      </div>

      <!-- Botón de cerrar (si es closeable) -->
      <v-btn
        v-if="closeable"
        icon="mdi-close"
        size="small"
        variant="text"
        @click="close"
        class="ml-2"
        aria-label="Cerrar notificación"
      />
    </div>
  </v-snackbar>
</template>

<style scoped lang="scss">
/**
 * =============================================================================
 * ESTILOS DEL COMPONENTE
 * =============================================================================
 * Estilos minimalistas, la mayor parte viene de Vuetify.
 * =============================================================================
 */

// El mensaje debe ser legible
:deep(.v-snackbar__content) {
  font-size: 0.875rem;
  line-height: 1.5;
}

// Asegurar que el icono esté alineado verticalmente
:deep(.v-icon) {
  flex-shrink: 0;
}
</style>
