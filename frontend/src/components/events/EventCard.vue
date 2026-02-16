<!--
  =============================================================================
  EVENT CARD - Tarjeta de evento
  =============================================================================
  Componente reutilizable para mostrar la información de un evento en formato
  card. Usado en listados, home, etc.

  Props:
  - event: Objeto del evento a mostrar
  - compact: Versión compacta de la card (opcional)
  =============================================================================
-->

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import type { Event, EventSummary } from '@/types'

// Props
interface Props {
  event: Event | EventSummary
  compact?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  compact: false
})

const router = useRouter()
const { t, d } = useI18n()

// Computados
const eventDate = computed(() => {
  return d(new Date(props.event.startDate), 'short')
})

const spotsAvailable = computed(() => {
  return props.event.capacity - props.event.registeredCount
})

const isFull = computed(() => {
  return spotsAvailable.value <= 0
})

const statusColor = computed(() => {
  switch (props.event.status) {
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
function goToDetail() {
  router.push(`/events/${props.event.id}`)
}
</script>

<template>
  <v-card
    class="event-card"
    :class="{ 'event-card--compact': compact }"
    hover
    @click="goToDetail"
  >
    <!-- Imagen del evento -->
    <v-img
      :src="event.imageUrl || 'https://via.placeholder.com/400x200?text=No+Image'"
      :height="compact ? 150 : 200"
      cover
    >
      <!-- Chip de categoría sobre la imagen -->
      <div class="pa-2 d-flex justify-space-between">
        <v-chip
          v-if="event.category"
          :color="event.category.color"
          size="small"
          :prepend-icon="event.category.icon"
        >
          {{ event.category.name }}
        </v-chip>

        <!-- Chip de estado (solo si no es Published) -->
        <v-chip
          v-if="event.status !== 'Published'"
          :color="statusColor"
          size="small"
        >
          {{ t(`events.status.${event.status.toLowerCase()}`) }}
        </v-chip>
      </div>
    </v-img>

    <v-card-text>
      <!-- Título -->
      <h3 class="text-h6 mb-2 text-truncate">
        {{ event.title }}
      </h3>

      <!-- Descripción (solo si no es compact) -->
      <p
        v-if="!compact"
        class="text-body-2 text-medium-emphasis mb-3 text-clamp"
      >
        {{ event.description }}
      </p>

      <!-- Información del evento -->
      <div class="event-info">
        <!-- Fecha -->
        <div class="d-flex align-center mb-2">
          <v-icon size="small" class="mr-2">mdi-calendar</v-icon>
          <span class="text-body-2">{{ eventDate }}</span>
        </div>

        <!-- Ubicación -->
        <div v-if="event.location" class="d-flex align-center mb-2">
          <v-icon size="small" class="mr-2">mdi-map-marker</v-icon>
          <span class="text-body-2 text-truncate">{{ event.location.name }}</span>
        </div>

        <!-- Plazas disponibles -->
        <div class="d-flex align-center">
          <v-icon size="small" class="mr-2">mdi-account-group</v-icon>
          <span class="text-body-2">
            {{ event.registeredCount }} / {{ event.capacity }}
          </span>
          <v-chip
            v-if="isFull"
            color="error"
            size="x-small"
            class="ml-2"
          >
            {{ t('events.details.noSpots') }}
          </v-chip>
          <v-chip
            v-else-if="spotsAvailable <= 10"
            color="warning"
            size="x-small"
            class="ml-2"
          >
            {{ t('events.details.availableSpots', { count: spotsAvailable }) }}
          </v-chip>
        </div>
      </div>
    </v-card-text>

    <!-- Acciones (solo si no es compact) -->
    <v-card-actions v-if="!compact">
      <v-btn
        color="primary"
        variant="text"
        @click.stop="goToDetail"
      >
        {{ t('general.details') }}
        <v-icon end>mdi-arrow-right</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<style scoped lang="scss">
.event-card {
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-4px);
  }

  &--compact {
    .v-card-text {
      padding: 12px;
    }
  }
}

.event-info {
  .v-icon {
    color: rgb(var(--v-theme-primary));
  }
}

.text-clamp {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
