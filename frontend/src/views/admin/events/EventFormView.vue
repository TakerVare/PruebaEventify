<!--
  =============================================================================
  ADMIN EVENT FORM VIEW - Formulario de creación/edición de evento
  =============================================================================
  Vista de administración para crear o editar eventos.
  Utiliza el componente EventForm y maneja la lógica de guardado.
  =============================================================================
-->

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useEventsStore } from '@/stores/events'
import { useUiStore } from '@/stores/ui'
import EventForm from '@/components/events/EventForm.vue'
import type { Event, CreateEventDto, UpdateEventDto } from '@/types'

const router = useRouter()
const route = useRoute()
const { t } = useI18n()
const eventsStore = useEventsStore()
const uiStore = useUiStore()

// Estado
const loading = ref(false)
const loadingEvent = ref(false)
const event = ref<Event | null>(null)

// Computados
const isEditMode = computed(() => route.params.id !== 'new')
const eventId = computed(() => Number(route.params.id))

const pageTitle = computed(() => {
  return isEditMode.value ? 'Editar Evento' : 'Crear Evento'
})

const breadcrumbs = computed(() => [
  { title: 'Dashboard', to: '/admin/dashboard' },
  { title: 'Eventos', to: '/admin/events' },
  { title: pageTitle.value }
])

// Métodos
async function loadEvent() {
  if (!isEditMode.value) return

  loadingEvent.value = true

  try {
    const loadedEvent = await eventsStore.fetchEventById(eventId.value)
    if (loadedEvent) {
      event.value = loadedEvent
    } else {
      uiStore.showError('Evento no encontrado')
      router.push('/admin/events')
    }
  } catch (error) {
    console.error('Error loading event:', error)
    uiStore.showError('Error al cargar el evento')
    router.push('/admin/events')
  } finally {
    loadingEvent.value = false
  }
}

async function handleSubmit(data: CreateEventDto | UpdateEventDto) {
  loading.value = true

  try {
    if (isEditMode.value) {
      // Actualizar evento existente
      await eventsStore.updateEvent(eventId.value, data as UpdateEventDto)
      uiStore.showSuccess('Evento actualizado correctamente')
    } else {
      // Crear nuevo evento
      await eventsStore.createEvent(data as CreateEventDto)
      uiStore.showSuccess('Evento creado correctamente')
    }

    // Redirigir a la lista de eventos
    router.push('/admin/events')
  } catch (error) {
    console.error('Error saving event:', error)
    uiStore.showError('Error al guardar el evento')
  } finally {
    loading.value = false
  }
}

function handleCancel() {
  router.push('/admin/events')
}

// Cargar evento si estamos en modo edición
onMounted(async () => {
  if (isEditMode.value) {
    await loadEvent()
  }
})
</script>

<template>
  <div class="admin-event-form-view">
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
        {{ isEditMode ? 'Modifica la información del evento' : 'Completa el formulario para crear un nuevo evento' }}
      </p>
    </div>

    <!-- Loading del evento -->
    <v-card v-if="loadingEvent" class="pa-8">
      <div class="text-center">
        <v-progress-circular
          indeterminate
          color="primary"
          size="64"
        />
        <p class="text-body-1 text-medium-emphasis mt-4">
          Cargando evento...
        </p>
      </div>
    </v-card>

    <!-- Formulario -->
    <v-card v-else>
      <v-card-text class="pa-6">
        <EventForm
          :event="event || undefined"
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
          <li>Asegúrate de que el título sea descriptivo y atractivo</li>
          <li>La descripción debe incluir toda la información relevante del evento</li>
          <li>Verifica que la capacidad sea adecuada para la ubicación seleccionada</li>
          <li>Puedes guardar el evento como borrador y publicarlo más tarde</li>
        </ul>
      </div>
    </v-alert>
  </div>
</template>

<style scoped lang="scss">
.admin-event-form-view {
  // Estilos específicos si son necesarios
}
</style>
