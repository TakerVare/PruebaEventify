

<script setup lang="ts">
import { ref } from 'vue'
import PublicHeader from '@/components/common/PublicHeader.vue'
import PublicFooter from '@/components/common/PublicFooter.vue'


const drawer = ref(false)
</script>

<template>
  <div class="default-layout">
    
    <PublicHeader @toggle-drawer="drawer = !drawer" />

    
    <v-navigation-drawer
      v-model="drawer"
      temporary
      location="left"
      width="280"
    >
      <v-list>
        <v-list-item
          prepend-icon="mdi-home"
          title="Inicio"
          to="/"
        />
        <v-list-item
          prepend-icon="mdi-calendar"
          title="Eventos"
          to="/events"
        />
        <v-list-item
          prepend-icon="mdi-account"
          title="Mi Perfil"
          to="/profile"
        />
        <v-list-item
          prepend-icon="mdi-ticket"
          title="Mis Inscripciones"
          to="/my-registrations"
        />
      </v-list>
    </v-navigation-drawer>

    
    <v-main>
      
      <v-container fluid class="pa-0">
        
        <router-view v-slot="{ Component, route }">
          <transition name="fade" mode="out-in">
            <component :is="Component" :key="route.path" />
          </transition>
        </router-view>
      </v-container>
    </v-main>

    
    <PublicFooter />
  </div>
</template>

<style scoped lang="scss">

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
