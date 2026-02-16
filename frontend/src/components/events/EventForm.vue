<!--
  =============================================================================
  EVENT FORM - Formulario de evento
  =============================================================================
  Componente reutilizable para crear y editar eventos.
  Incluye validación con VeeValidate y Yup.

  Props:
  - event: Evento a editar (opcional, para modo edición)
  - loading: Estado de carga del formulario

  Emits:
  - submit: Emite los datos del formulario al enviar
  - cancel: Emite evento cuando se cancela
  =============================================================================
-->

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useForm } from 'vee-validate'
import { useI18n } from 'vue-i18n'
import { useCategoriesStore } from '@/stores/categories'
import { useLocationsStore } from '@/stores/locations'
import { useValidation } from '@/composables/useValidation'
import type { Event, CreateEventDto, UpdateEventDto } from '@/types'

// Props
interface Props {
  event?: Event
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  event: undefined,
  loading: false
})

// Emits
const emit = defineEmits<{
  submit: [data: CreateEventDto | UpdateEventDto]
  cancel: []
}>()

const { t } = useI18n()
const categoriesStore = useCategoriesStore()
const locationsStore = useLocationsStore()
const { eventSchema } = useValidation()

// Estado
const imagePreview = ref<string | null>(null)

// Formulario
const {
  defineField,
  handleSubmit,
  errors,
  resetForm
} = useForm({
  validationSchema: eventSchema,
  initialValues: props.event
    ? {
        title: props.event.title,
        description: props.event.description,
        startDate: props.event.startDate.split('T')[0],
        startTime: new Date(props.event.startDate).toTimeString().slice(0, 5),
        endDate: props.event.endDate.split('T')[0],
        endTime: new Date(props.event.endDate).toTimeString().slice(0, 5),
        categoryId: props.event.category?.id,
        locationId: props.event.location?.id,
        capacity: props.event.capacity,
        imageUrl: props.event.imageUrl,
        status: props.event.status
      }
    : {
        title: '',
        description: '',
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: '',
        categoryId: undefined,
        locationId: undefined,
        capacity: 50,
        imageUrl: '',
        status: 'Draft'
      }
})

const [title] = defineField('title')
const [description] = defineField('description')
const [startDate] = defineField('startDate')
const [startTime] = defineField('startTime')
const [endDate] = defineField('endDate')
const [endTime] = defineField('endTime')
const [categoryId] = defineField('categoryId')
const [locationId] = defineField('locationId')
const [capacity] = defineField('capacity')
const [imageUrl] = defineField('imageUrl')
const [status] = defineField('status')

// Computados
const isEditMode = computed(() => !!props.event)

const categoryOptions = computed(() => {
  return categoriesStore.categories.map(cat => ({
    value: cat.id,
    title: cat.name,
    props: {
      prependIcon: cat.icon
    }
  }))
})

const locationOptions = computed(() => {
  return locationsStore.activeLocations.map(loc => ({
    value: loc.id,
    title: `${loc.name} (Capacidad: ${loc.capacity})`
  }))
})

const statusOptions = [
  { value: 'Draft', title: 'Borrador' },
  { value: 'Published', title: 'Publicado' },
  { value: 'Cancelled', title: 'Cancelado' },
  { value: 'Completed', title: 'Completado' }
]

// Métodos
const onSubmit = handleSubmit((values) => {
  // Combinar fecha y hora
  const startDateTime = `${values.startDate}T${values.startTime}:00`
  const endDateTime = `${values.endDate}T${values.endTime}:00`

  const formData: CreateEventDto | UpdateEventDto = {
    title: values.title,
    description: values.description,
    startDate: startDateTime,
    endDate: endDateTime,
    categoryId: values.categoryId!,
    locationId: values.locationId!,
    capacity: Number(values.capacity),
    imageUrl: values.imageUrl,
    status: values.status
  }

  emit('submit', formData)
})

function handleCancel() {
  emit('cancel')
}

function updateImagePreview() {
  imagePreview.value = imageUrl.value || null
}

// Cargar datos necesarios
onMounted(async () => {
  await Promise.all([
    categoriesStore.fetchCategories(),
    locationsStore.fetchLocations()
  ])

  if (props.event?.imageUrl) {
    imagePreview.value = props.event.imageUrl
  }
})
</script>

<template>
  <v-form @submit.prevent="onSubmit">
    <v-row>
      <!-- Título -->
      <v-col cols="12">
        <v-text-field
          v-model="title"
          label="Título del evento *"
          placeholder="Ej: Conferencia de Tecnología 2024"
          variant="outlined"
          :error-messages="errors.title"
        />
      </v-col>

      <!-- Descripción -->
      <v-col cols="12">
        <v-textarea
          v-model="description"
          label="Descripción *"
          placeholder="Describe tu evento..."
          variant="outlined"
          rows="5"
          :error-messages="errors.description"
        />
      </v-col>

      <!-- Categoría -->
      <v-col cols="12" md="6">
        <v-select
          v-model="categoryId"
          label="Categoría *"
          :items="categoryOptions"
          variant="outlined"
          :error-messages="errors.categoryId"
        />
      </v-col>

      <!-- Ubicación -->
      <v-col cols="12" md="6">
        <v-select
          v-model="locationId"
          label="Ubicación *"
          :items="locationOptions"
          variant="outlined"
          :error-messages="errors.locationId"
        />
      </v-col>

      <!-- Fecha inicio -->
      <v-col cols="12" sm="6" md="3">
        <v-text-field
          v-model="startDate"
          label="Fecha inicio *"
          type="date"
          variant="outlined"
          :error-messages="errors.startDate"
        />
      </v-col>

      <!-- Hora inicio -->
      <v-col cols="12" sm="6" md="3">
        <v-text-field
          v-model="startTime"
          label="Hora inicio *"
          type="time"
          variant="outlined"
          :error-messages="errors.startTime"
        />
      </v-col>

      <!-- Fecha fin -->
      <v-col cols="12" sm="6" md="3">
        <v-text-field
          v-model="endDate"
          label="Fecha fin *"
          type="date"
          variant="outlined"
          :error-messages="errors.endDate"
        />
      </v-col>

      <!-- Hora fin -->
      <v-col cols="12" sm="6" md="3">
        <v-text-field
          v-model="endTime"
          label="Hora fin *"
          type="time"
          variant="outlined"
          :error-messages="errors.endTime"
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

      <!-- Estado -->
      <v-col cols="12" md="6">
        <v-select
          v-model="status"
          label="Estado *"
          :items="statusOptions"
          variant="outlined"
          :error-messages="errors.status"
        />
      </v-col>

      <!-- URL de imagen -->
      <v-col cols="12">
        <v-text-field
          v-model="imageUrl"
          label="URL de imagen"
          placeholder="https://ejemplo.com/imagen.jpg"
          variant="outlined"
          :error-messages="errors.imageUrl"
          @blur="updateImagePreview"
        >
          <template #append-inner>
            <v-btn
              icon="mdi-eye"
              size="small"
              variant="text"
              @click="updateImagePreview"
            />
          </template>
        </v-text-field>
      </v-col>

      <!-- Preview de imagen -->
      <v-col v-if="imagePreview" cols="12">
        <v-card>
          <v-card-title class="text-body-2">Vista previa</v-card-title>
          <v-img
            :src="imagePreview"
            height="200"
            cover
          />
        </v-card>
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
            {{ isEditMode ? 'Actualizar Evento' : 'Crear Evento' }}
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </v-form>
</template>

<style scoped lang="scss">
// Estilos específicos si son necesarios
</style>
