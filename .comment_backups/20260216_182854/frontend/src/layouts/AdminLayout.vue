<!--
  =============================================================================
  ADMIN LAYOUT - Layout para panel de administración
  =============================================================================
  Layout utilizado en las páginas de administración:
  - Dashboard
  - Gestión de eventos
  - Gestión de ubicaciones
  - Gestión de usuarios

  Incluye:
  - App bar de administración
  - Navigation drawer con menú
  - Contenido principal con breadcrumbs
  =============================================================================
-->

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useDisplay } from 'vuetify'
import { useAuthStore } from '@/stores/auth'
import { useUiStore } from '@/stores/ui'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const uiStore = useUiStore()
const { mobile } = useDisplay()

// Estado del drawer (sincronizado con el store)
const drawer = computed({
  get: () => uiStore.drawerOpen,
  set: (value) => {
    if (value) {
      uiStore.openDrawer()
    } else {
      uiStore.closeDrawer()
    }
  }
})

// Inicializar drawer según el tamaño de pantalla
if (!mobile.value) {
  uiStore.openDrawer()
  uiStore.setDrawerPersistent(true)
} else {
  uiStore.setDrawerPersistent(false)
}

// Items del menú de navegación
const menuItems = computed(() => {
  const items = [
    {
      title: 'Dashboard',
      icon: 'mdi-view-dashboard',
      to: '/admin/dashboard',
      roles: ['Admin', 'Organizer']
    },
    {
      title: 'Eventos',
      icon: 'mdi-calendar',
      to: '/admin/events',
      roles: ['Admin', 'Organizer']
    },
    {
      title: 'Ubicaciones',
      icon: 'mdi-map-marker',
      to: '/admin/locations',
      roles: ['Admin']
    },
    {
      title: 'Usuarios',
      icon: 'mdi-account-group',
      to: '/admin/users',
      roles: ['Admin']
    }
  ]

  // Filtrar items según el rol del usuario
  return items.filter(item => {
    return authStore.hasAnyRole(item.roles as any)
  })
})

// Función para cerrar sesión
async function handleLogout() {
  await authStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="admin-layout">
    <!--
      =========================================================================
      APP BAR DE ADMINISTRACIÓN
      =========================================================================
    -->
    <v-app-bar
      color="primary"
      prominent
      elevate-on-scroll
    >
      <!-- Botón de menú -->
      <v-app-bar-nav-icon @click="drawer = !drawer" />

      <!-- Título -->
      <v-app-bar-title>
        <span class="text-h6 font-weight-bold">Eventify Admin</span>
      </v-app-bar-title>

      <v-spacer />

      <!-- Selector de idioma -->
      <v-btn
        icon
        @click="uiStore.toggleLocale()"
      >
        <v-icon>{{ uiStore.locale === 'es' ? 'mdi-flag-variant' : 'mdi-flag-variant-outline' }}</v-icon>
      </v-btn>

      <!-- Selector de tema -->
      <v-btn
        icon
        @click="uiStore.toggleTheme()"
      >
        <v-icon>{{ uiStore.isDarkTheme ? 'mdi-weather-sunny' : 'mdi-weather-night' }}</v-icon>
      </v-btn>

      <!-- Menú de usuario -->
      <v-menu>
        <template #activator="{ props }">
          <v-btn
            icon
            v-bind="props"
          >
            <v-avatar color="secondary" size="36">
              <span class="text-caption">{{ authStore.userInitials }}</span>
            </v-avatar>
          </v-btn>
        </template>

        <v-list>
          <v-list-item>
            <v-list-item-title class="text-subtitle-2">
              {{ authStore.fullName }}
            </v-list-item-title>
            <v-list-item-subtitle class="text-caption">
              {{ authStore.user?.email }}
            </v-list-item-subtitle>
          </v-list-item>

          <v-divider />

          <v-list-item
            prepend-icon="mdi-account"
            title="Mi Perfil"
            @click="router.push('/profile')"
          />

          <v-list-item
            prepend-icon="mdi-web"
            title="Ver sitio público"
            @click="router.push('/')"
          />

          <v-divider />

          <v-list-item
            prepend-icon="mdi-logout"
            title="Cerrar Sesión"
            @click="handleLogout"
          />
        </v-list>
      </v-menu>
    </v-app-bar>

    <!--
      =========================================================================
      NAVIGATION DRAWER
      =========================================================================
    -->
    <v-navigation-drawer
      v-model="drawer"
      :permanent="!mobile && uiStore.drawerPersistent"
      :temporary="mobile"
    >
      <!-- Logo y título -->
      <v-list>
        <v-list-item
          class="px-2"
          prepend-avatar="https://ui-avatars.com/api/?name=Eventify&background=1976D2&color=fff"
        >
          <v-list-item-title class="text-h6">
            Eventify
          </v-list-item-title>
          <v-list-item-subtitle>
            Panel de Control
          </v-list-item-subtitle>
        </v-list-item>
      </v-list>

      <v-divider />

      <!-- Menú de navegación -->
      <v-list density="comfortable" nav>
        <v-list-item
          v-for="item in menuItems"
          :key="item.to"
          :prepend-icon="item.icon"
          :title="item.title"
          :to="item.to"
          :active="route.path.startsWith(item.to)"
          rounded="lg"
        />
      </v-list>
    </v-navigation-drawer>

    <!--
      =========================================================================
      CONTENIDO PRINCIPAL
      =========================================================================
    -->
    <v-main>
      <v-container fluid>
        <!-- Breadcrumbs -->
        <v-breadcrumbs
          class="px-0 pt-2"
          :items="[
            { title: 'Inicio', disabled: false, href: '/' },
            { title: route.meta.title || 'Admin', disabled: true }
          ]"
        />

        <!-- Contenido de la vista -->
        <router-view v-slot="{ Component, route: viewRoute }">
          <transition name="fade" mode="out-in">
            <component :is="Component" :key="viewRoute.path" />
          </transition>
        </router-view>
      </v-container>
    </v-main>
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
