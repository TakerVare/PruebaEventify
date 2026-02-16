

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useUiStore } from '@/stores/ui'




const uiStore = useUiStore()






const visible = computed({
  get: () => uiStore.isNotificationVisible,
  set: (value: boolean) => {
    if (!value) {
      uiStore.hideNotification()
    }
  }
})


const notification = computed(() => uiStore.currentNotification)


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


const timeout = computed(() => {
  if (!notification.value) return -1
  return notification.value.duration ?? 3000
})


const closeable = computed(() => {
  return notification.value?.closeable ?? true
})






function close() {
  visible.value = false
}






if (import.meta.env.DEV) {
  watch(notification, (newNotification) => {
    if (newNotification) {
      console.log(`[Notification ${newNotification.type}]:`, newNotification.message)
    }
  })
}
</script>

<template>
  
  <v-snackbar
    v-model="visible"
    :color="color"
    :timeout="timeout"
    location="bottom right"
    :multi-line="notification?.message && notification.message.length > 50"
    :vertical="notification?.message && notification.message.length > 100"
    rounded="lg"
  >
    
    <div class="d-flex align-center">
      
      <v-icon
        :icon="icon"
        size="24"
        class="mr-3"
      />

      
      <div class="flex-grow-1">
        {{ notification?.message }}
      </div>

      
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



:deep(.v-snackbar__content) {
  font-size: 0.875rem;
  line-height: 1.5;
}


:deep(.v-icon) {
  flex-shrink: 0;
}
</style>
