/**
 * =============================================================================
 * CONFIGURACIÓN DE VITE - Eventify Frontend
 * =============================================================================
 * Vite es el bundler/dev server que usamos para el proyecto Vue 3.
 * Esta configuración incluye:
 * - Plugin de Vue para SFC (.vue files)
 * - Plugin de Vuetify para carga optimizada de componentes
 * - Alias de rutas (@/ -> src/)
 * - Configuración del servidor de desarrollo
 * =============================================================================
 */

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  // ===========================================================================
  // PLUGINS
  // ===========================================================================
  plugins: [
    // Plugin de Vue 3 para soporte de Single File Components (.vue)
    vue(),

    // Plugin de Vuetify para auto-importar componentes
    // Usamos la opción más simple sin personalización de estilos
    vuetify()
  ],

  // ===========================================================================
  // ALIAS DE RUTAS
  // ===========================================================================
  // Permite usar @/ como alias para la carpeta src/
  // Ejemplo: import MyComponent from '@/components/MyComponent.vue'
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },

  // ===========================================================================
  // CONFIGURACIÓN DEL SERVIDOR DE DESARROLLO
  // ===========================================================================
  server: {
    // Puerto del servidor de desarrollo
    port: 5173,
    
    // Escuchar en todas las interfaces (necesario para Docker)
    host: true,
    
    // Abrir automáticamente el navegador al iniciar (desactivado en Docker)
    open: false,
    
    // Hot Module Replacement - Actualización en caliente sin recargar página
    hmr: {
      // Configuración específica para Docker
      host: 'localhost'
    },
    
    // Vigilar cambios en archivos (necesario para volúmenes Docker)
    watch: {
      usePolling: true
    }
  },

  // ===========================================================================
  // CONFIGURACIÓN DE BUILD (PRODUCCIÓN)
  // ===========================================================================
  build: {
    // Directorio de salida
    outDir: 'dist',
    
    // Generar sourcemaps para debugging en producción
    sourcemap: true,
    
    // Configuración de Rollup
    rollupOptions: {
      output: {
        // Separar vendors en chunks para mejor caching
        manualChunks: {
          // Agrupar Vue y sus dependencias core
          'vue-vendor': ['vue', 'vue-router', 'pinia'],
          // Agrupar Vuetify (es grande, mejor en chunk separado)
          'vuetify': ['vuetify'],
          // Agrupar librerías de utilidad
          'utils': ['axios', 'yup', 'vee-validate']
        }
      }
    }
  },

  // ===========================================================================
  // CONFIGURACIÓN CSS
  // ===========================================================================
  css: {
    // Preprocesador SASS
    preprocessorOptions: {
      scss: {
        // Nota: additionalData deshabilitado para evitar conflictos con Vuetify
        // Si necesitas variables globales, impórtalas manualmente en cada componente
        // additionalData: `@use "@/assets/styles/variables" as *;`
      }
    }
  },

  // ===========================================================================
  // OPTIMIZACIÓN DE DEPENDENCIAS
  // ===========================================================================
  optimizeDeps: {
    // Pre-bundlear estas dependencias para mejor rendimiento en desarrollo
    include: [
      'vue',
      'vue-router',
      'pinia',
      'vuetify',
      'axios',
      'yup',
      'vee-validate',
      'vue-i18n',
      'chart.js',
      'vue-chartjs'
    ]
  }
})
