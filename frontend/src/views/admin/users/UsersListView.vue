<!--
  =============================================================================
  ADMIN USERS LIST VIEW - Lista de usuarios (Administración)
  =============================================================================
  Vista de administración (solo Admin) que muestra todos los usuarios con:
  - Tabla de datos con paginación
  - Filtros por rol y estado
  - Acciones de administración (cambiar rol, activar/desactivar)
  - Estadísticas por rol
  =============================================================================
-->

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUsersStore } from '@/stores/users'
import { useUiStore } from '@/stores/ui'
import { usePagination } from '@/composables/usePagination'
import type { User, UserRole } from '@/types'

const { t, d } = useI18n()
const usersStore = useUsersStore()
const uiStore = useUiStore()

// Estado
const loading = ref(true)
const search = ref('')
const roleFilter = ref<UserRole | 'all'>('all')
const statusFilter = ref<'all' | 'active' | 'inactive'>('all')
const showRoleDialog = ref(false)
const userToEdit = ref<User | null>(null)
const newRole = ref<UserRole>('User')
const changingRole = ref(false)

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
const filteredUsers = computed(() => {
  let filtered = usersStore.users

  // Filtrar por búsqueda
  if (search.value) {
    const searchLower = search.value.toLowerCase()
    filtered = filtered.filter(
      u =>
        u.firstName.toLowerCase().includes(searchLower) ||
        u.lastName.toLowerCase().includes(searchLower) ||
        u.email.toLowerCase().includes(searchLower)
    )
  }

  // Filtrar por rol
  if (roleFilter.value !== 'all') {
    filtered = filtered.filter(u => u.role === roleFilter.value)
  }

  // Filtrar por estado
  if (statusFilter.value === 'active') {
    filtered = filtered.filter(u => u.isActive)
  } else if (statusFilter.value === 'inactive') {
    filtered = filtered.filter(u => !u.isActive)
  }

  updateTotalCount(filtered.length)
  return filtered
})

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredUsers.value.slice(start, end)
})

const roleOptions = [
  { value: 'all', title: 'Todos' },
  { value: 'Admin', title: 'Administradores' },
  { value: 'Organizer', title: 'Organizadores' },
  { value: 'User', title: 'Usuarios' }
]

const statusOptions = [
  { value: 'all', title: 'Todos' },
  { value: 'active', title: 'Activos' },
  { value: 'inactive', title: 'Inactivos' }
]

const roleChangeOptions = [
  { value: 'User', title: 'Usuario', icon: 'mdi-account' },
  { value: 'Organizer', title: 'Organizador', icon: 'mdi-calendar-star' },
  { value: 'Admin', title: 'Administrador', icon: 'mdi-shield-account' }
]

// Headers de la tabla
const headers = [
  { title: 'Usuario', key: 'name', sortable: true },
  { title: 'Email', key: 'email', sortable: true },
  { title: 'Rol', key: 'role', sortable: true },
  { title: 'Fecha registro', key: 'createdAt', sortable: true },
  { title: 'Estado', key: 'isActive', sortable: true },
  { title: 'Acciones', key: 'actions', sortable: false, align: 'end' }
]

// Métodos
function getRoleColor(role: UserRole): string {
  switch (role) {
    case 'Admin':
      return 'error'
    case 'Organizer':
      return 'primary'
    case 'User':
    default:
      return 'secondary'
  }
}

function getRoleIcon(role: UserRole): string {
  switch (role) {
    case 'Admin':
      return 'mdi-shield-account'
    case 'Organizer':
      return 'mdi-calendar-star'
    case 'User':
    default:
      return 'mdi-account'
  }
}

function formatDate(date: string): string {
  return d(new Date(date), 'short')
}

function openRoleDialog(user: User) {
  userToEdit.value = user
  newRole.value = user.role
  showRoleDialog.value = true
}

async function confirmRoleChange() {
  if (!userToEdit.value) return

  changingRole.value = true

  try {
    await usersStore.changeUserRole(userToEdit.value.id, newRole.value)
    uiStore.showSuccess('Rol actualizado correctamente')
  } catch (error) {
    console.error('Error changing role:', error)
    uiStore.showError('Error al cambiar el rol del usuario')
  } finally {
    changingRole.value = false
    showRoleDialog.value = false
    userToEdit.value = null
  }
}

async function toggleActive(user: User) {
  try {
    if (user.isActive) {
      await usersStore.deactivateUser(user.id)
      uiStore.showSuccess('Usuario desactivado')
    } else {
      await usersStore.activateUser(user.id)
      uiStore.showSuccess('Usuario activado')
    }
  } catch (error) {
    console.error('Error toggling active:', error)
    uiStore.showError('Error al cambiar el estado del usuario')
  }
}

async function loadUsers() {
  loading.value = true

  try {
    await usersStore.fetchUsers({ page: 1, pageSize: 100 })
  } catch (error) {
    console.error('Error loading users:', error)
    uiStore.showError('Error al cargar los usuarios')
  } finally {
    loading.value = false
  }
}

// Cargar usuarios al montar
onMounted(async () => {
  await loadUsers()
})
</script>

<template>
  <div class="admin-users-list-view">
    <!-- Encabezado -->
    <div class="mb-6">
      <h1 class="text-h4 font-weight-bold mb-2">
        Gestión de Usuarios
      </h1>
      <p class="text-body-1 text-medium-emphasis">
        Administra los usuarios de la plataforma
      </p>
    </div>

    <!-- Estadísticas rápidas -->
    <v-row class="mb-6">
      <v-col cols="12" sm="4">
        <v-card color="error" variant="tonal">
          <v-card-text class="text-center">
            <v-icon size="40" class="mb-2">mdi-shield-account</v-icon>
            <div class="text-h4 font-weight-bold">
              {{ usersStore.usersByRole.Admin }}
            </div>
            <div class="text-body-2">Administradores</div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="4">
        <v-card color="primary" variant="tonal">
          <v-card-text class="text-center">
            <v-icon size="40" class="mb-2">mdi-calendar-star</v-icon>
            <div class="text-h4 font-weight-bold">
              {{ usersStore.usersByRole.Organizer }}
            </div>
            <div class="text-body-2">Organizadores</div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="4">
        <v-card color="secondary" variant="tonal">
          <v-card-text class="text-center">
            <v-icon size="40" class="mb-2">mdi-account</v-icon>
            <div class="text-h4 font-weight-bold">
              {{ usersStore.usersByRole.User }}
            </div>
            <div class="text-body-2">Usuarios</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Filtros -->
    <v-card class="mb-6">
      <v-card-text>
        <v-row>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="search"
              label="Buscar usuarios"
              placeholder="Nombre, email..."
              prepend-inner-icon="mdi-magnify"
              clearable
              variant="outlined"
              density="comfortable"
            />
          </v-col>

          <v-col cols="12" sm="6" md="3">
            <v-select
              v-model="roleFilter"
              :items="roleOptions"
              label="Rol"
              variant="outlined"
              density="comfortable"
            />
          </v-col>

          <v-col cols="12" sm="6" md="2">
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

    <!-- Tabla de usuarios -->
    <v-card>
      <v-data-table
        :headers="headers"
        :items="paginatedUsers"
        :loading="loading"
        :items-per-page="pageSize"
        hide-default-footer
        class="elevation-1"
      >
        <!-- Usuario -->
        <template #item.name="{ item }">
          <div class="d-flex align-center">
            <v-avatar
              color="primary"
              size="40"
              class="mr-3"
            >
              <span class="text-white">
                {{ item.firstName.charAt(0) }}{{ item.lastName.charAt(0) }}
              </span>
            </v-avatar>
            <div>
              <div class="font-weight-medium">
                {{ item.firstName }} {{ item.lastName }}
              </div>
              <div class="text-caption text-medium-emphasis">
                ID: {{ item.id }}
              </div>
            </div>
          </div>
        </template>

        <!-- Rol -->
        <template #item.role="{ item }">
          <v-chip
            :color="getRoleColor(item.role)"
            :prepend-icon="getRoleIcon(item.role)"
            size="small"
          >
            {{ item.role }}
          </v-chip>
        </template>

        <!-- Fecha registro -->
        <template #item.createdAt="{ item }">
          {{ formatDate(item.createdAt) }}
        </template>

        <!-- Estado -->
        <template #item.isActive="{ item }">
          <v-chip
            :color="item.isActive ? 'success' : 'error'"
            size="small"
            :prepend-icon="item.isActive ? 'mdi-check-circle' : 'mdi-close-circle'"
          >
            {{ item.isActive ? 'Activo' : 'Inactivo' }}
          </v-chip>
        </template>

        <!-- Acciones -->
        <template #item.actions="{ item }">
          <div class="d-flex ga-1">
            <v-tooltip text="Cambiar rol">
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon="mdi-account-convert"
                  size="small"
                  variant="text"
                  color="primary"
                  @click="openRoleDialog(item)"
                />
              </template>
            </v-tooltip>

            <v-tooltip :text="item.isActive ? 'Desactivar' : 'Activar'">
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  :icon="item.isActive ? 'mdi-account-off' : 'mdi-account-check'"
                  size="small"
                  variant="text"
                  :color="item.isActive ? 'warning' : 'success'"
                  @click="toggleActive(item)"
                />
              </template>
            </v-tooltip>
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

    <!-- Diálogo de cambio de rol -->
    <v-dialog v-model="showRoleDialog" max-width="500">
      <v-card>
        <v-card-title class="text-h5">
          Cambiar Rol de Usuario
        </v-card-title>

        <v-card-text>
          <p class="mb-4">
            Usuario: <strong>{{ userToEdit?.firstName }} {{ userToEdit?.lastName }}</strong>
          </p>

          <v-select
            v-model="newRole"
            :items="roleChangeOptions"
            label="Nuevo rol"
            variant="outlined"
            density="comfortable"
          >
            <template #item="{ props, item }">
              <v-list-item v-bind="props">
                <template #prepend>
                  <v-icon :icon="item.raw.icon" />
                </template>
              </v-list-item>
            </template>
          </v-select>

          <v-alert
            type="warning"
            variant="tonal"
            density="compact"
            class="mt-4"
          >
            <div class="text-body-2">
              <strong>Importante:</strong> Cambiar el rol de un usuario modificará sus permisos en la plataforma.
            </div>
          </v-alert>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn
            variant="text"
            @click="showRoleDialog = false"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="primary"
            :loading="changingRole"
            :disabled="newRole === userToEdit?.role"
            @click="confirmRoleChange"
          >
            Cambiar Rol
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped lang="scss">
.admin-users-list-view {
  // Estilos específicos si son necesarios
}
</style>
