<!--
  =============================================================================
  APP.VUE - Componente Raíz de Eventify
  =============================================================================
  Este es el componente principal que envuelve toda la aplicación.
  Su responsabilidad es mínima: renderizar las rutas y proporcionar
  el contenedor principal para los layouts.
  
  La lógica de layouts (header, footer, etc.) se maneja en los
  componentes de layout específicos (DefaultLayout, AdminLayout, AuthLayout).
  =============================================================================
-->

<script setup lang="ts">
/**
 * =============================================================================
 * SCRIPT SETUP - Composition API
 * =============================================================================
 * Usamos <script setup> que es la sintaxis recomendada de Vue 3.
 * Ventajas:
 * - Menos boilerplate
 * - Mejor inferencia de tipos con TypeScript
 * - Variables y funciones disponibles directamente en el template
 * =============================================================================
 */

// -----------------------------------------------------------------------------
// IMPORTACIONES
// -----------------------------------------------------------------------------
import { onMounted, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useTheme } from 'vuetify'
import { useI18n } from 'vue-i18n'
import { useUiStore } from '@/stores/ui'
import ToastNotification from '@/components/common/ToastNotification.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'

// -----------------------------------------------------------------------------
// COMPOSABLES Y STORES
// -----------------------------------------------------------------------------
/**
 * useRoute: Para acceder a la ruta actual y su meta
 * useTheme: Hook de Vuetify para cambiar entre tema claro/oscuro
 * useI18n: Hook de Vue I18n para cambiar el idioma
 * useUiStore: Store de Pinia para estado de UI (tema, idioma, notificaciones)
 */
const route = useRoute()
const theme = useTheme()
const { locale } = useI18n()
const uiStore = useUiStore()

// -----------------------------------------------------------------------------
// LAYOUT DINÁMICO
// -----------------------------------------------------------------------------
/**
 * Determina qué layout usar según la meta de la ruta actual
 */
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

// -----------------------------------------------------------------------------
// INICIALIZACIÓN AL MONTAR
// -----------------------------------------------------------------------------
/**
 * Al montar la aplicación, restauramos las preferencias del usuario
 * guardadas en localStorage (a través de Pinia persistedstate).
 */
onMounted(() => {
  // Aplicar tema guardado (claro/oscuro)
  theme.global.name.value = uiStore.theme
  
  // Aplicar idioma guardado
  locale.value = uiStore.locale
  
  // Log de inicialización en desarrollo
  if (import.meta.env.DEV) {
    console.log('🎨 Tema aplicado:', uiStore.theme)
    console.log('🌐 Idioma aplicado:', uiStore.locale)
  }
})

// -----------------------------------------------------------------------------
// WATCHERS - Sincronizar cambios de tema e idioma
// -----------------------------------------------------------------------------
/**
 * Observamos cambios en el store de UI para sincronizar
 * con Vuetify y Vue I18n en tiempo real.
 */

// Sincronizar tema con Vuetify cuando cambie en el store
watch(
  () => uiStore.theme,
  (newTheme) => {
    theme.global.name.value = newTheme
  }
)

// Sincronizar idioma con Vue I18n cuando cambie en el store
watch(
  () => uiStore.locale,
  (newLocale) => {
    locale.value = newLocale
  }
)
</script>

<template>
  <!--
    ===========================================================================
    CONTENEDOR PRINCIPAL DE VUETIFY
    ===========================================================================
    v-app es el contenedor raíz requerido por Vuetify.
    Proporciona:
    - Estilos base de Material Design
    - Contexto para temas
    - Contenedor para overlays (diálogos, snackbars, etc.)
    ===========================================================================
  -->
  <v-app>
    <!--
      ===========================================================================
      LAYOUT DINÁMICO
      ===========================================================================
      El layout se carga dinámicamente según route.meta.layout.
      Cada layout envuelve el contenido de la ruta con su propia estructura
      (header, footer, sidebar, etc.).
      ===========================================================================
    -->
    <component :is="currentLayout">
      <!--
        El contenido de la ruta se pasa al layout a través del default slot.
        El layout se encarga de renderizarlo en el lugar apropiado.
      -->
    </component>

    <!--
      ===========================================================================
      COMPONENTE DE NOTIFICACIONES (TOAST)
      ===========================================================================
      Componente global para mostrar notificaciones tipo snackbar.
      Se controla desde el store de UI (uiStore.showNotification()).
      Se renderiza fuera del layout para que esté siempre visible.
      ===========================================================================
    -->
    <ToastNotification />
  </v-app>
</template>

<style lang="scss">
/**
 * =============================================================================
 * ESTILOS GLOBALES DE LA APLICACIÓN
 * =============================================================================
 * Estos estilos se aplican a toda la aplicación.
 * Los estilos específicos de componentes van en sus respectivos archivos.
 * =============================================================================
 */

/* ---------------------------------------------------------------------------
 * TRANSICIONES DE PÁGINA
 * ---------------------------------------------------------------------------
 * Animación fade para las transiciones entre rutas.
 * Proporciona una experiencia más suave al navegar.
 * --------------------------------------------------------------------------- */

// Animación de entrada y salida
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

// Estado inicial (entrando) y final (saliendo)
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* ---------------------------------------------------------------------------
 * SCROLLBAR PERSONALIZADA (solo Webkit/Chrome/Safari)
 * ---------------------------------------------------------------------------
 * Estiliza la barra de scroll para que coincida con el tema.
 * --------------------------------------------------------------------------- */
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

/* ---------------------------------------------------------------------------
 * UTILIDADES GLOBALES
 * --------------------------------------------------------------------------- */

// Clase para ocultar elementos visualmente pero mantenerlos accesibles
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

// Clase para deshabilitar selección de texto
.no-select {
  user-select: none;
}
</style>
