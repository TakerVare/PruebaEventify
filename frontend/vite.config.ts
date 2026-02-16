

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  
  
  
  plugins: [
    
    vue(),

    
    
    vuetify()
  ],

  
  
  
  
  
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },

  
  
  
  server: {
    
    port: 5173,
    
    
    host: true,
    
    
    open: false,
    
    
    hmr: {
      
      host: 'localhost'
    },
    
    
    watch: {
      usePolling: true
    }
  },

  
  
  
  build: {
    
    outDir: 'dist',
    
    
    sourcemap: true,
    
    
    rollupOptions: {
      output: {
        
        manualChunks: {
          
          'vue-vendor': ['vue', 'vue-router', 'pinia'],
          
          'vuetify': ['vuetify'],
          
          'utils': ['axios', 'yup', 'vee-validate']
        }
      }
    }
  },

  
  
  
  css: {
    
    preprocessorOptions: {
      scss: {
        
        
        
      }
    }
  },

  
  
  
  optimizeDeps: {
    
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
