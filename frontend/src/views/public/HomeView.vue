<!--
  =============================================================================
  HOME VIEW - Página principal
  =============================================================================
  Página de inicio de la aplicación pública con:
  - Hero section con CTA
  - Eventos destacados/próximos
  - Categorías populares
  - Sección de características
  =============================================================================
-->

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useEventsStore } from '@/stores/events'
import { useCategoriesStore } from '@/stores/categories'
import EventCard from '@/components/events/EventCard.vue'

const router = useRouter()
const { t } = useI18n()
const eventsStore = useEventsStore()
const categoriesStore = useCategoriesStore()

// Estado
const loading = ref(true)

// Cargar datos al montar
onMounted(async () => {
  loading.value = true
  await Promise.all([
    eventsStore.fetchEvents({ page: 1, pageSize: 6, status: 'Published' }),
    categoriesStore.fetchCategories()
  ])
  loading.value = false
})

// Características de la plataforma
const features = [
  {
    icon: 'mdi-calendar-check',
    title: 'Fácil Organización',
    description: 'Crea y gestiona tus eventos de forma simple e intuitiva'
  },
  {
    icon: 'mdi-account-group',
    title: 'Gestión de Asistentes',
    description: 'Controla inscripciones y asistencia en tiempo real'
  },
  {
    icon: 'mdi-chart-line',
    title: 'Estadísticas Detalladas',
    description: 'Analiza el rendimiento de tus eventos con datos precisos'
  },
  {
    icon: 'mdi-shield-check',
    title: 'Seguro y Confiable',
    description: 'Plataforma robusta con los más altos estándares de seguridad'
  }
]
</script>

<template>
  <div class="home-view">
    <!--
      =========================================================================
      HERO SECTION
      =========================================================================
    -->
    <v-container fluid class="hero-section pa-0">
      <v-container class="py-16">
        <v-row align="center" justify="center">
          <v-col cols="12" md="8" class="text-center">
            <!-- Título principal -->
            <h1 class="text-h2 text-sm-h1 font-weight-bold mb-4">
              {{ t('general.appName') }}
            </h1>

            <!-- Subtítulo -->
            <p class="text-h6 text-sm-h5 text-medium-emphasis mb-8">
              La plataforma líder para gestionar y descubrir eventos increíbles
            </p>

            <!-- CTAs -->
            <div class="d-flex flex-column flex-sm-row ga-4 justify-center">
              <v-btn
                color="primary"
                size="x-large"
                prepend-icon="mdi-calendar-search"
                @click="router.push('/events')"
              >
                Explorar Eventos
              </v-btn>

              <v-btn
                variant="outlined"
                size="x-large"
                prepend-icon="mdi-plus-circle"
                @click="router.push('/register')"
              >
                Crear Cuenta
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-container>

    <!--
      =========================================================================
      EVENTOS DESTACADOS
      =========================================================================
    -->
    <v-container class="py-12">
      <div class="d-flex justify-space-between align-center mb-6">
        <div>
          <h2 class="text-h4 font-weight-bold mb-2">
            Próximos Eventos
          </h2>
          <p class="text-body-1 text-medium-emphasis">
            Descubre los eventos más interesantes
          </p>
        </div>

        <v-btn
          variant="text"
          color="primary"
          append-icon="mdi-arrow-right"
          @click="router.push('/events')"
        >
          Ver Todos
        </v-btn>
      </div>

      <!-- Loading skeleton -->
      <v-row v-if="loading">
        <v-col
          v-for="n in 6"
          :key="n"
          cols="12"
          sm="6"
          md="4"
        >
          <v-skeleton-loader type="card" />
        </v-col>
      </v-row>

      <!-- Lista de eventos -->
      <v-row v-else>
        <v-col
          v-for="event in eventsStore.upcomingEvents.slice(0, 6)"
          :key="event.id"
          cols="12"
          sm="6"
          md="4"
        >
          <EventCard :event="event" />
        </v-col>
      </v-row>

      <!-- Mensaje si no hay eventos -->
      <v-alert
        v-if="!loading && eventsStore.upcomingEvents.length === 0"
        type="info"
        variant="tonal"
        class="mt-4"
      >
        No hay eventos próximos en este momento. ¡Vuelve pronto!
      </v-alert>
    </v-container>

    <!--
      =========================================================================
      CATEGORÍAS POPULARES
      =========================================================================
    -->
    <v-container fluid class="categories-section py-12">
      <v-container>
        <div class="text-center mb-8">
          <h2 class="text-h4 font-weight-bold mb-2">
            Explora por Categoría
          </h2>
          <p class="text-body-1 text-medium-emphasis">
            Encuentra eventos que te interesan
          </p>
        </div>

        <v-row>
          <v-col
            v-for="category in categoriesStore.categories.slice(0, 8)"
            :key="category.id"
            cols="6"
            sm="4"
            md="3"
          >
            <v-card
              hover
              class="text-center pa-4 category-card"
              @click="router.push(`/events?categoryId=${category.id}`)"
            >
              <v-icon
                :color="category.color"
                size="48"
                class="mb-3"
              >
                {{ category.icon }}
              </v-icon>
              <h3 class="text-subtitle-1 font-weight-bold">
                {{ category.name }}
              </h3>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-container>

    <!--
      =========================================================================
      CARACTERÍSTICAS DE LA PLATAFORMA
      =========================================================================
    -->
    <v-container class="py-12">
      <div class="text-center mb-8">
        <h2 class="text-h4 font-weight-bold mb-2">
          ¿Por qué elegir Eventify?
        </h2>
        <p class="text-body-1 text-medium-emphasis">
          Todo lo que necesitas para gestionar eventos exitosos
        </p>
      </div>

      <v-row>
        <v-col
          v-for="(feature, index) in features"
          :key="index"
          cols="12"
          sm="6"
          md="3"
        >
          <v-card class="text-center pa-6 h-100 feature-card" elevation="0">
            <v-avatar
              size="80"
              :color="index % 2 === 0 ? 'primary' : 'secondary'"
              class="mb-4"
            >
              <v-icon size="40" color="white">{{ feature.icon }}</v-icon>
            </v-avatar>

            <h3 class="text-h6 font-weight-bold mb-2">
              {{ feature.title }}
            </h3>

            <p class="text-body-2 text-medium-emphasis">
              {{ feature.description }}
            </p>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!--
      =========================================================================
      CTA FINAL
      =========================================================================
    -->
    <v-container fluid class="cta-section py-12">
      <v-container>
        <v-row justify="center">
          <v-col cols="12" md="8" class="text-center">
            <h2 class="text-h4 font-weight-bold mb-4">
              ¿Listo para comenzar?
            </h2>
            <p class="text-h6 text-medium-emphasis mb-6">
              Únete a miles de usuarios que ya confían en Eventify
            </p>

            <v-btn
              color="primary"
              size="x-large"
              prepend-icon="mdi-rocket-launch"
              @click="router.push('/register')"
            >
              Crear Cuenta Gratis
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-container>
  </div>
</template>

<style scoped lang="scss">
.home-view {
  // Hero section con gradiente
  .hero-section {
    background: linear-gradient(
      135deg,
      rgb(var(--v-theme-primary)) 0%,
      rgb(var(--v-theme-secondary)) 100%
    );
    color: white;
  }

  // Sección de categorías con fondo
  .categories-section {
    background: rgb(var(--v-theme-surface-variant));
  }

  // Cards de categorías con efecto hover
  .category-card {
    cursor: pointer;
    transition: transform 0.2s ease;

    &:hover {
      transform: translateY(-8px);
    }
  }

  // Cards de características
  .feature-card {
    border: 1px solid rgba(var(--v-theme-on-surface), 0.12);
  }

  // CTA section con gradiente suave
  .cta-section {
    background: linear-gradient(
      to right,
      rgba(var(--v-theme-primary), 0.05),
      rgba(var(--v-theme-secondary), 0.05)
    );
  }
}
</style>
