<!--
  =============================================================================
  LOGIN VIEW - Vista de inicio de sesión
  =============================================================================
  Formulario de login con validación usando VeeValidate y Yup.

  Características:
  - Validación en tiempo real
  - Manejo de errores
  - Recuerda la URL de origen para redirigir después del login
  - Enlace a registro
  =============================================================================
-->

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useForm } from 'vee-validate'
import { useAuthStore } from '@/stores/auth'
import { useValidation } from '@/composables/useValidation'
import type { LoginDto } from '@/types'

const router = useRouter()
const route = useRoute()
const { t } = useI18n()
const authStore = useAuthStore()
const { loginSchema } = useValidation()

// Verificar si estamos en modo desarrollo
const isDev = import.meta.env.DEV

// Estado del formulario
const loading = ref(false)
const showPassword = ref(false)

// Configurar VeeValidate con el esquema de validación
const { defineField, handleSubmit, errors } = useForm({
  validationSchema: loginSchema
})

// Definir campos del formulario
const [email, emailAttrs] = defineField('email')
const [password, passwordAttrs] = defineField('password')

// Manejar envío del formulario
const onSubmit = handleSubmit(async (values) => {
  loading.value = true

  try {
    const credentials: LoginDto = {
      email: values.email,
      password: values.password
    }

    const success = await authStore.login(credentials)

    if (success) {
      // Obtener URL de redirección del query param o usar default
      const redirect = route.query.redirect as string || '/'

      // Si el usuario es admin u organizador, redirigir al dashboard
      if (authStore.isAdmin || authStore.isOrganizer) {
        router.push('/admin/dashboard')
      } else {
        router.push(redirect)
      }
    }
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div>
    <!-- Título -->
    <h1 class="text-h5 font-weight-bold text-center mb-2">
      {{ t('auth.login.title') }}
    </h1>
    <p class="text-body-2 text-center text-medium-emphasis mb-6">
      {{ t('auth.login.subtitle') }}
    </p>

    <!-- Formulario -->
    <v-form @submit.prevent="onSubmit">
      <!-- Campo de email -->
      <v-text-field
        v-model="email"
        v-bind="emailAttrs"
        :label="t('auth.login.email')"
        :error-messages="errors.email"
        type="email"
        prepend-inner-icon="mdi-email"
        autocomplete="email"
        :disabled="loading"
      />

      <!-- Campo de contraseña -->
      <v-text-field
        v-model="password"
        v-bind="passwordAttrs"
        :label="t('auth.login.password')"
        :error-messages="errors.password"
        :type="showPassword ? 'text' : 'password'"
        prepend-inner-icon="mdi-lock"
        :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
        @click:append-inner="showPassword = !showPassword"
        autocomplete="current-password"
        :disabled="loading"
      />

      <!-- Enlace de recuperar contraseña -->
      <div class="d-flex justify-end mb-4">
        <v-btn
          variant="text"
          size="small"
          color="primary"
          @click="router.push('/forgot-password')"
          :disabled="loading"
        >
          {{ t('auth.login.forgotPassword') }}
        </v-btn>
      </div>

      <!-- Botón de envío -->
      <v-btn
        type="submit"
        color="primary"
        size="large"
        block
        :loading="loading"
        :disabled="loading"
        class="mb-4"
      >
        {{ t('auth.login.submit') }}
      </v-btn>

      <!-- Divider -->
      <v-divider class="my-4" />

      <!-- Enlace a registro -->
      <div class="text-center">
        <p class="text-body-2 text-medium-emphasis mb-2">
          {{ t('auth.login.noAccount') }}
        </p>
        <v-btn
          variant="outlined"
          color="primary"
          block
          @click="router.push('/register')"
          :disabled="loading"
        >
          {{ t('auth.login.registerLink') }}
        </v-btn>
      </div>
    </v-form>

    <!-- Usuario demo (solo en desarrollo) -->
    <v-alert
      v-if="isDev"
      type="info"
      variant="tonal"
      class="mt-6"
      density="compact"
    >
      <template #title>
        <span class="text-caption">Usuarios de prueba</span>
      </template>
      <div class="text-caption">
        <p><strong>Admin:</strong> admin@eventify.com / Admin123!</p>
        <p><strong>Organizador:</strong> organizador@eventify.com / Org123!</p>
        <p><strong>Usuario:</strong> usuario@eventify.com / User123!</p>
      </div>
    </v-alert>
  </div>
</template>

<style scoped lang="scss">
// Estilos adicionales si son necesarios
</style>
