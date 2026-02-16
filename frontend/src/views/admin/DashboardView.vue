<!--
  =============================================================================
  DASHBOARD VIEW - Panel de administración
  =============================================================================
  Vista principal del panel de administración con:
  - KPIs principales (eventos, usuarios, registros, ubicaciones)
  - Gráficas de estadísticas (Chart.js):
    * Eventos por categoría (Doughnut)
    * Registros por mes (Line)
    * Eventos por estado (Bar)
  - Eventos recientes
  - Acciones rápidas
  =============================================================================
-->

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import { useEventsStore } from '@/stores/events'
import { useUsersStore } from '@/stores/users'
import { useLocationsStore } from '@/stores/locations'
import { useRegistrationsStore } from '@/stores/registrations'
import { useCategoriesStore } from '@/stores/categories'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title } from 'chart.js'
import { Doughnut, Line, Bar } from 'vue-chartjs'

// Registrar componentes de Chart.js
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title
)

const router = useRouter()
const { t, d } = useI18n()
const authStore = useAuthStore()
const eventsStore = useEventsStore()
const usersStore = useUsersStore()
const locationsStore = useLocationsStore()
const registrationsStore = useRegistrationsStore()
const categoriesStore = useCategoriesStore()

// Estado
const loading = ref(true)

// KPIs computados
const kpis = computed(() => {
  return [
    {
      title: 'Total Eventos',
      value: eventsStore.events.length,
      icon: 'mdi-calendar-multiple',
      color: 'primary',
      change: '+12%',
      changePositive: true
    },
    {
      title: 'Usuarios Activos',
      value: usersStore.activeUsers.length,
      icon: 'mdi-account-group',
      color: 'success',
      change: '+8%',
      changePositive: true
    },
    {
      title: 'Registros Totales',
      value: registrationsStore.userRegistrations.length,
      icon: 'mdi-ticket-confirmation',
      color: 'info',
      change: '+23%',
      changePositive: true
    },
    {
      title: 'Ubicaciones',
      value: locationsStore.locations.length,
      icon: 'mdi-map-marker-multiple',
      color: 'warning',
      change: '+2',
      changePositive: true
    }
  ]
})

// Datos para gráficas
const eventsByCategoryData = computed(() => {
  const categories = categoriesStore.categories
  const data = categories.map(cat => {
    return eventsStore.events.filter(e => e.category?.id === cat.id).length
  })

  return {
    labels: categories.map(c => c.name),
    datasets: [
      {
        label: 'Eventos',
        data: data,
        backgroundColor: categories.map(c => c.color),
        borderWidth: 2,
        borderColor: '#fff'
      }
    ]
  }
})

const registrationsByMonthData = computed(() => {
  // Simulación de datos por mes (últimos 6 meses)
  const months = ['Ago', 'Sep', 'Oct', 'Nov', 'Dic', 'Ene']
  const data = [45, 52, 61, 58, 72, 84]

  return {
    labels: months,
    datasets: [
      {
        label: 'Registros',
        data: data,
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  }
})

const eventsByStatusData = computed(() => {
  const statuses = ['Published', 'Draft', 'Cancelled', 'Completed']
  const data = statuses.map(status => {
    return eventsStore.events.filter(e => e.status === status).length
  })

  return {
    labels: ['Publicados', 'Borradores', 'Cancelados', 'Completados'],
    datasets: [
      {
        label: 'Eventos',
        data: data,
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(251, 191, 36, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(59, 130, 246, 0.8)'
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(251, 191, 36)',
          'rgb(239, 68, 68)',
          'rgb(59, 130, 246)'
        ],
        borderWidth: 2
      }
    ]
  }
})

// Opciones de gráficas
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const
    }
  }
}

// Eventos recientes
const recentEvents = computed(() => {
  return eventsStore.events.slice(0, 5)
})

// Métodos
async function loadDashboardData() {
  loading.value = true

  try {
    await Promise.all([
      eventsStore.fetchEvents({ page: 1, pageSize: 100 }),
      usersStore.fetchUsers({ page: 1, pageSize: 100 }),
      locationsStore.fetchLocations({ page: 1, pageSize: 100 }),
      categoriesStore.fetchCategories()
    ])
  } catch (error) {
    console.error('Error loading dashboard data:', error)
  } finally {
    loading.value = false
  }
}

function formatDate(date: string): string {
  return d(new Date(date), 'short')
}

// Cargar datos al montar
onMounted(async () => {
  await loadDashboardData()
})
</script>

<template>
  <div class="dashboard-view">
    <!-- Encabezado -->
    <div class="mb-6">
      <h1 class="text-h4 font-weight-bold mb-2">
        Dashboard
      </h1>
      <p class="text-body-1 text-medium-emphasis">
        Bienvenido de nuevo, {{ authStore.fullName }}
      </p>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-12">
      <v-progress-circular
        indeterminate
        color="primary"
        size="64"
      />
    </div>

    <div v-else>
      <!-- KPIs -->
      <v-row class="mb-6">
        <v-col
          v-for="(kpi, index) in kpis"
          :key="index"
          cols="12"
          sm="6"
          md="3"
        >
          <v-card>
            <v-card-text>
              <div class="d-flex justify-space-between align-start mb-2">
                <div>
                  <div class="text-body-2 text-medium-emphasis mb-1">
                    {{ kpi.title }}
                  </div>
                  <div class="text-h4 font-weight-bold">
                    {{ kpi.value }}
                  </div>
                </div>
                <v-avatar :color="kpi.color" size="48">
                  <v-icon color="white" size="24">{{ kpi.icon }}</v-icon>
                </v-avatar>
              </div>

              <div class="d-flex align-center">
                <v-icon
                  :color="kpi.changePositive ? 'success' : 'error'"
                  size="small"
                  class="mr-1"
                >
                  {{ kpi.changePositive ? 'mdi-trending-up' : 'mdi-trending-down' }}
                </v-icon>
                <span
                  class="text-body-2"
                  :class="kpi.changePositive ? 'text-success' : 'text-error'"
                >
                  {{ kpi.change }}
                </span>
                <span class="text-body-2 text-medium-emphasis ml-1">
                  vs mes anterior
                </span>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Gráficas -->
      <v-row class="mb-6">
        <!-- Eventos por categoría -->
        <v-col cols="12" md="4">
          <v-card>
            <v-card-title>
              <v-icon start>mdi-chart-donut</v-icon>
              Eventos por Categoría
            </v-card-title>
            <v-divider />
            <v-card-text>
              <div style="height: 300px">
                <Doughnut
                  :data="eventsByCategoryData"
                  :options="chartOptions"
                />
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Registros por mes -->
        <v-col cols="12" md="8">
          <v-card>
            <v-card-title>
              <v-icon start>mdi-chart-line</v-icon>
              Registros Mensuales
            </v-card-title>
            <v-divider />
            <v-card-text>
              <div style="height: 300px">
                <Line
                  :data="registrationsByMonthData"
                  :options="chartOptions"
                />
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Eventos por estado -->
        <v-col cols="12" md="12">
          <v-card>
            <v-card-title>
              <v-icon start>mdi-chart-bar</v-icon>
              Eventos por Estado
            </v-card-title>
            <v-divider />
            <v-card-text>
              <div style="height: 300px">
                <Bar
                  :data="eventsByStatusData"
                  :options="chartOptions"
                />
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Eventos recientes y acciones rápidas -->
      <v-row>
        <!-- Eventos recientes -->
        <v-col cols="12" md="8">
          <v-card>
            <v-card-title class="d-flex justify-space-between align-center">
              <span>
                <v-icon start>mdi-calendar-clock</v-icon>
                Eventos Recientes
              </span>
              <v-btn
                variant="text"
                color="primary"
                size="small"
                @click="router.push('/admin/events')"
              >
                Ver Todos
              </v-btn>
            </v-card-title>

            <v-divider />

            <v-list>
              <template v-for="(event, index) in recentEvents" :key="event.id">
                <v-list-item
                  :to="`/events/${event.id}`"
                  :prepend-avatar="event.imageUrl"
                >
                  <v-list-item-title>{{ event.title }}</v-list-item-title>
                  <v-list-item-subtitle>
                    <v-icon size="small" class="mr-1">mdi-calendar</v-icon>
                    {{ formatDate(event.startDate) }}
                    •
                    <v-icon size="small" class="mr-1">mdi-account-group</v-icon>
                    {{ event.registeredCount }}/{{ event.capacity }}
                  </v-list-item-subtitle>

                  <template #append>
                    <v-chip
                      :color="event.status === 'Published' ? 'success' : 'warning'"
                      size="small"
                    >
                      {{ event.status }}
                    </v-chip>
                  </template>
                </v-list-item>

                <v-divider v-if="index < recentEvents.length - 1" />
              </template>
            </v-list>
          </v-card>
        </v-col>

        <!-- Acciones rápidas -->
        <v-col cols="12" md="4">
          <v-card>
            <v-card-title>
              <v-icon start>mdi-lightning-bolt</v-icon>
              Acciones Rápidas
            </v-card-title>

            <v-divider />

            <v-card-text>
              <div class="d-flex flex-column ga-2">
                <v-btn
                  color="primary"
                  size="large"
                  prepend-icon="mdi-plus"
                  block
                  @click="router.push('/admin/events/new')"
                >
                  Crear Evento
                </v-btn>

                <v-btn
                  color="secondary"
                  variant="outlined"
                  size="large"
                  prepend-icon="mdi-map-marker-plus"
                  block
                  @click="router.push('/admin/locations/new')"
                >
                  Añadir Ubicación
                </v-btn>

                <v-btn
                  v-if="authStore.isAdmin"
                  color="info"
                  variant="outlined"
                  size="large"
                  prepend-icon="mdi-account-plus"
                  block
                  @click="router.push('/admin/users')"
                >
                  Gestionar Usuarios
                </v-btn>

                <v-divider class="my-2" />

                <v-btn
                  variant="outlined"
                  prepend-icon="mdi-view-list"
                  block
                  @click="router.push('/admin/events')"
                >
                  Ver Todos los Eventos
                </v-btn>

                <v-btn
                  variant="outlined"
                  prepend-icon="mdi-map-marker-multiple"
                  block
                  @click="router.push('/admin/locations')"
                >
                  Ver Ubicaciones
                </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<style scoped lang="scss">
.dashboard-view {
  // Estilos específicos si son necesarios
}
</style>
