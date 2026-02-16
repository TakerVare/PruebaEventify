

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


const loading = ref(true)
const currentFilters = ref<EventSearchParams>({
  page: 1,
  pageSize: 12,
  status: 'Published'
})


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



const events = eventsStore.publishedEvents

const displayedEvents = computed(() => {
  
  
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return events.value.slice(start, end)
})


async function loadEvents(filters: EventSearchParams) {
  loading.value = true
  currentFilters.value = filters

  try {
    await eventsStore.fetchEvents(filters)

    
    
    updateTotalCount(events.value.length)
  } catch (error) {
    console.error('Error loading events:', error)
  } finally {
    loading.value = false
  }
}

function handleFilter(filters: EventSearchParams) {
  
  changePage(1)
  filters.page = currentPage.value
  filters.pageSize = pageSize.value
  loadEvents(filters)
}

function handlePageChange(page: number) {
  changePage(page)
  currentFilters.value.page = page
  loadEvents(currentFilters.value)

  
  window.scrollTo({ top: 0, behavior: 'smooth' })
}


onMounted(async () => {
  
  const categoryId = route.query.categoryId
  if (categoryId) {
    currentFilters.value.categoryId = Number(categoryId)
  }

  await loadEvents(currentFilters.value)
})
</script>

<template>
  <v-container class="events-list-view py-8">
    
    <div class="text-center mb-8">
      <h1 class="text-h3 font-weight-bold mb-2">
        Explorar Eventos
      </h1>
      <p class="text-h6 text-medium-emphasis">
        Descubre eventos increíbles cerca de ti
      </p>
    </div>

    
    <EventFilters @filter="handleFilter" />

    
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

    
    <div v-if="!loading && displayedEvents.length > 0" class="mt-8">
      <v-pagination
        :model-value="currentPage"
        :length="totalPages"
        :total-visible="7"
        @update:model-value="handlePageChange"
      />

      
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
