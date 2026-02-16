<!--
  =============================================================================
  AUTH LAYOUT - Layout para autenticación
  =============================================================================
  Layout minimalista para páginas de autenticación:
  - Login
  - Registro
  - Recuperación de contraseña

  Características:
  - Sin header ni footer
  - Fondo con gradiente
  - Card centrado
  - Selector de idioma y tema
  =============================================================================
-->

<script setup lang="ts">
import { useUiStore } from '@/stores/ui'

const uiStore = useUiStore()
</script>

<template>
  <div class="auth-layout">
    <!--
      =========================================================================
      CONTENIDO PRINCIPAL
      =========================================================================
    -->
    <v-main>
      <!-- Fondo con gradiente -->
      <v-container
        fluid
        class="auth-container fill-height"
      >
        <v-row
          align="center"
          justify="center"
          class="fill-height"
        >
          <v-col
            cols="12"
            sm="8"
            md="6"
            lg="5"
            xl="4"
          >
            <!-- Controles de tema e idioma -->
            <div class="d-flex justify-end mb-4 ga-2">
              <!-- Selector de idioma -->
              <v-btn
                icon
                variant="text"
                @click="uiStore.toggleLocale()"
              >
                <v-icon>
                  {{ uiStore.locale === 'es' ? 'mdi-translate' : 'mdi-web' }}
                </v-icon>
                <v-tooltip activator="parent" location="bottom">
                  {{ uiStore.locale === 'es' ? 'English' : 'Español' }}
                </v-tooltip>
              </v-btn>

              <!-- Selector de tema -->
              <v-btn
                icon
                variant="text"
                @click="uiStore.toggleTheme()"
              >
                <v-icon>
                  {{ uiStore.isDarkTheme ? 'mdi-weather-sunny' : 'mdi-weather-night' }}
                </v-icon>
                <v-tooltip activator="parent" location="bottom">
                  {{ uiStore.isDarkTheme ? 'Modo Claro' : 'Modo Oscuro' }}
                </v-tooltip>
              </v-btn>
            </div>

            <!-- Card principal con el contenido -->
            <v-card
              class="auth-card"
              elevation="8"
              rounded="lg"
            >
              <!-- Logo de la aplicación -->
              <v-card-title class="text-center pt-8 pb-4">
                <v-avatar
                  color="primary"
                  size="80"
                  class="mb-4"
                >
                  <v-icon size="48" color="white">mdi-calendar-star</v-icon>
                </v-avatar>
                <div class="text-h4 font-weight-bold text-primary">
                  Eventify
                </div>
                <div class="text-subtitle-1 text-medium-emphasis">
                  Gestión de Eventos
                </div>
              </v-card-title>

              <v-card-text class="px-8 py-6">
                <!-- Contenido de la vista (Login o Register) -->
                <router-view v-slot="{ Component, route }">
                  <transition name="fade" mode="out-in">
                    <component :is="Component" :key="route.path" />
                  </transition>
                </router-view>
              </v-card-text>
            </v-card>

            <!-- Footer mínimo -->
            <div class="text-center mt-4 text-caption text-medium-emphasis">
              <p>&copy; {{ new Date().getFullYear() }} Eventify. Todos los derechos reservados.</p>
              <p>
                <a href="#" class="text-decoration-none">Términos</a>
                •
                <a href="#" class="text-decoration-none">Privacidad</a>
                •
                <a href="#" class="text-decoration-none">Contacto</a>
              </p>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </div>
</template>

<style scoped lang="scss">
/**
 * Contenedor de autenticación con fondo
 */
.auth-container {
  min-height: 100vh;
  background: linear-gradient(
    135deg,
    rgb(var(--v-theme-primary)) 0%,
    rgb(var(--v-theme-secondary)) 100%
  );

  // En tema oscuro, ajustar opacidad
  :deep(.v-theme--dark) & {
    background: linear-gradient(
      135deg,
      rgba(var(--v-theme-primary), 0.8) 0%,
      rgba(var(--v-theme-secondary), 0.8) 100%
    );
  }
}

/**
 * Card de autenticación
 */
.auth-card {
  backdrop-filter: blur(10px);
  background: rgba(var(--v-theme-surface), 0.95) !important;
}

/**
 * Transición fade
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
