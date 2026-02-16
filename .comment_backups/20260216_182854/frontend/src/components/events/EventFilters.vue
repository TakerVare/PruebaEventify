<!--
  =============================================================================
  EVENT FILTERS - Componente de filtros para eventos
  =============================================================================
  Componente para filtrar y buscar eventos. Incluye:
  - Búsqueda por texto
  - Filtro por categoría
  - Filtro por ubicación
  - Filtro por rango de fechas
  - Ordenación (fecha, título)
  - Botón para limpiar filtros

  Emits:
  - filter: Emite los filtros aplicados cuando cambian
  =============================================================================
-->

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCategoriesStore } from '@/stores/categories'
import { useLocationsStore } from '@/stores/locations'
import type { EventSearchParams } from '@/types'

// Emits
const emit = defineEmits<{
  filter: [filters: EventSearchParams]
}>()

const { t } = useI18n()
const categoriesStore = useCategoriesStore()
const locationsStore = useLocationsStore()

// Estado local de filtros
const search = ref('')
const categoryId = ref<number | null>(null)
const locationId = ref<number | null>(null)
const startDate = ref<string | null>(null)
const endDate = ref<string | null>(null)
const sortBy = ref<'startDate' | 'title'>('startDate')
const sortOrder = ref<'asc' | 'desc'>('asc')

// Cargar datos necesarios
onMounted(async () => {
  await Promise.all([
    categoriesStore.fetchCategories(),
    locationsStore.fetchLocations()
  ])
})

// Opciones para los selects
const categoryOptions = computed(() => {
  return [
    { value: null, title: t('events.filters.allCategories') },
    ...categoriesStore.categories.map(cat => ({
      value: cat.id,
      title: cat.name
    }))
  ]
})

const locationOptions = computed(() => {
  return [
    { value: null, title: t('events.filters.allLocations') },
    ...locationsStore.activeLocations.map(loc => ({
      value: loc.id,
      title: loc.name
    }))
  ]
})

const sortOptions = [
  { value: 'startDate', title: 'Fecha' },
  { value: 'title', title: 'Título' }
]

const sortOrderOptions = [
  { value: 'asc', title: 'Ascendente' },
  { value: 'desc', title: 'Descendente' }
]

// Computado para saber si hay filtros activos
const hasActiveFilters = computed(() => {
  return !!(
    search.value ||
    categoryId.value !== null ||
    locationId.value !== null ||
    startDate.value ||
    endDate.value
  )
})

// Construir objeto de filtros
const buildFilters = (): EventSearchParams => {
  const filters: EventSearchParams = {
    page: 1, // Resetear a página 1 cuando cambian los filtros
    pageSize: 12,
    status: 'Published' // Solo eventos publicados en vista pública
  }

  if (search.value) filters.search = search.value
  if (categoryId.value) filters.categoryId = categoryId.value
  if (locationId.value) filters.locationId = locationId.value
  if (startDate.value) filters.startDate = startDate.value
  if (endDate.value) filters.endDate = endDate.value
  if (sortBy.value) filters.sortBy = sortBy.value

  // Convertir sortOrder (asc/desc) a sortDescending (boolean) para el backend
  filters.sortDescending = sortOrder.value === 'desc'

  return filters
}

// Emitir filtros cuando cambian
const emitFilters = () => {
  emit('filter', buildFilters())
}

// Watchers para emitir cuando cambian los filtros
watch([search, categoryId, locationId, startDate, endDate, sortBy, sortOrder], () => {
  emitFilters()
}, { deep: true })

// Limpiar todos los filtros
const clearFilters = () => {
  search.value = ''
  categoryId.value = null
  locationId.value = null
  startDate.value = null
  endDate.value = null
  sortBy.value = 'startDate'
  sortOrder.value = 'asc'
}

// Emitir filtros iniciales al montar
onMounted(() => {
  emitFilters()
})
</script>

<template>
  <v-card class="event-filters mb-6">
    <v-card-title class="d-flex justify-space-between align-center">
      <span>
        <v-icon start>mdi-filter</v-icon>
        Filtrar Eventos
      </span>

      <v-btn
        v-if="hasActiveFilters"
        variant="text"
        color="primary"
        size="small"
        prepend-icon="mdi-filter-off"
        @click="clearFilters"
      >
        Limpiar Filtros
      </v-btn>
    </v-card-title>

    <v-divider />

    <v-card-text>
      <v-row>
        <!-- Búsqueda por texto -->
        <v-col cols="12" md="6">
          <v-text-field
            v-model="search"
            label="Buscar eventos"
            placeholder="Título, descripción..."
            prepend-inner-icon="mdi-magnify"
            clearable
            variant="outlined"
            density="comfortable"
          />
        </v-col>

        <!-- Filtro por categoría -->
        <v-col cols="12" sm="6" md="3">
          <v-select
            v-model="categoryId"
            :items="categoryOptions"
            label="Categoría"
            prepend-inner-icon="mdi-shape"
            variant="outlined"
            density="comfortable"
            clearable
          />
        </v-col>

        <!-- Filtro por ubicación -->
        <v-col cols="12" sm="6" md="3">
          <v-select
            v-model="locationId"
            :items="locationOptions"
            label="Ubicación"
            prepend-inner-icon="mdi-map-marker"
            variant="outlined"
            density="comfortable"
            clearable
          />
        </v-col>

        <!-- Fecha inicio -->
        <v-col cols="12" sm="6" md="3">
          <v-text-field
            v-model="startDate"
            type="date"
            label="Desde"
            prepend-inner-icon="mdi-calendar-start"
            variant="outlined"
            density="comfortable"
            clearable
          />
        </v-col>

        <!-- Fecha fin -->
        <v-col cols="12" sm="6" md="3">
          <v-text-field
            v-model="endDate"
            type="date"
            label="Hasta"
            prepend-inner-icon="mdi-calendar-end"
            variant="outlined"
            density="comfortable"
            clearable
          />
        </v-col>

        <!-- Ordenar por -->
        <v-col cols="12" sm="6" md="3">
          <v-select
            v-model="sortBy"
            :items="sortOptions"
            label="Ordenar por"
            prepend-inner-icon="mdi-sort"
            variant="outlined"
            density="comfortable"
          />
        </v-col>

        <!-- Orden -->
        <v-col cols="12" sm="6" md="3">
          <v-select
            v-model="sortOrder"
            :items="sortOrderOptions"
            label="Orden"
            prepend-inner-icon="mdi-sort-ascending"
            variant="outlined"
            density="comfortable"
          />
        </v-col>
      </v-row>

      <!-- Indicador de filtros activos -->
      <v-row v-if="hasActiveFilters">
        <v-col cols="12">
          <div class="d-flex flex-wrap ga-2">
            <v-chip
              v-if="search"
              closable
              size="small"
              @click:close="search = ''"
            >
              Búsqueda: "{{ search }}"
            </v-chip>

            <v-chip
              v-if="categoryId"
              closable
              size="small"
              @click:close="categoryId = null"
            >
              Categoría: {{ categoriesStore.getCategoryById(categoryId)?.name }}
            </v-chip>

            <v-chip
              v-if="locationId"
              closable
              size="small"
              @click:close="locationId = null"
            >
              Ubicación: {{ locationsStore.getLocationById(locationId)?.name }}
            </v-chip>

            <v-chip
              v-if="startDate"
              closable
              size="small"
              @click:close="startDate = null"
            >
              Desde: {{ startDate }}
            </v-chip>

            <v-chip
              v-if="endDate"
              closable
              size="small"
              @click:close="endDate = null"
            >
              Hasta: {{ endDate }}
            </v-chip>
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<style scoped lang="scss">
.event-filters {
  // Estilos específicos si son necesarios
}
</style>
