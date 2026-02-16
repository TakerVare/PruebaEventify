<!--
  =============================================================================
  REGISTER VIEW - Vista de registro
  =============================================================================
  Formulario de registro de nuevos usuarios con validación completa.

  Características:
  - Validación en tiempo real con VeeValidate
  - Verificación de contraseñas coincidentes
  - Indicador de fortaleza de contraseña
  - Aceptación de términos y condiciones
  =============================================================================
-->

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useForm } from 'vee-validate'
import { useAuthStore } from '@/stores/auth'
import { useValidation } from '@/composables/useValidation'
import type { RegisterDto } from '@/types'

const router = useRouter()
const { t } = useI18n()
const authStore = useAuthStore()
const { registerSchema } = useValidation()

// Estado del formulario
const loading = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const acceptTerms = ref(false)

// Configurar VeeValidate con el esquema de validación
const { defineField, handleSubmit, errors, values } = useForm({
  validationSchema: registerSchema
})

// Definir campos del formulario
const [firstName, firstNameAttrs] = defineField('firstName')
const [lastName, lastNameAttrs] = defineField('lastName')
const [email, emailAttrs] = defineField('email')
const [password, passwordAttrs] = defineField('password')
const [confirmPassword, confirmPasswordAttrs] = defineField('confirmPassword')

// Indicador de fortaleza de contraseña
const passwordStrength = computed(() => {
  const pwd = values.password || ''
  if (!pwd) return { value: 0, color: '', text: '' }

  let strength = 0
  if (pwd.length >= 8) strength++
  if (/[a-z]/.test(pwd)) strength++
  if (/[A-Z]/.test(pwd)) strength++
  if (/\d/.test(pwd)) strength++
  if (/[^a-zA-Z\d]/.test(pwd)) strength++

  if (strength <= 2) return { value: 33, color: 'error', text: 'Débil' }
  if (strength === 3) return { value: 66, color: 'warning', text: 'Media' }
  return { value: 100, color: 'success', text: 'Fuerte' }
})

// Manejar envío del formulario
const onSubmit = handleSubmit(async (formValues) => {
  if (!acceptTerms.value) {
    return
  }

  loading.value = true

  try {
    const userData: RegisterDto = {
      firstName: formValues.firstName,
      lastName: formValues.lastName,
      email: formValues.email,
      password: formValues.password,
      confirmPassword: formValues.confirmPassword
    }

    const success = await authStore.register(userData)

    if (success) {
      // Redirigir al home después del registro exitoso
      router.push('/')
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
      {{ t('auth.register.title') }}
    </h1>
    <p class="text-body-2 text-center text-medium-emphasis mb-6">
      {{ t('auth.register.subtitle') }}
    </p>

    <!-- Formulario -->
    <v-form @submit.prevent="onSubmit">
      <!-- Nombre y Apellido en fila -->
      <v-row>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="firstName"
            v-bind="firstNameAttrs"
            :label="t('auth.register.firstName')"
            :error-messages="errors.firstName"
            prepend-inner-icon="mdi-account"
            autocomplete="given-name"
            :disabled="loading"
          />
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="lastName"
            v-bind="lastNameAttrs"
            :label="t('auth.register.lastName')"
            :error-messages="errors.lastName"
            prepend-inner-icon="mdi-account"
            autocomplete="family-name"
            :disabled="loading"
          />
        </v-col>
      </v-row>

      <!-- Email -->
      <v-text-field
        v-model="email"
        v-bind="emailAttrs"
        :label="t('auth.register.email')"
        :error-messages="errors.email"
        type="email"
        prepend-inner-icon="mdi-email"
        autocomplete="email"
        :disabled="loading"
      />

      <!-- Contraseña -->
      <v-text-field
        v-model="password"
        v-bind="passwordAttrs"
        :label="t('auth.register.password')"
        :error-messages="errors.password"
        :type="showPassword ? 'text' : 'password'"
        prepend-inner-icon="mdi-lock"
        :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
        @click:append-inner="showPassword = !showPassword"
        autocomplete="new-password"
        :disabled="loading"
      />

      <!-- Indicador de fortaleza de contraseña -->
      <div v-if="password" class="mb-4">
        <v-progress-linear
          :model-value="passwordStrength.value"
          :color="passwordStrength.color"
          height="6"
          rounded
        />
        <p class="text-caption text-center mt-1" :class="`text-${passwordStrength.color}`">
          Fortaleza: {{ passwordStrength.text }}
        </p>
      </div>

      <!-- Confirmar contraseña -->
      <v-text-field
        v-model="confirmPassword"
        v-bind="confirmPasswordAttrs"
        :label="t('auth.register.confirmPassword')"
        :error-messages="errors.confirmPassword"
        :type="showConfirmPassword ? 'text' : 'password'"
        prepend-inner-icon="mdi-lock-check"
        :append-inner-icon="showConfirmPassword ? 'mdi-eye-off' : 'mdi-eye'"
        @click:append-inner="showConfirmPassword = !showConfirmPassword"
        autocomplete="new-password"
        :disabled="loading"
      />

      <!-- Checkbox de términos y condiciones -->
      <v-checkbox
        v-model="acceptTerms"
        color="primary"
        :disabled="loading"
      >
        <template #label>
          <span class="text-caption">
            {{ t('auth.register.acceptTerms') }}
            <a href="#" class="text-primary text-decoration-none">
              Términos y condiciones
            </a>
          </span>
        </template>
      </v-checkbox>

      <!-- Botón de envío -->
      <v-btn
        type="submit"
        color="primary"
        size="large"
        block
        :loading="loading"
        :disabled="loading || !acceptTerms"
        class="mb-4"
      >
        {{ t('auth.register.submit') }}
      </v-btn>

      <!-- Divider -->
      <v-divider class="my-4" />

      <!-- Enlace a login -->
      <div class="text-center">
        <p class="text-body-2 text-medium-emphasis mb-2">
          {{ t('auth.register.hasAccount') }}
        </p>
        <v-btn
          variant="outlined"
          color="primary"
          block
          @click="router.push('/login')"
          :disabled="loading"
        >
          {{ t('auth.register.loginLink') }}
        </v-btn>
      </div>
    </v-form>
  </div>
</template>

<style scoped lang="scss">
// Estilos adicionales si son necesarios
</style>
