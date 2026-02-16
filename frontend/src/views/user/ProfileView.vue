<!--
  =============================================================================
  PROFILE VIEW - Vista de perfil de usuario
  =============================================================================
  Vista privada donde el usuario puede:
  - Ver su información personal
  - Editar su perfil (nombre, email)
  - Cambiar su contraseña
  - Ver estadísticas de su actividad
  =============================================================================
-->

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useForm } from 'vee-validate'
import { useAuthStore } from '@/stores/auth'
import { useRegistrationsStore } from '@/stores/registrations'
import { useUiStore } from '@/stores/ui'
import { useValidation } from '@/composables/useValidation'

const router = useRouter()
const { t } = useI18n()
const authStore = useAuthStore()
const registrationsStore = useRegistrationsStore()
const uiStore = useUiStore()
const { profileSchema, passwordChangeSchema } = useValidation()

// Estado
const editingProfile = ref(false)
const changingPassword = ref(false)
const savingProfile = ref(false)
const savingPassword = ref(false)

// Formulario de perfil
const {
  defineField: defineProfileField,
  handleSubmit: handleProfileSubmit,
  errors: profileErrors,
  resetForm: resetProfileForm
} = useForm({
  validationSchema: profileSchema,
  initialValues: {
    firstName: authStore.user?.firstName || '',
    lastName: authStore.user?.lastName || '',
    email: authStore.user?.email || ''
  }
})

const [firstName] = defineProfileField('firstName')
const [lastName] = defineProfileField('lastName')
const [email] = defineProfileField('email')

// Formulario de cambio de contraseña
const {
  defineField: definePasswordField,
  handleSubmit: handlePasswordSubmit,
  errors: passwordErrors,
  resetForm: resetPasswordForm
} = useForm({
  validationSchema: passwordChangeSchema
})

const [currentPassword] = definePasswordField('currentPassword')
const [newPassword] = definePasswordField('newPassword')
const [confirmNewPassword] = definePasswordField('confirmNewPassword')

// Computados
const userRole = computed(() => {
  if (authStore.isAdmin) return 'Administrador'
  if (authStore.isOrganizer) return 'Organizador'
  return 'Usuario'
})

const userStats = computed(() => {
  const registrations = registrationsStore.userRegistrations
  return {
    totalRegistrations: registrations.length,
    activeRegistrations: registrationsStore.activeRegistrations.length,
    pastRegistrations: registrationsStore.pastRegistrations.length,
    attendedEvents: registrations.filter(r => r.status === 'Attended').length
  }
})

// Métodos
function toggleEditProfile() {
  if (editingProfile.value) {
    // Cancelar edición - resetear valores
    resetProfileForm({
      values: {
        firstName: authStore.user?.firstName || '',
        lastName: authStore.user?.lastName || '',
        email: authStore.user?.email || ''
      }
    })
  }
  editingProfile.value = !editingProfile.value
}

const onProfileSubmit = handleProfileSubmit(async (values) => {
  savingProfile.value = true

  try {
    // Aquí se haría la llamada al backend para actualizar el perfil
    // Por ahora, solo mostramos un mensaje de éxito
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simular delay

    uiStore.showSuccess('Perfil actualizado correctamente')
    editingProfile.value = false

    // TODO: Actualizar el usuario en el store
    // await authStore.updateProfile(values)
  } catch (error) {
    console.error('Error updating profile:', error)
    uiStore.showError('Error al actualizar el perfil')
  } finally {
    savingProfile.value = false
  }
})

const onPasswordSubmit = handlePasswordSubmit(async (values) => {
  savingPassword.value = true

  try {
    // Aquí se haría la llamada al backend para cambiar la contraseña
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simular delay

    uiStore.showSuccess('Contraseña cambiada correctamente')
    changingPassword.value = false
    resetPasswordForm()

    // TODO: Implementar cambio de contraseña en el backend
    // await authService.changePassword(values)
  } catch (error) {
    console.error('Error changing password:', error)
    uiStore.showError('Error al cambiar la contraseña')
  } finally {
    savingPassword.value = false
  }
})

function cancelPasswordChange() {
  changingPassword.value = false
  resetPasswordForm()
}
</script>

<template>
  <v-container class="profile-view py-8">
    <div class="mb-6">
      <h1 class="text-h4 font-weight-bold mb-2">
        Mi Perfil
      </h1>
      <p class="text-body-1 text-medium-emphasis">
        Gestiona tu información personal y configuración
      </p>
    </div>

    <v-row>
      <!-- Información del usuario -->
      <v-col cols="12" md="4">
        <v-card>
          <v-card-text class="text-center pa-6">
            <!-- Avatar -->
            <v-avatar
              size="120"
              color="primary"
              class="mb-4"
            >
              <span class="text-h3 text-white">
                {{ authStore.user?.firstName?.charAt(0) }}{{ authStore.user?.lastName?.charAt(0) }}
              </span>
            </v-avatar>

            <!-- Nombre -->
            <h2 class="text-h5 font-weight-bold mb-2">
              {{ authStore.fullName }}
            </h2>

            <!-- Rol -->
            <v-chip
              :color="authStore.isAdmin ? 'error' : authStore.isOrganizer ? 'primary' : 'secondary'"
              class="mb-4"
            >
              <v-icon start>mdi-shield-account</v-icon>
              {{ userRole }}
            </v-chip>

            <!-- Email -->
            <div class="text-body-2 text-medium-emphasis mb-4">
              <v-icon size="small" class="mr-1">mdi-email</v-icon>
              {{ authStore.user?.email }}
            </div>

            <v-divider class="my-4" />

            <!-- Estadísticas -->
            <div class="user-stats">
              <div class="stat-item">
                <div class="text-h4 font-weight-bold text-primary">
                  {{ userStats.totalRegistrations }}
                </div>
                <div class="text-caption text-medium-emphasis">
                  Total registros
                </div>
              </div>

              <div class="stat-item">
                <div class="text-h4 font-weight-bold text-success">
                  {{ userStats.activeRegistrations }}
                </div>
                <div class="text-caption text-medium-emphasis">
                  Próximos eventos
                </div>
              </div>

              <div class="stat-item">
                <div class="text-h4 font-weight-bold text-info">
                  {{ userStats.attendedEvents }}
                </div>
                <div class="text-caption text-medium-emphasis">
                  Eventos asistidos
                </div>
              </div>
            </div>

            <v-divider class="my-4" />

            <!-- Acciones rápidas -->
            <v-btn
              color="primary"
              variant="outlined"
              block
              prepend-icon="mdi-calendar-check"
              @click="router.push('/my-registrations')"
            >
              Mis Registros
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Formularios de edición -->
      <v-col cols="12" md="8">
        <!-- Editar perfil -->
        <v-card class="mb-4">
          <v-card-title class="d-flex justify-space-between align-center">
            <span>
              <v-icon start>mdi-account-edit</v-icon>
              Información Personal
            </span>

            <v-btn
              v-if="!editingProfile"
              color="primary"
              variant="text"
              prepend-icon="mdi-pencil"
              @click="toggleEditProfile"
            >
              Editar
            </v-btn>
          </v-card-title>

          <v-divider />

          <v-card-text>
            <form @submit.prevent="onProfileSubmit">
              <v-row>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="firstName"
                    label="Nombre"
                    :readonly="!editingProfile"
                    :variant="editingProfile ? 'outlined' : 'filled'"
                    :error-messages="profileErrors.firstName"
                  />
                </v-col>

                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="lastName"
                    label="Apellidos"
                    :readonly="!editingProfile"
                    :variant="editingProfile ? 'outlined' : 'filled'"
                    :error-messages="profileErrors.lastName"
                  />
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    v-model="email"
                    label="Email"
                    type="email"
                    :readonly="!editingProfile"
                    :variant="editingProfile ? 'outlined' : 'filled'"
                    :error-messages="profileErrors.email"
                  />
                </v-col>
              </v-row>

              <v-row v-if="editingProfile">
                <v-col cols="12">
                  <div class="d-flex ga-2 justify-end">
                    <v-btn
                      variant="outlined"
                      @click="toggleEditProfile"
                    >
                      Cancelar
                    </v-btn>
                    <v-btn
                      type="submit"
                      color="primary"
                      :loading="savingProfile"
                    >
                      Guardar Cambios
                    </v-btn>
                  </div>
                </v-col>
              </v-row>
            </form>
          </v-card-text>
        </v-card>

        <!-- Cambiar contraseña -->
        <v-card>
          <v-card-title>
            <v-icon start>mdi-lock-reset</v-icon>
            Seguridad
          </v-card-title>

          <v-divider />

          <v-card-text>
            <v-expand-transition>
              <div v-if="!changingPassword">
                <p class="text-body-2 text-medium-emphasis mb-4">
                  Mantén tu cuenta segura actualizando tu contraseña regularmente
                </p>
                <v-btn
                  color="primary"
                  variant="outlined"
                  prepend-icon="mdi-key"
                  @click="changingPassword = true"
                >
                  Cambiar Contraseña
                </v-btn>
              </div>

              <form v-else @submit.prevent="onPasswordSubmit">
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      v-model="currentPassword"
                      label="Contraseña Actual"
                      type="password"
                      variant="outlined"
                      :error-messages="passwordErrors.currentPassword"
                    />
                  </v-col>

                  <v-col cols="12">
                    <v-text-field
                      v-model="newPassword"
                      label="Nueva Contraseña"
                      type="password"
                      variant="outlined"
                      :error-messages="passwordErrors.newPassword"
                    />
                  </v-col>

                  <v-col cols="12">
                    <v-text-field
                      v-model="confirmNewPassword"
                      label="Confirmar Nueva Contraseña"
                      type="password"
                      variant="outlined"
                      :error-messages="passwordErrors.confirmNewPassword"
                    />
                  </v-col>

                  <v-col cols="12">
                    <v-alert
                      type="info"
                      variant="tonal"
                      density="compact"
                    >
                      La contraseña debe tener al menos 8 caracteres, incluyendo mayúsculas, minúsculas y números.
                    </v-alert>
                  </v-col>

                  <v-col cols="12">
                    <div class="d-flex ga-2 justify-end">
                      <v-btn
                        variant="outlined"
                        @click="cancelPasswordChange"
                      >
                        Cancelar
                      </v-btn>
                      <v-btn
                        type="submit"
                        color="primary"
                        :loading="savingPassword"
                      >
                        Cambiar Contraseña
                      </v-btn>
                    </div>
                  </v-col>
                </v-row>
              </form>
            </v-expand-transition>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped lang="scss">
.profile-view {
  .user-stats {
    display: flex;
    justify-content: space-around;
    gap: 16px;

    .stat-item {
      text-align: center;
    }
  }
}
</style>
