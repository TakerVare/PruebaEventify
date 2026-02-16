




import { createApp } from 'vue'
import App from './App.vue'




import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import router from './router'
import vuetify from './plugins/vuetify'
import i18n from './plugins/i18n'





import '@/assets/styles/main.scss'





const app = createApp(App)





const pinia = createPinia()


pinia.use(piniaPluginPersistedstate)


app.use(pinia)





app.use(router)





app.use(vuetify)





app.use(i18n)





app.config.errorHandler = (err, instance, info) => {
  
  console.error('Error Vue:', err)
  console.error('Componente:', instance)
  console.error('Info:', info)
  
  
}




if (import.meta.env.DEV) {
  app.config.warnHandler = (msg, instance, trace) => {
    console.warn('Advertencia Vue:', msg)
    console.warn('Trace:', trace)
  }
}





app.mount('#app')




if (import.meta.env.DEV) {
  console.log('🚀 Eventify iniciado correctamente')
  console.log('📦 Modo:', import.meta.env.MODE)
  console.log('🔗 API URL:', import.meta.env.VITE_API_URL)
}
