<!--
  =============================================================================
  LOCATION FORM - Formulario de ubicación
  =============================================================================
  Componente reutilizable para crear y editar ubicaciones.
  Incluye validación con VeeValidate y Yup.

  Props:
  - location: Ubicación a editar (opcional, para modo edición)
  - loading: Estado de carga del formulario

  Emits:
  - submit: Emite los datos del formulario al enviar
  - cancel: Emite evento cuando se cancela
  =============================================================================
-->

<script setup lang="ts">
import { computed } from 'vue'
import { useForm } from 'vee-validate'
import { useI18n } from 'vue-i18n'
import { useValidation } from '@/composables/useValidation'
import type { Location, CreateLocationDto, UpdateLocationDto } from '@/types'

// Props
interface Props {
  location?: Location
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  location: undefined,
  loading: false
})

// Emits
const emit = defineEmits<{
  submit: [data: CreateLocationDto | UpdateLocationDto]
  cancel: []
}>()

const { t } = useI18n()
const { locationSchema } = useValidation()

// Formulario
const {
  defineField,
  handleSubmit,
  errors
} = useForm({
  validationSchema: locationSchema,
  initialValues: props.location
    ? {
        name: props.location.name,
        address: props.location.address,
        city: props.location.city,
        capacity: props.location.capacity,
        description: props.location.description || '',
        isActive: props.location.isActive
      }
    : {
        name: '',
        address: '',
        city: '',
        capacity: 50,
        description: '',
        isActive: true
      }
})

const [name] = defineField('name')
const [address] = defineField('address')
const [city] = defineField('city')
const [capacity] = defineField('capacity')
const [description] = defineField('description')
const [isActive] = defineField('isActive')

// Computados
const isEditMode = computed(() => !!props.location)

// Métodos
const onSubmit = handleSubmit((values) => {
  const formData: CreateLocationDto | UpdateLocationDto = {
    name: values.name,
    address: values.address,
    city: values.city,
    capacity: Number(values.capacity),
    description: values.description || undefined,
    isActive: values.isActive
  }

  emit('submit', formData)
})

function handleCancel() {
  emit('cancel')
}
</script>

<template>
  <v-form @submit.prevent="onSubmit">
    <v-row>
      <!-- Nombre -->
      <v-col cols="12" md="6">
        <v-text-field
          v-model="name"
          label="Nombre de la ubicación *"
          placeholder="Ej: Centro de Convenciones"
          variant="outlined"
          :error-messages="errors.name"
        />
      </v-col>

      <!-- Ciudad -->
      <v-col cols="12" md="6">
        <v-text-field
          v-model="city"
          label="Ciudad *"
          placeholder="Ej: Madrid"
          variant="outlined"
          :error-messages="errors.city"
        />
      </v-col>

      <!-- Dirección -->
      <v-col cols="12">
        <v-text-field
          v-model="address"
          label="Dirección *"
          placeholder="Ej: Calle Principal 123"
          variant="outlined"
          :error-messages="errors.address"
        />
      </v-col>

      <!-- Capacidad -->
      <v-col cols="12" md="6">
        <v-text-field
          v-model="capacity"
          label="Capacidad *"
          type="number"
          variant="outlined"
          :error-messages="errors.capacity"
        />
      </v-col>

      <!-- Estado activo -->
      <v-col cols="12" md="6">
        <v-switch
          v-model="isActive"
          label="Ubicación activa"
          color="primary"
          :hint="isActive ? 'La ubicación está disponible para eventos' : 'La ubicación está desactivada'"
          persistent-hint
        />
      </v-col>

      <!-- Descripción -->
      <v-col cols="12">
        <v-textarea
          v-model="description"
          label="Descripción (opcional)"
          placeholder="Información adicional sobre la ubicación..."
          variant="outlined"
          rows="4"
          :error-messages="errors.description"
        />
      </v-col>

      <!-- Botones de acción -->
      <v-col cols="12">
        <v-divider class="mb-4" />
        <div class="d-flex ga-2 justify-end">
          <v-btn
            variant="outlined"
            size="large"
            @click="handleCancel"
          >
            Cancelar
          </v-btn>

          <v-btn
            type="submit"
            color="primary"
            size="large"
            :loading="loading"
          >
            {{ isEditMode ? 'Actualizar Ubicación' : 'Crear Ubicación' }}
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </v-form>
</template>

<style scoped lang="scss">
// Estilos específicos si son necesarios
</style>
