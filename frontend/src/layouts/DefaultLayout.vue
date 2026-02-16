<!--
  =============================================================================
  DEFAULT LAYOUT - Layout para vistas públicas
  =============================================================================
  Layout utilizado en las páginas públicas de la aplicación:
  - Home
  - Lista de eventos
  - Detalle de evento
  - Perfil de usuario

  Incluye:
  - Header público con navegación
  - Contenido principal
  - Footer público
  =============================================================================
-->

<script setup lang="ts">
import { ref } from 'vue'
import PublicHeader from '@/components/common/PublicHeader.vue'
import PublicFooter from '@/components/common/PublicFooter.vue'

// Estado del drawer de navegación móvil
const drawer = ref(false)
</script>

<template>
  <div class="default-layout">
    <!--
      =========================================================================
      HEADER PÚBLICO
      =========================================================================
    -->
    <PublicHeader @toggle-drawer="drawer = !drawer" />

    <!--
      =========================================================================
      DRAWER DE NAVEGACIÓN MÓVIL
      =========================================================================
    -->
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

    <!--
      =========================================================================
      CONTENIDO PRINCIPAL
      =========================================================================
    -->
    <v-main>
      <!-- Contenedor con ancho máximo y padding -->
      <v-container fluid class="pa-0">
        <!-- RouterView renderiza el contenido de cada vista -->
        <router-view v-slot="{ Component, route }">
          <transition name="fade" mode="out-in">
            <component :is="Component" :key="route.path" />
          </transition>
        </router-view>
      </v-container>
    </v-main>

    <!--
      =========================================================================
      FOOTER PÚBLICO
      =========================================================================
    -->
    <PublicFooter />
  </div>
</template>

<style scoped lang="scss">
/**
 * Transición fade para cambios de vista
 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
