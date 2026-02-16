<!--
  =============================================================================
  UNAUTHORIZED VIEW - Página 403 (Sin autorización)
  =============================================================================
  Vista mostrada cuando el usuario intenta acceder a una ruta sin permisos.
  =============================================================================
-->

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const { t } = useI18n()
const authStore = useAuthStore()
</script>

<template>
  <v-container class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6" class="text-center">
        <!-- Icono grande -->
        <v-icon
          size="120"
          color="error"
          class="mb-4"
        >
          mdi-lock-alert
        </v-icon>

        <!-- Código de error -->
        <h1 class="text-h2 font-weight-bold text-error mb-2">
          403
        </h1>

        <!-- Mensaje -->
        <h2 class="text-h5 mb-4">
          {{ t('errors.forbidden') }}
        </h2>

        <p class="text-body-1 text-medium-emphasis mb-8">
          {{ t('errors.unauthorized') }}
        </p>

        <!-- Información adicional -->
        <v-alert
          v-if="authStore.isAuthenticated"
          type="info"
          variant="tonal"
          class="mb-6 text-left"
        >
          <p class="text-body-2">
            <strong>Usuario actual:</strong> {{ authStore.fullName }}
          </p>
          <p class="text-body-2">
            <strong>Rol:</strong> {{ authStore.userRole }}
          </p>
          <p class="text-caption text-medium-emphasis mt-2">
            Tu rol actual no tiene permisos para acceder a esta página.
          </p>
        </v-alert>

        <v-alert
          v-else
          type="warning"
          variant="tonal"
          class="mb-6"
        >
          <p class="text-body-2">
            Debes iniciar sesión para acceder a esta página.
          </p>
        </v-alert>

        <!-- Acciones -->
        <div class="d-flex flex-column flex-sm-row ga-3 justify-center">
          <v-btn
            v-if="!authStore.isAuthenticated"
            color="primary"
            size="large"
            prepend-icon="mdi-login"
            @click="router.push('/login')"
          >
            Iniciar Sesión
          </v-btn>

          <v-btn
            color="primary"
            size="large"
            prepend-icon="mdi-home"
            @click="router.push('/')"
          >
            Ir al Inicio
          </v-btn>

          <v-btn
            variant="outlined"
            size="large"
            prepend-icon="mdi-arrow-left"
            @click="router.back()"
          >
            Volver Atrás
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
