

<script setup lang="ts">





import { onMounted, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useTheme } from 'vuetify'
import { useI18n } from 'vue-i18n'
import { useUiStore } from '@/stores/ui'
import ToastNotification from '@/components/common/ToastNotification.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'





const route = useRoute()
const theme = useTheme()
const { locale } = useI18n()
const uiStore = useUiStore()





const currentLayout = computed(() => {
  const layoutName = route.meta.layout || 'default'

  switch (layoutName) {
    case 'admin':
      return AdminLayout
    case 'auth':
      return AuthLayout
    case 'default':
    default:
      return DefaultLayout
  }
})





onMounted(() => {
  
  theme.global.name.value = uiStore.theme
  
  
  locale.value = uiStore.locale
  
  
  if (import.meta.env.DEV) {
    console.log('🎨 Tema aplicado:', uiStore.theme)
    console.log('🌐 Idioma aplicado:', uiStore.locale)
  }
})







watch(
  () => uiStore.theme,
  (newTheme) => {
    theme.global.name.value = newTheme
  }
)


watch(
  () => uiStore.locale,
  (newLocale) => {
    locale.value = newLocale
  }
)
</script>

<template>
  
  <v-app>
    
    <component :is="currentLayout">
      
    </component>

    
    <ToastNotification />
  </v-app>
</template>

<style lang="scss">





.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}


.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}


::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: rgb(var(--v-theme-surface));
}

::-webkit-scrollbar-thumb {
  background: rgb(var(--v-theme-primary));
  border-radius: 4px;
  
  &:hover {
    background: rgb(var(--v-theme-primary-darken-1));
  }
}




.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}


.no-select {
  user-select: none;
}
</style>
