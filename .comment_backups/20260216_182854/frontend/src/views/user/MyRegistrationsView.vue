<!--
  =============================================================================
  MY REGISTRATIONS VIEW - Vista de mis registros
  =============================================================================
  Vista privada donde el usuario puede:
  - Ver todos sus registros a eventos
  - Filtrar por estado (próximos, pasados, cancelados)
  - Ver detalles del evento
  - Cancelar registros
  - Ver estado de asistencia
  =============================================================================
-->

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useRegistrationsStore } from '@/stores/registrations'
import { useUiStore } from '@/stores/ui'
import EventCard from '@/components/events/EventCard.vue'

const router = useRouter()
const { t, d } = useI18n()
const registrationsStore = useRegistrationsStore()
const uiStore = useUiStore()

// Estado
const loading = ref(true)
const filter = ref<'all' | 'upcoming' | 'past' | 'cancelled'>('upcoming')
const showCancelDialog = ref(false)
const selectedRegistrationId = ref<number | null>(null)
const cancelling = ref(false)

// Computados
const filteredRegistrations = computed(() => {
  switch (filter.value) {
    case 'upcoming':
      return registrationsStore.activeRegistrations
    case 'past':
      return registrationsStore.pastRegistrations
    case 'cancelled':
      return registrationsStore.userRegistrations.filter(r => r.status === 'Cancelled')
    default:
      return registrationsStore.userRegistrations
  }
})

const stats = computed(() => {
  const all = registrationsStore.userRegistrations
  return {
    total: all.length,
    upcoming: registrationsStore.activeRegistrations.length,
    past: registrationsStore.pastRegistrations.length,
    cancelled: all.filter(r => r.status === 'Cancelled').length
  }
})

const filterTabs = computed(() => [
  { value: 'upcoming', title: 'Próximos', count: stats.value.upcoming, icon: 'mdi-calendar-clock' },
  { value: 'past', title: 'Pasados', count: stats.value.past, icon: 'mdi-calendar-check' },
  { value: 'cancelled', title: 'Cancelados', count: stats.value.cancelled, icon: 'mdi-calendar-remove' },
  { value: 'all', title: 'Todos', count: stats.value.total, icon: 'mdi-calendar-multiple' }
])

// Métodos
function getStatusColor(status: string): string {
  switch (status) {
    case 'Confirmed':
      return 'success'
    case 'Pending':
      return 'warning'
    case 'Cancelled':
      return 'error'
    case 'Attended':
      return 'info'
    case 'NoShow':
      return 'grey'
    default:
      return 'grey'
  }
}

function getStatusIcon(status: string): string {
  switch (status) {
    case 'Confirmed':
      return 'mdi-check-circle'
    case 'Pending':
      return 'mdi-clock-outline'
    case 'Cancelled':
      return 'mdi-close-circle'
    case 'Attended':
      return 'mdi-account-check'
    case 'NoShow':
      return 'mdi-account-cancel'
    default:
      return 'mdi-help-circle'
  }
}

function formatRegistrationDate(date: string): string {
  return d(new Date(date), 'short')
}

function openCancelDialog(registrationId: number) {
  selectedRegistrationId.value = registrationId
  showCancelDialog.value = true
}

async function confirmCancel() {
  if (!selectedRegistrationId.value) return

  cancelling.value = true

  try {
    const registration = registrationsStore.userRegistrations.find(
      r => r.id === selectedRegistrationId.value
    )

    if (registration) {
      await registrationsStore.cancelRegistration(registration.event.id)
      uiStore.showSuccess('Registro cancelado correctamente')
    }
  } catch (error) {
    console.error('Error cancelling registration:', error)
    uiStore.showError('Error al cancelar el registro')
  } finally {
    cancelling.value = false
    showCancelDialog.value = false
    selectedRegistrationId.value = null
  }
}

// Cargar registros al montar
onMounted(async () => {
  loading.value = true

  try {
    await registrationsStore.fetchUserRegistrations()
  } catch (error) {
    console.error('Error loading registrations:', error)
    uiStore.showError('Error al cargar los registros')
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <v-container class="my-registrations-view py-8">
    <!-- Encabezado -->
    <div class="mb-6">
      <h1 class="text-h4 font-weight-bold mb-2">
        Mis Registros
      </h1>
      <p class="text-body-1 text-medium-emphasis">
        Gestiona tus inscripciones a eventos
      </p>
    </div>

    <!-- Estadísticas rápidas -->
    <v-row class="mb-6">
      <v-col
        v-for="tab in filterTabs"
        :key="tab.value"
        cols="6"
        sm="3"
      >
        <v-card
          :color="filter === tab.value ? 'primary' : undefined"
          :variant="filter === tab.value ? 'flat' : 'outlined'"
          hover
          class="text-center pa-4 stat-card"
          @click="filter = tab.value"
        >
          <v-icon
            :color="filter === tab.value ? 'white' : 'primary'"
            size="32"
            class="mb-2"
          >
            {{ tab.icon }}
          </v-icon>
          <div
            class="text-h4 font-weight-bold mb-1"
            :class="filter === tab.value ? 'text-white' : ''"
          >
            {{ tab.count }}
          </div>
          <div
            class="text-caption"
            :class="filter === tab.value ? 'text-white' : 'text-medium-emphasis'"
          >
            {{ tab.title }}
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-12">
      <v-progress-circular
        indeterminate
        color="primary"
        size="64"
      />
    </div>

    <!-- Lista de registros -->
    <div v-else-if="filteredRegistrations.length > 0">
      <v-row>
        <v-col
          v-for="registration in filteredRegistrations"
          :key="registration.id"
          cols="12"
        >
          <v-card hover class="registration-card">
            <v-row no-gutters>
              <!-- Imagen del evento -->
              <v-col cols="12" sm="4" md="3">
                <v-img
                  :src="registration.event.imageUrl || 'https://via.placeholder.com/300x200'"
                  height="200"
                  cover
                  class="rounded-s"
                />
              </v-col>

              <!-- Información del registro -->
              <v-col cols="12" sm="8" md="9">
                <v-card-text class="pa-4">
                  <div class="d-flex justify-space-between align-start mb-3">
                    <div>
                      <!-- Título del evento -->
                      <h3
                        class="text-h6 mb-2 cursor-pointer"
                        @click="router.push(`/events/${registration.event.id}`)"
                      >
                        {{ registration.event.title }}
                      </h3>

                      <!-- Categoría -->
                      <v-chip
                        v-if="registration.event.category"
                        :color="registration.event.category.color"
                        size="small"
                        class="mr-2"
                      >
                        {{ registration.event.category.name }}
                      </v-chip>

                      <!-- Estado del registro -->
                      <v-chip
                        :color="getStatusColor(registration.status)"
                        size="small"
                        :prepend-icon="getStatusIcon(registration.status)"
                      >
                        {{ t(`registrations.status.${registration.status.toLowerCase()}`) }}
                      </v-chip>
                    </div>
                  </div>

                  <!-- Información del evento -->
                  <v-row dense class="mb-3">
                    <v-col cols="12" sm="6">
                      <div class="d-flex align-center text-body-2 mb-2">
                        <v-icon size="small" class="mr-2">mdi-calendar</v-icon>
                        <span>{{ formatRegistrationDate(registration.event.startDate) }}</span>
                      </div>
                    </v-col>

                    <v-col cols="12" sm="6">
                      <div class="d-flex align-center text-body-2 mb-2">
                        <v-icon size="small" class="mr-2">mdi-map-marker</v-icon>
                        <span>{{ registration.event.location?.name }}</span>
                      </div>
                    </v-col>

                    <v-col cols="12">
                      <div class="d-flex align-center text-body-2 text-medium-emphasis">
                        <v-icon size="small" class="mr-2">mdi-ticket</v-icon>
                        <span>Registrado el {{ formatRegistrationDate(registration.registeredAt) }}</span>
                      </div>
                    </v-col>
                  </v-row>

                  <!-- Acciones -->
                  <div class="d-flex ga-2">
                    <v-btn
                      color="primary"
                      variant="outlined"
                      size="small"
                      prepend-icon="mdi-eye"
                      @click="router.push(`/events/${registration.event.id}`)"
                    >
                      Ver Evento
                    </v-btn>

                    <v-btn
                      v-if="registration.status === 'Confirmed' || registration.status === 'Pending'"
                      color="error"
                      variant="outlined"
                      size="small"
                      prepend-icon="mdi-close"
                      @click="openCancelDialog(registration.id)"
                    >
                      Cancelar
                    </v-btn>
                  </div>
                </v-card-text>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <!-- Mensaje si no hay registros -->
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
        <strong>No tienes registros {{ filter !== 'all' ? filterTabs.find(t => t.value === filter)?.title.toLowerCase() : '' }}</strong>
      </div>
      <div class="text-body-2 mt-2">
        Explora eventos y regístrate en los que te interesen.
      </div>
      <v-btn
        color="primary"
        variant="outlined"
        class="mt-4"
        prepend-icon="mdi-calendar-search"
        @click="router.push('/events')"
      >
        Explorar Eventos
      </v-btn>
    </v-alert>

    <!-- Diálogo de confirmación de cancelación -->
    <v-dialog v-model="showCancelDialog" max-width="500">
      <v-card>
        <v-card-title class="text-h5">
          Cancelar Registro
        </v-card-title>

        <v-card-text>
          <p>¿Estás seguro de que deseas cancelar tu registro a este evento?</p>
          <p class="text-body-2 text-medium-emphasis mt-2">
            Esta acción no se puede deshacer y perderás tu plaza en el evento.
          </p>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn
            variant="text"
            @click="showCancelDialog = false"
          >
            No, mantener registro
          </v-btn>
          <v-btn
            color="error"
            :loading="cancelling"
            @click="confirmCancel"
          >
            Sí, cancelar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<style scoped lang="scss">
.my-registrations-view {
  .stat-card {
    cursor: pointer;
    transition: transform 0.2s ease;

    &:hover {
      transform: translateY(-4px);
    }
  }

  .registration-card {
    transition: transform 0.2s ease, box-shadow 0.2s ease;

    &:hover {
      transform: translateY(-2px);
    }

    .cursor-pointer {
      cursor: pointer;
      transition: color 0.2s ease;

      &:hover {
        color: rgb(var(--v-theme-primary));
      }
    }
  }
}
</style>
