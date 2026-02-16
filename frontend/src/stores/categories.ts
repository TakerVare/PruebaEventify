

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Category, FilterOption } from '@/types'
import { useUiStore } from './ui'





export const useCategoriesStore = defineStore('categories', () => {
  
  
  

  
  const categories = ref<Category[]>([])

  
  const loading = ref(false)

  
  const error = ref<string | null>(null)

  
  
  

  
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

  
  const categoryFilterOptions = computed((): FilterOption<number>[] => {
    return categories.value.map(category => ({
      value: category.id,
      label: category.name,
      icon: category.icon,
      color: category.color
    }))
  })

  
  const categoriesById = computed(() => {
    const map = new Map<number, Category>()
    categories.value.forEach(category => {
      map.set(category.id, category)
    })
    return map
  })

  
  const hasCategories = computed(() => categories.value.length > 0)

  
  
  

  
  async function fetchCategories() {
    const uiStore = useUiStore()

    try {
      loading.value = true
      error.value = null

      
      

      
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

  
  
  

  
  function getCategoryById(id: number): Category | undefined {
    return categoriesById.value.get(id)
  }

  
  function getCategoryName(id: number): string {
    return categoriesById.value.get(id)?.name ?? 'Sin categoría'
  }

  
  function getCategoryColor(id: number): string {
    return categoriesById.value.get(id)?.color ?? '#9E9E9E'
  }

  
  function getCategoryIcon(id: number): string {
    return categoriesById.value.get(id)?.icon ?? 'mdi-calendar'
  }

  
  
  

  
  function $reset() {
    categories.value = []
    loading.value = false
    error.value = null
  }

  
  
  

  return {
    
    categories,
    loading,
    error,

    
    categoryOptions,
    categoryFilterOptions,
    categoriesById,
    hasCategories,

    
    fetchCategories,
    getCategoryById,
    getCategoryName,
    getCategoryColor,
    getCategoryIcon,

    
    $reset
  }
})






function getMockCategories(): Category[] {
  return [
    {
      id: 1,
      name: 'Conferencia',
      color: '#1976D2', 
      icon: 'mdi-presentation',
      description: 'Eventos de conferencias y charlas magistrales'
    },
    {
      id: 2,
      name: 'Taller',
      color: '#4CAF50', 
      icon: 'mdi-tools',
      description: 'Talleres prácticos y workshops'
    },
    {
      id: 3,
      name: 'Meetup',
      color: '#FF9800', 
      icon: 'mdi-account-group',
      description: 'Encuentros informales y networking'
    },
    {
      id: 4,
      name: 'Seminario',
      color: '#9C27B0', 
      icon: 'mdi-school',
      description: 'Seminarios educativos y formativos'
    },
    {
      id: 5,
      name: 'Networking',
      color: '#00BCD4', 
      icon: 'mdi-handshake',
      description: 'Eventos de networking profesional'
    },
    {
      id: 6,
      name: 'Curso',
      color: '#F44336', 
      icon: 'mdi-book-open-page-variant',
      description: 'Cursos y formación extendida'
    },
    {
      id: 7,
      name: 'Exposición',
      color: '#E91E63', 
      icon: 'mdi-image-multiple',
      description: 'Exposiciones y ferias'
    },
    {
      id: 8,
      name: 'Otro',
      color: '#607D8B', 
      icon: 'mdi-dots-horizontal',
      description: 'Otros tipos de eventos'
    }
  ]
}
