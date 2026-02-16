<!--
  =============================================================================
  ADMIN LOCATIONS LIST VIEW - Lista de ubicaciones (Administración)
  =============================================================================
  Vista de administración que muestra todas las ubicaciones con:
  - Tabla de datos con paginación
  - Filtros por estado (activas/inactivas) y búsqueda
  - Acciones CRUD (crear, editar, eliminar, activar/desactivar)
  - Estadísticas rápidas
  =============================================================================
-->

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useLocationsStore } from '@/stores/locations'
import { useUiStore } from '@/stores/ui'
import { usePagination } from '@/composables/usePagination'
import type { Location } from '@/types'

const router = useRouter()
const { t } = useI18n()
const locationsStore = useLocationsStore()
const uiStore = useUiStore()

// Estado
const loading = ref(true)
const search = ref('')
const statusFilter = ref<'all' | 'active' | 'inactive'>('all')
const showDeleteDialog = ref(false)
const locationToDelete = ref<Location | null>(null)
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
const filteredLocations = computed(() => {
  let filtered = locationsStore.locations

  // Filtrar por búsqueda
  if (search.value) {
    const searchLower = search.value.toLowerCase()
    filtered = filtered.filter(
      loc =>
        loc.name.toLowerCase().includes(searchLower) ||
        loc.address.toLowerCase().includes(searchLower) ||
        loc.city.toLowerCase().includes(searchLower)
    )
  }

  // Filtrar por estado
  if (statusFilter.value === 'active') {
    filtered = filtered.filter(loc => loc.isActive)
  } else if (statusFilter.value === 'inactive') {
    filtered = filtered.filter(loc => !loc.isActive)
  }

  updateTotalCount(filtered.length)
  return filtered
})

const paginatedLocations = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredLocations.value.slice(start, end)
})

const statusOptions = [
  { value: 'all', title: 'Todas' },
  { value: 'active', title: 'Activas' },
  { value: 'inactive', title: 'Inactivas' }
]

// Headers de la tabla
const headers = [
  { title: 'Nombre', key: 'name', sortable: true },
  { title: 'Ciudad', key: 'city', sortable: true },
  { title: 'Dirección', key: 'address', sortable: true },
  { title: 'Capacidad', key: 'capacity', sortable: true },
  { title: 'Estado', key: 'isActive', sortable: true },
  { title: 'Acciones', key: 'actions', sortable: false, align: 'end' }
]

// Métodos
function goToCreate() {
  router.push('/admin/locations/new')
}

function goToEdit(location: Location) {
  router.push(`/admin/locations/${location.id}/edit`)
}

function openDeleteDialog(location: Location) {
  locationToDelete.value = location
  showDeleteDialog.value = true
}

async function confirmDelete() {
  if (!locationToDelete.value) return

  deleting.value = true

  try {
    await locationsStore.deleteLocation(locationToDelete.value.id)
    uiStore.showSuccess('Ubicación eliminada correctamente')
  } catch (error) {
    console.error('Error deleting location:', error)
    uiStore.showError('Error al eliminar la ubicación')
  } finally {
    deleting.value = false
    showDeleteDialog.value = false
    locationToDelete.value = null
  }
}

async function toggleActive(location: Location) {
  try {
    await locationsStore.updateLocation(location.id, {
      ...location,
      isActive: !location.isActive
    })
    uiStore.showSuccess(
      location.isActive
        ? 'Ubicación desactivada'
        : 'Ubicación activada'
    )
  } catch (error) {
    console.error('Error toggling active:', error)
    uiStore.showError('Error al cambiar el estado de la ubicación')
  }
}

async function loadLocations() {
  loading.value = true

  try {
    await locationsStore.fetchLocations({ page: 1, pageSize: 100 })
  } catch (error) {
    console.error('Error loading locations:', error)
    uiStore.showError('Error al cargar las ubicaciones')
  } finally {
    loading.value = false
  }
}

// Cargar ubicaciones al montar
onMounted(async () => {
  await loadLocations()
})
</script>

<template>
  <div class="admin-locations-list-view">
    <!-- Encabezado -->
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold mb-2">
          Gestión de Ubicaciones
        </h1>
        <p class="text-body-1 text-medium-emphasis">
          Administra las ubicaciones disponibles para eventos
        </p>
      </div>

      <v-btn
        color="primary"
        size="large"
        prepend-icon="mdi-plus"
        @click="goToCreate"
      >
        Nueva Ubicación
      </v-btn>
    </div>

    <!-- Filtros -->
    <v-card class="mb-6">
      <v-card-text>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="search"
              label="Buscar ubicaciones"
              placeholder="Nombre, ciudad, dirección..."
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

    <!-- Tabla de ubicaciones -->
    <v-card>
      <v-data-table
        :headers="headers"
        :items="paginatedLocations"
        :loading="loading"
        :items-per-page="pageSize"
        hide-default-footer
        class="elevation-1"
      >
        <!-- Nombre -->
        <template #item.name="{ item }">
          <div class="font-weight-medium">{{ item.name }}</div>
          <div v-if="item.description" class="text-caption text-medium-emphasis">
            {{ item.description.substring(0, 50) }}...
          </div>
        </template>

        <!-- Capacidad -->
        <template #item.capacity="{ item }">
          <v-chip size="small" color="primary">
            <v-icon start size="small">mdi-account-group</v-icon>
            {{ item.capacity }}
          </v-chip>
        </template>

        <!-- Estado -->
        <template #item.isActive="{ item }">
          <v-chip
            :color="item.isActive ? 'success' : 'error'"
            size="small"
            :prepend-icon="item.isActive ? 'mdi-check-circle' : 'mdi-close-circle'"
          >
            {{ item.isActive ? 'Activa' : 'Inactiva' }}
          </v-chip>
        </template>

        <!-- Acciones -->
        <template #item.actions="{ item }">
          <div class="d-flex ga-1">
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

            <v-tooltip :text="item.isActive ? 'Desactivar' : 'Activar'">
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  :icon="item.isActive ? 'mdi-eye-off' : 'mdi-eye-check'"
                  size="small"
                  variant="text"
                  :color="item.isActive ? 'warning' : 'success'"
                  @click="toggleActive(item)"
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
              mdi-map-marker-off
            </v-icon>
            <p class="text-h6 text-medium-emphasis mb-2">
              No hay ubicaciones
            </p>
            <p class="text-body-2 text-medium-emphasis mb-4">
              Comienza añadiendo tu primera ubicación
            </p>
            <v-btn
              color="primary"
              prepend-icon="mdi-plus"
              @click="goToCreate"
            >
              Crear Ubicación
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
          Eliminar Ubicación
        </v-card-title>

        <v-card-text>
          <p>¿Estás seguro de que deseas eliminar la ubicación:</p>
          <p class="font-weight-bold mt-2">{{ locationToDelete?.name }}</p>
          <p class="text-body-2 text-medium-emphasis mt-2">
            Esta acción no se puede deshacer. No podrás eliminar ubicaciones que tengan eventos asociados.
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
.admin-locations-list-view {
  // Estilos específicos si son necesarios
}
</style>
