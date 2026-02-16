<!--
  =============================================================================
  ADMIN LOCATION FORM VIEW - Formulario de creación/edición de ubicación
  =============================================================================
  Vista de administración para crear o editar ubicaciones.
  Utiliza el componente LocationForm y maneja la lógica de guardado.
  =============================================================================
-->

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useLocationsStore } from '@/stores/locations'
import { useUiStore } from '@/stores/ui'
import LocationForm from '@/components/locations/LocationForm.vue'
import type { Location, CreateLocationDto, UpdateLocationDto } from '@/types'

const router = useRouter()
const route = useRoute()
const { t } = useI18n()
const locationsStore = useLocationsStore()
const uiStore = useUiStore()

// Estado
const loading = ref(false)
const loadingLocation = ref(false)
const location = ref<Location | null>(null)

// Computados
const isEditMode = computed(() => route.params.id !== 'new')
const locationId = computed(() => Number(route.params.id))

const pageTitle = computed(() => {
  return isEditMode.value ? 'Editar Ubicación' : 'Crear Ubicación'
})

const breadcrumbs = computed(() => [
  { title: 'Dashboard', to: '/admin/dashboard' },
  { title: 'Ubicaciones', to: '/admin/locations' },
  { title: pageTitle.value }
])

// Métodos
async function loadLocation() {
  if (!isEditMode.value) return

  loadingLocation.value = true

  try {
    const loadedLocation = locationsStore.getLocationById(locationId.value)
    if (loadedLocation) {
      location.value = loadedLocation
    } else {
      uiStore.showError('Ubicación no encontrada')
      router.push('/admin/locations')
    }
  } catch (error) {
    console.error('Error loading location:', error)
    uiStore.showError('Error al cargar la ubicación')
    router.push('/admin/locations')
  } finally {
    loadingLocation.value = false
  }
}

async function handleSubmit(data: CreateLocationDto | UpdateLocationDto) {
  loading.value = true

  try {
    if (isEditMode.value) {
      // Actualizar ubicación existente
      await locationsStore.updateLocation(locationId.value, data as UpdateLocationDto)
      uiStore.showSuccess('Ubicación actualizada correctamente')
    } else {
      // Crear nueva ubicación
      await locationsStore.createLocation(data as CreateLocationDto)
      uiStore.showSuccess('Ubicación creada correctamente')
    }

    // Redirigir a la lista de ubicaciones
    router.push('/admin/locations')
  } catch (error) {
    console.error('Error saving location:', error)
    uiStore.showError('Error al guardar la ubicación')
  } finally {
    loading.value = false
  }
}

function handleCancel() {
  router.push('/admin/locations')
}

// Cargar ubicación si estamos en modo edición
onMounted(async () => {
  if (isEditMode.value) {
    // Asegurarse de que las ubicaciones estén cargadas
    if (locationsStore.locations.length === 0) {
      await locationsStore.fetchLocations({ page: 1, pageSize: 100 })
    }
    await loadLocation()
  }
})
</script>

<template>
  <div class="admin-location-form-view">
    <!-- Breadcrumbs -->
    <v-breadcrumbs :items="breadcrumbs" class="px-0 pb-4">
      <template #divider>
        <v-icon>mdi-chevron-right</v-icon>
      </template>
    </v-breadcrumbs>

    <!-- Encabezado -->
    <div class="mb-6">
      <h1 class="text-h4 font-weight-bold mb-2">
        {{ pageTitle }}
      </h1>
      <p class="text-body-1 text-medium-emphasis">
        {{ isEditMode ? 'Modifica la información de la ubicación' : 'Completa el formulario para crear una nueva ubicación' }}
      </p>
    </div>

    <!-- Loading de la ubicación -->
    <v-card v-if="loadingLocation" class="pa-8">
      <div class="text-center">
        <v-progress-circular
          indeterminate
          color="primary"
          size="64"
        />
        <p class="text-body-1 text-medium-emphasis mt-4">
          Cargando ubicación...
        </p>
      </div>
    </v-card>

    <!-- Formulario -->
    <v-card v-else>
      <v-card-text class="pa-6">
        <LocationForm
          :location="location || undefined"
          :loading="loading"
          @submit="handleSubmit"
          @cancel="handleCancel"
        />
      </v-card-text>
    </v-card>

    <!-- Ayuda -->
    <v-alert
      type="info"
      variant="tonal"
      class="mt-6"
    >
      <template #prepend>
        <v-icon>mdi-information</v-icon>
      </template>
      <div class="text-body-2">
        <strong>Consejos:</strong>
        <ul class="mt-2">
          <li>Asegúrate de que el nombre sea descriptivo y fácil de identificar</li>
          <li>La dirección debe ser completa para facilitar la llegada de los asistentes</li>
          <li>Verifica que la capacidad sea realista para el espacio disponible</li>
          <li>Puedes desactivar ubicaciones temporalmente sin eliminarlas</li>
        </ul>
      </div>
    </v-alert>
  </div>
</template>

<style scoped lang="scss">
.admin-location-form-view {
  // Estilos específicos si son necesarios
}
</style>
