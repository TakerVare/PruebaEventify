<!--
  =============================================================================
  PUBLIC FOOTER - Footer para vistas públicas
  =============================================================================
  Componente de pie de página para las páginas públicas de la aplicación.

  Incluye:
  - Información de la empresa
  - Enlaces útiles
  - Redes sociales
  - Copyright
  =============================================================================
-->

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const currentYear = new Date().getFullYear()

// Enlaces de navegación del footer
const footerLinks = [
  {
    title: 'Empresa',
    links: [
      { text: 'Sobre nosotros', href: '#' },
      { text: 'Equipo', href: '#' },
      { text: 'Carreras', href: '#' },
      { text: 'Blog', href: '#' }
    ]
  },
  {
    title: 'Soporte',
    links: [
      { text: 'Centro de ayuda', href: '#' },
      { text: 'FAQ', href: '#' },
      { text: t('footer.contact'), href: '#' },
      { text: 'Estado del servicio', href: '#' }
    ]
  },
  {
    title: 'Legal',
    links: [
      { text: t('footer.privacyPolicy'), href: '#' },
      { text: t('footer.termsOfService'), href: '#' },
      { text: 'Política de cookies', href: '#' },
      { text: 'Accesibilidad', href: '#' }
    ]
  }
]

// Redes sociales
const socialLinks = [
  { icon: 'mdi-facebook', href: '#', label: 'Facebook' },
  { icon: 'mdi-twitter', href: '#', label: 'Twitter' },
  { icon: 'mdi-instagram', href: '#', label: 'Instagram' },
  { icon: 'mdi-linkedin', href: '#', label: 'LinkedIn' }
]
</script>

<template>
  <v-footer
    class="bg-surface"
    elevation="8"
  >
    <v-container>
      <!-- Contenido principal del footer -->
      <v-row>
        <!-- Columna 1: Información de la empresa -->
        <v-col
          cols="12"
          md="4"
          class="mb-4 mb-md-0"
        >
          <!-- Logo y descripción -->
          <div class="d-flex align-center mb-4">
            <v-icon size="32" color="primary" class="mr-2">mdi-calendar-star</v-icon>
            <span class="text-h6 font-weight-bold text-primary">Eventify</span>
          </div>

          <p class="text-body-2 text-medium-emphasis mb-4">
            La plataforma líder para la gestión y organización de eventos.
            Conectamos organizadores con asistentes de manera simple y efectiva.
          </p>

          <!-- Redes sociales -->
          <div class="d-flex ga-2">
            <v-btn
              v-for="social in socialLinks"
              :key="social.label"
              :icon="social.icon"
              :href="social.href"
              variant="text"
              size="small"
              :aria-label="social.label"
            />
          </div>
        </v-col>

        <!-- Columnas 2-4: Enlaces -->
        <v-col
          v-for="section in footerLinks"
          :key="section.title"
          cols="12"
          sm="4"
          md="2"
          offset-md="1"
        >
          <h3 class="text-subtitle-1 font-weight-bold mb-3">
            {{ section.title }}
          </h3>

          <v-list density="compact" class="bg-transparent">
            <v-list-item
              v-for="link in section.links"
              :key="link.text"
              :href="link.href"
              class="px-0"
              min-height="32"
            >
              <v-list-item-title class="text-body-2">
                {{ link.text }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-col>
      </v-row>

      <v-divider class="my-4" />

      <!-- Copyright y enlaces legales -->
      <v-row>
        <v-col cols="12" class="text-center text-md-start">
          <p class="text-caption text-medium-emphasis mb-0">
            {{ t('footer.copyright', { year: currentYear }) }}
          </p>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<style scoped lang="scss">
// Estilos adicionales si son necesarios
</style>
