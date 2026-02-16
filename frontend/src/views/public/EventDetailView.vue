<!--
  =============================================================================
  EVENT DETAIL VIEW - Vista de detalle de evento
  =============================================================================
  Vista pública que muestra toda la información de un evento específico:
  - Información completa del evento
  - Imagen destacada
  - Categoría, ubicación, fechas, capacidad
  - Descripción detallada
  - Organizador del evento
  - Botón de registro/cancelación
  - Información de registro del usuario
  - Acciones de administración (editar/eliminar) si es el creador o admin
  =============================================================================
-->

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import { useEventsStore } from '@/stores/events'
import { useRegistrationsStore } from '@/stores/registrations'
import { useUiStore } from '@/stores/ui'
import type { Event } from '@/types'

const router = useRouter()
const route = useRoute()
const { t, d } = useI18n()
const authStore = useAuthStore()
const eventsStore = useEventsStore()
const registrationsStore = useRegistrationsStore()
const uiStore = useUiStore()

// Estado
const loading = ref(true)
const event = ref<Event | null>(null)
const registering = ref(false)
const showConfirmDialog = ref(false)
const actionType = ref<'register' | 'cancel' | 'delete'>('register')

// Computados
const eventId = computed(() => Number(route.params.id))

const eventDate = computed(() => {
  if (!event.value) return ''
  return d(new Date(event.value.startDate), 'long')
})

const eventTime = computed(() => {
  if (!event.value) return ''
  const start = new Date(event.value.startDate)
  const end = new Date(event.value.endDate)
  return `${start.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })} - ${end.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`
})

const spotsAvailable = computed(() => {
  if (!event.value) return 0
  return event.value.capacity - event.value.registeredCount
})

const isFull = computed(() => spotsAvailable.value <= 0)

const isUserRegistered = computed(() => {
  if (!event.value || !authStore.isAuthenticated) return false
  return eventsStore.isUserRegistered(event.value.id)
})

const canRegister = computed(() => {
  return (
    authStore.isAuthenticated &&
    !isUserRegistered.value &&
    !isFull.value &&
    event.value?.status === 'Published'
  )
})

const canEdit = computed(() => {
  if (!event.value || !authStore.isAuthenticated) return false
  return (
    authStore.isAdmin ||
    (authStore.isOrganizer && event.value.organizer?.id === authStore.user?.id)
  )
})

const statusColor = computed(() => {
  if (!event.value) return 'grey'
  switch (event.value.status) {
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
})

// Métodos
async function loadEvent() {
  loading.value = true

  try {
    const loadedEvent = await eventsStore.fetchEventById(eventId.value)
    if (loadedEvent) {
      event.value = loadedEvent
    } else {
      uiStore.showError('Evento no encontrado')
      router.push('/events')
    }
  } catch (error) {
    console.error('Error loading event:', error)
    uiStore.showError('Error al cargar el evento')
    router.push('/events')
  } finally {
    loading.value = false
  }
}

function openConfirmDialog(action: 'register' | 'cancel' | 'delete') {
  actionType.value = action
  showConfirmDialog.value = true
}

async function handleRegister() {
  if (!event.value) return

  registering.value = true

  try {
    await registrationsStore.registerForEvent(event.value.id)
    uiStore.showSuccess('¡Te has registrado exitosamente!')

    // Recargar el evento para actualizar el contador
    await loadEvent()
  } catch (error) {
    console.error('Error registering for event:', error)
    uiStore.showError('Error al registrarse en el evento')
  } finally {
    registering.value = false
    showConfirmDialog.value = false
  }
}

async function handleCancelRegistration() {
  if (!event.value) return

  registering.value = true

  try {
    await registrationsStore.cancelRegistration(event.value.id)
    uiStore.showSuccess('Has cancelado tu registro')

    // Recargar el evento
    await loadEvent()
  } catch (error) {
    console.error('Error cancelling registration:', error)
    uiStore.showError('Error al cancelar el registro')
  } finally {
    registering.value = false
    showConfirmDialog.value = false
  }
}

async function handleDelete() {
  if (!event.value) return

  try {
    await eventsStore.deleteEvent(event.value.id)
    uiStore.showSuccess('Evento eliminado correctamente')
    router.push('/admin/events')
  } catch (error) {
    console.error('Error deleting event:', error)
    uiStore.showError('Error al eliminar el evento')
  } finally {
    showConfirmDialog.value = false
  }
}

function handleEdit() {
  if (!event.value) return
  router.push(`/admin/events/${event.value.id}/edit`)
}

function handleShare() {
  if (!event.value) return

  // Copiar URL al portapapeles
  const url = window.location.href
  navigator.clipboard.writeText(url)
  uiStore.showSuccess('Enlace copiado al portapapeles')
}

// Cargar evento al montar
onMounted(async () => {
  await loadEvent()
})
</script>

<template>
  <div class="event-detail-view">
    <!-- Loading -->
    <v-container v-if="loading" class="py-8">
      <v-skeleton-loader type="article, article" />
    </v-container>

    <!-- Contenido del evento -->
    <div v-else-if="event">
      <!-- Imagen destacada -->
      <v-img
        :src="event.imageUrl || 'https://via.placeholder.com/1200x400?text=Event+Image'"
        height="400"
        cover
        class="event-hero-image"
      >
        <div class="image-overlay">
          <v-container>
            <v-btn
              icon="mdi-arrow-left"
              color="white"
              @click="router.back()"
            />
          </v-container>
        </div>
      </v-img>

      <v-container class="py-8">
        <v-row>
          <!-- Columna principal (info del evento) -->
          <v-col cols="12" md="8">
            <!-- Categoría y estado -->
            <div class="d-flex ga-2 mb-4">
              <v-chip
                v-if="event.category"
                :color="event.category.color"
                :prepend-icon="event.category.icon"
              >
                {{ event.category.name }}
              </v-chip>

              <v-chip
                :color="statusColor"
              >
                {{ t(`events.status.${event.status.toLowerCase()}`) }}
              </v-chip>
            </div>

            <!-- Título -->
            <h1 class="text-h3 font-weight-bold mb-4">
              {{ event.title }}
            </h1>

            <!-- Info básica -->
            <div class="event-info mb-6">
              <!-- Fecha -->
              <div class="info-item">
                <v-icon color="primary" size="large" class="mr-3">
                  mdi-calendar
                </v-icon>
                <div>
                  <div class="text-body-1 font-weight-medium">{{ eventDate }}</div>
                  <div class="text-body-2 text-medium-emphasis">{{ eventTime }}</div>
                </div>
              </div>

              <!-- Ubicación -->
              <div v-if="event.location" class="info-item">
                <v-icon color="primary" size="large" class="mr-3">
                  mdi-map-marker
                </v-icon>
                <div>
                  <div class="text-body-1 font-weight-medium">{{ event.location.name }}</div>
                  <div class="text-body-2 text-medium-emphasis">
                    {{ event.location.address }}
                  </div>
                </div>
              </div>

              <!-- Capacidad -->
              <div class="info-item">
                <v-icon color="primary" size="large" class="mr-3">
                  mdi-account-group
                </v-icon>
                <div>
                  <div class="text-body-1 font-weight-medium">
                    {{ event.registeredCount }} / {{ event.capacity }} asistentes
                  </div>
                  <div class="text-body-2 text-medium-emphasis">
                    <span v-if="isFull" class="text-error">
                      Sin plazas disponibles
                    </span>
                    <span v-else-if="spotsAvailable <= 10" class="text-warning">
                      Solo {{ spotsAvailable }} plazas disponibles
                    </span>
                    <span v-else class="text-success">
                      {{ spotsAvailable }} plazas disponibles
                    </span>
                  </div>
                </div>
              </div>

              <!-- Organizador -->
              <div v-if="event.organizer" class="info-item">
                <v-icon color="primary" size="large" class="mr-3">
                  mdi-account-circle
                </v-icon>
                <div>
                  <div class="text-body-2 text-medium-emphasis">Organizado por</div>
                  <div class="text-body-1 font-weight-medium">
                    {{ event.organizer.firstName }} {{ event.organizer.lastName }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Descripción -->
            <v-divider class="my-6" />

            <div class="event-description">
              <h2 class="text-h5 font-weight-bold mb-4">
                Descripción
              </h2>
              <p class="text-body-1" style="white-space: pre-line">
                {{ event.description }}
              </p>
            </div>
          </v-col>

          <!-- Sidebar (acciones) -->
          <v-col cols="12" md="4">
            <v-card class="sticky-card">
              <v-card-text>
                <!-- Precio (si aplica) -->
                <div class="text-center mb-4">
                  <div class="text-h4 font-weight-bold text-primary">
                    Gratis
                  </div>
                </div>

                <v-divider class="mb-4" />

                <!-- Estado de registro del usuario -->
                <v-alert
                  v-if="isUserRegistered"
                  type="success"
                  variant="tonal"
                  class="mb-4"
                >
                  <div class="text-body-2">
                    <v-icon start>mdi-check-circle</v-icon>
                    Ya estás registrado en este evento
                  </div>
                </v-alert>

                <v-alert
                  v-else-if="!authStore.isAuthenticated"
                  type="info"
                  variant="tonal"
                  class="mb-4"
                >
                  <div class="text-body-2">
                    Inicia sesión para registrarte en este evento
                  </div>
                </v-alert>

                <v-alert
                  v-else-if="isFull"
                  type="error"
                  variant="tonal"
                  class="mb-4"
                >
                  <div class="text-body-2">
                    Este evento está completo
                  </div>
                </v-alert>

                <!-- Botones de acción -->
                <div class="d-flex flex-column ga-2">
                  <!-- Registrarse -->
                  <v-btn
                    v-if="canRegister"
                    color="primary"
                    size="x-large"
                    prepend-icon="mdi-ticket"
                    block
                    :loading="registering"
                    @click="openConfirmDialog('register')"
                  >
                    Registrarse
                  </v-btn>

                  <!-- Cancelar registro -->
                  <v-btn
                    v-if="isUserRegistered"
                    color="error"
                    variant="outlined"
                    size="large"
                    prepend-icon="mdi-close-circle"
                    block
                    :loading="registering"
                    @click="openConfirmDialog('cancel')"
                  >
                    Cancelar Registro
                  </v-btn>

                  <!-- Login para registrarse -->
                  <v-btn
                    v-if="!authStore.isAuthenticated && !isFull"
                    color="primary"
                    size="x-large"
                    prepend-icon="mdi-login"
                    block
                    @click="router.push({ path: '/login', query: { redirect: $route.fullPath } })"
                  >
                    Iniciar Sesión
                  </v-btn>

                  <!-- Compartir -->
                  <v-btn
                    variant="outlined"
                    size="large"
                    prepend-icon="mdi-share-variant"
                    block
                    @click="handleShare"
                  >
                    Compartir
                  </v-btn>

                  <!-- Acciones de administración -->
                  <template v-if="canEdit">
                    <v-divider class="my-2" />

                    <v-btn
                      color="primary"
                      variant="outlined"
                      prepend-icon="mdi-pencil"
                      block
                      @click="handleEdit"
                    >
                      Editar Evento
                    </v-btn>

                    <v-btn
                      color="error"
                      variant="outlined"
                      prepend-icon="mdi-delete"
                      block
                      @click="openConfirmDialog('delete')"
                    >
                      Eliminar Evento
                    </v-btn>
                  </template>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </div>

    <!-- Diálogo de confirmación -->
    <v-dialog v-model="showConfirmDialog" max-width="500">
      <v-card>
        <v-card-title class="text-h5">
          <span v-if="actionType === 'register'">Confirmar Registro</span>
          <span v-else-if="actionType === 'cancel'">Cancelar Registro</span>
          <span v-else>Eliminar Evento</span>
        </v-card-title>

        <v-card-text>
          <p v-if="actionType === 'register'">
            ¿Confirmas que deseas registrarte en este evento?
          </p>
          <p v-else-if="actionType === 'cancel'">
            ¿Estás seguro de que deseas cancelar tu registro? Esta acción no se puede deshacer.
          </p>
          <p v-else>
            ¿Estás seguro de que deseas eliminar este evento? Esta acción no se puede deshacer.
          </p>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn
            variant="text"
            @click="showConfirmDialog = false"
          >
            Cancelar
          </v-btn>
          <v-btn
            v-if="actionType === 'register'"
            color="primary"
            :loading="registering"
            @click="handleRegister"
          >
            Confirmar
          </v-btn>
          <v-btn
            v-else-if="actionType === 'cancel'"
            color="error"
            :loading="registering"
            @click="handleCancelRegistration"
          >
            Cancelar Registro
          </v-btn>
          <v-btn
            v-else
            color="error"
            @click="handleDelete"
          >
            Eliminar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped lang="scss">
.event-detail-view {
  .event-hero-image {
    position: relative;

    .image-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      background: linear-gradient(
        to bottom,
        rgba(0, 0, 0, 0.5) 0%,
        rgba(0, 0, 0, 0) 100%
      );
      padding: 16px 0;
    }
  }

  .event-info {
    .info-item {
      display: flex;
      align-items: flex-start;
      margin-bottom: 24px;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }

  .sticky-card {
    position: sticky;
    top: 80px;
  }
}
</style>
