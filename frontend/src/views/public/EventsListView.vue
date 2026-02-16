<!--
  =============================================================================
  EVENTS LIST VIEW - Vista de listado de eventos
  =============================================================================
  Vista pública que muestra todos los eventos disponibles con:
  - Filtros de búsqueda (texto, categoría, ubicación, fechas)
  - Ordenación
  - Paginación
  - Grid responsive de eventos
  - Estados de carga y vacío
  =============================================================================
-->

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useEventsStore } from '@/stores/events'
import { usePagination } from '@/composables/usePagination'
import EventCard from '@/components/events/EventCard.vue'
import EventFilters from '@/components/events/EventFilters.vue'
import type { EventSearchParams } from '@/types'

const router = useRouter()
const route = useRoute()
const { t } = useI18n()
const eventsStore = useEventsStore()

// Estado
const loading = ref(true)
const currentFilters = ref<EventSearchParams>({
  page: 1,
  pageSize: 12,
  status: 'Published'
})

// Paginación
const {
  currentPage,
  pageSize,
  totalPages,
  totalCount,
  hasNextPage,
  hasPreviousPage,
  changePage,
  nextPage,
  previousPage,
  updateTotalCount
} = usePagination(12)

// Computados
// Usar la ref computada del store directamente para evitar anidamiento
const events = eventsStore.publishedEvents

const displayedEvents = computed(() => {
  // En producción, la paginación la hace el backend
  // Aquí simulamos paginación del lado del cliente para el desarrollo
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return events.value.slice(start, end)
})

// Métodos
async function loadEvents(filters: EventSearchParams) {
  loading.value = true
  currentFilters.value = filters

  try {
    await eventsStore.fetchEvents(filters)

    // Actualizar contador de paginación
    // En producción, esto vendría del backend
    updateTotalCount(events.value.length)
  } catch (error) {
    console.error('Error loading events:', error)
  } finally {
    loading.value = false
  }
}

function handleFilter(filters: EventSearchParams) {
  // Resetear a página 1 cuando cambian los filtros
  changePage(1)
  filters.page = currentPage.value
  filters.pageSize = pageSize.value
  loadEvents(filters)
}

function handlePageChange(page: number) {
  changePage(page)
  currentFilters.value.page = page
  loadEvents(currentFilters.value)

  // Scroll to top suavemente
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Cargar eventos iniciales
onMounted(async () => {
  // Leer filtros de la URL si existen
  const categoryId = route.query.categoryId
  if (categoryId) {
    currentFilters.value.categoryId = Number(categoryId)
  }

  await loadEvents(currentFilters.value)
})
</script>

<template>
  <v-container class="events-list-view py-8">
    <!-- Título de la página -->
    <div class="text-center mb-8">
      <h1 class="text-h3 font-weight-bold mb-2">
        Explorar Eventos
      </h1>
      <p class="text-h6 text-medium-emphasis">
        Descubre eventos increíbles cerca de ti
      </p>
    </div>

    <!-- Componente de filtros -->
    <EventFilters @filter="handleFilter" />

    <!-- Contador de resultados -->
    <div class="d-flex justify-space-between align-center mb-4">
      <div class="text-body-1">
        <span v-if="!loading && events.length > 0">
          Mostrando {{ displayedEvents.length }} de {{ totalCount }} eventos
        </span>
        <span v-else-if="!loading">
          No se encontraron eventos
        </span>
      </div>

      <div class="text-body-2 text-medium-emphasis">
        Página {{ currentPage }} de {{ totalPages }}
      </div>
    </div>

    <!-- Loading skeleton -->
    <v-row v-if="loading">
      <v-col
        v-for="n in 12"
        :key="n"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <v-skeleton-loader type="card" />
      </v-col>
    </v-row>

    <!-- Grid de eventos -->
    <v-row v-else-if="displayedEvents.length > 0">
      <v-col
        v-for="event in displayedEvents"
        :key="event.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <EventCard :event="event" />
      </v-col>
    </v-row>

    <!-- Mensaje si no hay eventos -->
    <v-alert
      v-else
      type="info"
      variant="tonal"
      class="mt-8"
    >
      <template #prepend>
        <v-icon size="large">mdi-information</v-icon>
      </template>
      <div class="text-body-1">
        <strong>No se encontraron eventos</strong>
      </div>
      <div class="text-body-2 mt-2">
        No hay eventos que coincidan con tus criterios de búsqueda.
        Intenta ajustar los filtros o explorar todas las categorías.
      </div>
    </v-alert>

    <!-- Paginación -->
    <div v-if="!loading && displayedEvents.length > 0" class="mt-8">
      <v-pagination
        :model-value="currentPage"
        :length="totalPages"
        :total-visible="7"
        @update:model-value="handlePageChange"
      />

      <!-- Botones de navegación adicionales para móvil -->
      <div class="d-flex justify-center ga-2 mt-4">
        <v-btn
          :disabled="!hasPreviousPage"
          variant="outlined"
          prepend-icon="mdi-chevron-left"
          @click="handlePageChange(currentPage - 1)"
        >
          Anterior
        </v-btn>

        <v-btn
          :disabled="!hasNextPage"
          variant="outlined"
          append-icon="mdi-chevron-right"
          @click="handlePageChange(currentPage + 1)"
        >
          Siguiente
        </v-btn>
      </div>
    </div>

    <!-- FAB para volver arriba (visible en scroll) -->
    <v-fab
      icon="mdi-chevron-up"
      location="bottom end"
      size="small"
      color="primary"
      app
      appear
      @click="window.scrollTo({ top: 0, behavior: 'smooth' })"
    />
  </v-container>
</template>

<style scoped lang="scss">
.events-list-view {
  min-height: 100vh;
}
</style>
