<!--
  =============================================================================
  NOT FOUND VIEW - Página 404
  =============================================================================
  Vista mostrada cuando el usuario intenta acceder a una ruta que no existe.
  =============================================================================
-->

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const { t } = useI18n()
</script>

<template>
  <v-container class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6" class="text-center">
        <!-- Icono grande -->
        <v-icon
          size="120"
          color="primary"
          class="mb-4"
        >
          mdi-map-marker-question
        </v-icon>

        <!-- Código de error -->
        <h1 class="text-h2 font-weight-bold text-primary mb-2">
          404
        </h1>

        <!-- Mensaje -->
        <h2 class="text-h5 mb-4">
          {{ t('errors.notFound') }}
        </h2>

        <p class="text-body-1 text-medium-emphasis mb-8">
          La página que buscas no existe o ha sido movida.
        </p>

        <!-- Acciones -->
        <div class="d-flex flex-column flex-sm-row ga-3 justify-center">
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
