/**
 * =============================================================================
 * STORE CATEGORIES - Gestión de categorías de eventos
 * =============================================================================
 * Este store maneja todo lo relacionado con categorías de eventos:
 * - Listado de categorías
 * - Opciones para selects
 * - Colores e iconos de categorías
 * =============================================================================
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Category, FilterOption } from '@/types'
import { useUiStore } from './ui'

// -----------------------------------------------------------------------------
// DEFINICIÓN DEL STORE
// -----------------------------------------------------------------------------

export const useCategoriesStore = defineStore('categories', () => {
  // ===========================================================================
  // ESTADO
  // ===========================================================================

  /**
   * Lista de categorías disponibles
   */
  const categories = ref<Category[]>([])

  /**
   * Indica si hay una operación en curso
   */
  const loading = ref(false)

  /**
   * Mensaje de error de la última operación
   */
  const error = ref<string | null>(null)

  // ===========================================================================
  // GETTERS
  // ===========================================================================

  /**
   * Opciones de categorías para componentes de selección (v-select)
   */
  const categoryOptions = computed(() => {
    return categories.value.map(category => ({
      value: category.id,
      title: category.name,
      props: {
        prependIcon: category.icon,
        color: category.color
      }
    }))
  })

  /**
   * Opciones de categorías para filtros
   */
  const categoryFilterOptions = computed((): FilterOption<number>[] => {
    return categories.value.map(category => ({
      value: category.id,
      label: category.name,
      icon: category.icon,
      color: category.color
    }))
  })

  /**
   * Mapa de categorías por ID para acceso rápido
   */
  const categoriesById = computed(() => {
    const map = new Map<number, Category>()
    categories.value.forEach(category => {
      map.set(category.id, category)
    })
    return map
  })

  /**
   * Indica si hay categorías cargadas
   */
  const hasCategories = computed(() => categories.value.length > 0)

  // ===========================================================================
  // ACCIONES - LISTADO
  // ===========================================================================

  /**
   * Obtiene todas las categorías
   */
  async function fetchCategories() {
    const uiStore = useUiStore()

    try {
      loading.value = true
      error.value = null

      // TODO: Llamar al servicio de categorías cuando se implemente
      // const fetchedCategories = await categoriesService.getAll()

      // MOCK: Simular respuesta del backend con categorías predefinidas
      categories.value = getMockCategories()

      return true
    } catch (err: any) {
      error.value = err.message || 'Error al cargar categorías'
      uiStore.showError(error.value)
      return false
    } finally {
      loading.value = false
    }
  }

  // ===========================================================================
  // ACCIONES - HELPERS
  // ===========================================================================

  /**
   * Obtiene una categoría por su ID
   * @param id - ID de la categoría
   */
  function getCategoryById(id: number): Category | undefined {
    return categoriesById.value.get(id)
  }

  /**
   * Obtiene el nombre de una categoría por su ID
   * @param id - ID de la categoría
   */
  function getCategoryName(id: number): string {
    return categoriesById.value.get(id)?.name ?? 'Sin categoría'
  }

  /**
   * Obtiene el color de una categoría por su ID
   * @param id - ID de la categoría
   */
  function getCategoryColor(id: number): string {
    return categoriesById.value.get(id)?.color ?? '#9E9E9E'
  }

  /**
   * Obtiene el icono de una categoría por su ID
   * @param id - ID de la categoría
   */
  function getCategoryIcon(id: number): string {
    return categoriesById.value.get(id)?.icon ?? 'mdi-calendar'
  }

  // ===========================================================================
  // RESET
  // ===========================================================================

  /**
   * Resetea el store a sus valores por defecto
   */
  function $reset() {
    categories.value = []
    loading.value = false
    error.value = null
  }

  // ===========================================================================
  // RETURN (API PÚBLICA DEL STORE)
  // ===========================================================================

  return {
    // Estado
    categories,
    loading,
    error,

    // Getters
    categoryOptions,
    categoryFilterOptions,
    categoriesById,
    hasCategories,

    // Acciones
    fetchCategories,
    getCategoryById,
    getCategoryName,
    getCategoryColor,
    getCategoryIcon,

    // Reset
    $reset
  }
})

// =============================================================================
// FUNCIONES AUXILIARES (MOCK DATA)
// =============================================================================

/**
 * Retorna las categorías predefinidas del sistema
 * En un sistema real, estas vendrían del backend
 */
function getMockCategories(): Category[] {
  return [
    {
      id: 1,
      name: 'Conferencia',
      color: '#1976D2', // Azul
      icon: 'mdi-presentation',
      description: 'Eventos de conferencias y charlas magistrales'
    },
    {
      id: 2,
      name: 'Taller',
      color: '#4CAF50', // Verde
      icon: 'mdi-tools',
      description: 'Talleres prácticos y workshops'
    },
    {
      id: 3,
      name: 'Meetup',
      color: '#FF9800', // Naranja
      icon: 'mdi-account-group',
      description: 'Encuentros informales y networking'
    },
    {
      id: 4,
      name: 'Seminario',
      color: '#9C27B0', // Púrpura
      icon: 'mdi-school',
      description: 'Seminarios educativos y formativos'
    },
    {
      id: 5,
      name: 'Networking',
      color: '#00BCD4', // Cyan
      icon: 'mdi-handshake',
      description: 'Eventos de networking profesional'
    },
    {
      id: 6,
      name: 'Curso',
      color: '#F44336', // Rojo
      icon: 'mdi-book-open-page-variant',
      description: 'Cursos y formación extendida'
    },
    {
      id: 7,
      name: 'Exposición',
      color: '#E91E63', // Pink
      icon: 'mdi-image-multiple',
      description: 'Exposiciones y ferias'
    },
    {
      id: 8,
      name: 'Otro',
      color: '#607D8B', // Gris azulado
      icon: 'mdi-dots-horizontal',
      description: 'Otros tipos de eventos'
    }
  ]
}
