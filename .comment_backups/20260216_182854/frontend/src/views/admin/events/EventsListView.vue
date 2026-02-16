<!--
  =============================================================================
  ADMIN EVENTS LIST VIEW - Lista de eventos (Administración)
  =============================================================================
  Vista de administración que muestra todos los eventos con:
  - Tabla de datos con paginación
  - Filtros por estado y búsqueda
  - Acciones CRUD (crear, editar, eliminar, publicar)
  - Estadísticas rápidas
  =============================================================================
-->

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useEventsStore } from '@/stores/events'
import { useAuthStore } from '@/stores/auth'
import { useUiStore } from '@/stores/ui'
import { usePagination } from '@/composables/usePagination'
import type { Event } from '@/types'

const router = useRouter()
const { t, d } = useI18n()
const eventsStore = useEventsStore()
const authStore = useAuthStore()
const uiStore = useUiStore()

// Estado
const loading = ref(true)
const search = ref('')
const statusFilter = ref<string>('all')
const showDeleteDialog = ref(false)
const eventToDelete = ref<Event | null>(null)
const deleting = ref(false)

// Paginación
const {
  currentPage,
  pageSize,
  totalPages,
  totalCount,
  changePage,
  changePageSize,
  updateTotalCount
} = usePagination(10)

// Computados
const filteredEvents = computed(() => {
  let filtered = eventsStore.events

  // Filtrar por búsqueda
  if (search.value) {
    const searchLower = search.value.toLowerCase()
    filtered = filtered.filter(
      e =>
        e.title.toLowerCase().includes(searchLower) ||
        e.description.toLowerCase().includes(searchLower)
    )
  }

  // Filtrar por estado
  if (statusFilter.value !== 'all') {
    filtered = filtered.filter(e => e.status === statusFilter.value)
  }

  // Filtrar por organizador si no es admin
  if (!authStore.isAdmin) {
    filtered = filtered.filter(e => e.organizer?.id === authStore.user?.id)
  }

  updateTotalCount(filtered.length)
  return filtered
})

const paginatedEvents = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredEvents.value.slice(start, end)
})

const statusOptions = [
  { value: 'all', title: 'Todos' },
  { value: 'Published', title: 'Publicados' },
  { value: 'Draft', title: 'Borradores' },
  { value: 'Cancelled', title: 'Cancelados' },
  { value: 'Completed', title: 'Completados' }
]

// Headers de la tabla
const headers = [
  { title: 'Imagen', key: 'imageUrl', sortable: false },
  { title: 'Título', key: 'title', sortable: true },
  { title: 'Categoría', key: 'category.name', sortable: true },
  { title: 'Fecha', key: 'startDate', sortable: true },
  { title: 'Ubicación', key: 'location.name', sortable: true },
  { title: 'Asistentes', key: 'registeredCount', sortable: true },
  { title: 'Estado', key: 'status', sortable: true },
  { title: 'Acciones', key: 'actions', sortable: false, align: 'end' }
]

// Métodos
function getStatusColor(status: string): string {
  switch (status) {
    case 'Published':
      return 'success'
    case 'Draft':
      return 'warning'
    case 'Cancelled':
      return 'error'
    case 'Completed':
      return 'info'
    default:
      return 'grey'
  }
}

function formatDate(date: string): string {
  return d(new Date(date), 'short')
}

function goToCreate() {
  router.push('/admin/events/new')
}

function goToEdit(event: Event) {
  router.push(`/admin/events/${event.id}/edit`)
}

function goToView(event: Event) {
  router.push(`/events/${event.id}`)
}

function openDeleteDialog(event: Event) {
  eventToDelete.value = event
  showDeleteDialog.value = true
}

async function confirmDelete() {
  if (!eventToDelete.value) return

  deleting.value = true

  try {
    await eventsStore.deleteEvent(eventToDelete.value.id)
    uiStore.showSuccess('Evento eliminado correctamente')
  } catch (error) {
    console.error('Error deleting event:', error)
    uiStore.showError('Error al eliminar el evento')
  } finally {
    deleting.value = false
    showDeleteDialog.value = false
    eventToDelete.value = null
  }
}

async function togglePublish(event: Event) {
  try {
    if (event.status === 'Published') {
      // Cambiar a borrador
      await eventsStore.updateEvent(event.id, { ...event, status: 'Draft' })
      uiStore.showSuccess('Evento despublicado')
    } else {
      await eventsStore.publishEvent(event.id)
      uiStore.showSuccess('Evento publicado correctamente')
    }
  } catch (error) {
    console.error('Error toggling publish:', error)
    uiStore.showError('Error al cambiar el estado del evento')
  }
}

async function loadEvents() {
  loading.value = true

  try {
    await eventsStore.fetchEvents({ page: 1, pageSize: 100 })
  } catch (error) {
    console.error('Error loading events:', error)
    uiStore.showError('Error al cargar los eventos')
  } finally {
    loading.value = false
  }
}

// Cargar eventos al montar
onMounted(async () => {
  await loadEvents()
})
</script>

<template>
  <div class="admin-events-list-view">
    <!-- Encabezado -->
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold mb-2">
          Gestión de Eventos
        </h1>
        <p class="text-body-1 text-medium-emphasis">
          Administra todos los eventos de la plataforma
        </p>
      </div>

      <v-btn
        color="primary"
        size="large"
        prepend-icon="mdi-plus"
        @click="goToCreate"
      >
        Nuevo Evento
      </v-btn>
    </div>

    <!-- Filtros -->
    <v-card class="mb-6">
      <v-card-text>
        <v-row>
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

          <v-col cols="12" md="3">
            <v-select
              v-model="statusFilter"
              :items="statusOptions"
              label="Estado"
              variant="outlined"
              density="comfortable"
            />
          </v-col>

          <v-col cols="12" md="3">
            <v-select
              v-model="pageSize"
              :items="[5, 10, 25, 50]"
              label="Resultados por página"
              variant="outlined"
              density="comfortable"
              @update:model-value="changePageSize"
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Tabla de eventos -->
    <v-card>
      <v-data-table
        :headers="headers"
        :items="paginatedEvents"
        :loading="loading"
        :items-per-page="pageSize"
        hide-default-footer
        class="elevation-1"
      >
        <!-- Imagen -->
        <template #item.imageUrl="{ item }">
          <v-avatar size="60" rounded>
            <v-img
              :src="item.imageUrl || 'https://via.placeholder.com/60'"
              cover
            />
          </v-avatar>
        </template>

        <!-- Título -->
        <template #item.title="{ item }">
          <div class="font-weight-medium">{{ item.title }}</div>
          <div class="text-caption text-medium-emphasis">
            {{ item.description.substring(0, 50) }}...
          </div>
        </template>

        <!-- Categoría -->
        <template #item.category.name="{ item }">
          <v-chip
            v-if="item.category"
            :color="item.category.color"
            size="small"
            :prepend-icon="item.category.icon"
          >
            {{ item.category.name }}
          </v-chip>
        </template>

        <!-- Fecha -->
        <template #item.startDate="{ item }">
          {{ formatDate(item.startDate) }}
        </template>

        <!-- Asistentes -->
        <template #item.registeredCount="{ item }">
          <div class="text-center">
            <div class="font-weight-medium">
              {{ item.registeredCount }} / {{ item.capacity }}
            </div>
            <v-progress-linear
              :model-value="(item.registeredCount / item.capacity) * 100"
              height="4"
              rounded
              color="primary"
            />
          </div>
        </template>

        <!-- Estado -->
        <template #item.status="{ item }">
          <v-chip
            :color="getStatusColor(item.status)"
            size="small"
          >
            {{ item.status }}
          </v-chip>
        </template>

        <!-- Acciones -->
        <template #item.actions="{ item }">
          <div class="d-flex ga-1">
            <v-tooltip text="Ver detalles">
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon="mdi-eye"
                  size="small"
                  variant="text"
                  @click="goToView(item)"
                />
              </template>
            </v-tooltip>

            <v-tooltip text="Editar">
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon="mdi-pencil"
                  size="small"
                  variant="text"
                  color="primary"
                  @click="goToEdit(item)"
                />
              </template>
            </v-tooltip>

            <v-tooltip :text="item.status === 'Published' ? 'Despublicar' : 'Publicar'">
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  :icon="item.status === 'Published' ? 'mdi-eye-off' : 'mdi-eye-check'"
                  size="small"
                  variant="text"
                  :color="item.status === 'Published' ? 'warning' : 'success'"
                  @click="togglePublish(item)"
                />
              </template>
            </v-tooltip>

            <v-tooltip text="Eliminar">
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon="mdi-delete"
                  size="small"
                  variant="text"
                  color="error"
                  @click="openDeleteDialog(item)"
                />
              </template>
            </v-tooltip>
          </div>
        </template>

        <!-- No data -->
        <template #no-data>
          <div class="text-center py-8">
            <v-icon size="64" color="grey-lighten-1" class="mb-4">
              mdi-calendar-blank
            </v-icon>
            <p class="text-h6 text-medium-emphasis mb-2">
              No hay eventos
            </p>
            <p class="text-body-2 text-medium-emphasis mb-4">
              Comienza creando tu primer evento
            </p>
            <v-btn
              color="primary"
              prepend-icon="mdi-plus"
              @click="goToCreate"
            >
              Crear Evento
            </v-btn>
          </div>
        </template>
      </v-data-table>

      <!-- Paginación -->
      <v-divider />
      <div class="pa-4">
        <v-pagination
          v-model="currentPage"
          :length="totalPages"
          :total-visible="7"
          @update:model-value="changePage"
        />
      </div>
    </v-card>

    <!-- Diálogo de confirmación de eliminación -->
    <v-dialog v-model="showDeleteDialog" max-width="500">
      <v-card>
        <v-card-title class="text-h5">
          Eliminar Evento
        </v-card-title>

        <v-card-text>
          <p>¿Estás seguro de que deseas eliminar el evento:</p>
          <p class="font-weight-bold mt-2">{{ eventToDelete?.title }}</p>
          <p class="text-body-2 text-medium-emphasis mt-2">
            Esta acción no se puede deshacer. Se eliminarán todos los registros asociados.
          </p>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn
            variant="text"
            @click="showDeleteDialog = false"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="error"
            :loading="deleting"
            @click="confirmDelete"
          >
            Eliminar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped lang="scss">
.admin-events-list-view {
  // Estilos específicos si son necesarios
}
</style>
