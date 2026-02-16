/**
 * =============================================================================
 * USE PAGINATION - Composable de paginación
 * =============================================================================
 * Composable que proporciona lógica de paginación reutilizable.
 *
 * Uso:
 * ```ts
 * const {
 *   currentPage,
 *   pageSize,
 *   totalPages,
 *   hasNextPage,
 *   hasPreviousPage,
 *   changePage,
 *   nextPage,
 *   previousPage
 * } = usePagination(initialPage, initialPageSize, fetchFunction)
 * ```
 * =============================================================================
 */

import { ref, computed, watch } from 'vue'

interface PaginationOptions {
  /** Página inicial (por defecto 1) */
  initialPage?: number
  /** Tamaño de página inicial (por defecto 10) */
  initialPageSize?: number
  /** Total de elementos */
  totalCount?: number
}

export function usePagination(options: PaginationOptions = {}) {
  // ===========================================================================
  // ESTADO
  // ===========================================================================

  const currentPage = ref(options.initialPage || 1)
  const pageSize = ref(options.initialPageSize || 10)
  const totalCount = ref(options.totalCount || 0)

  // ===========================================================================
  // COMPUTADOS
  // ===========================================================================

  /**
   * Total de páginas
   */
  const totalPages = computed(() => {
    if (totalCount.value === 0) return 0
    return Math.ceil(totalCount.value / pageSize.value)
  })

  /**
   * Indica si hay una página siguiente
   */
  const hasNextPage = computed(() => {
    return currentPage.value < totalPages.value
  })

  /**
   * Indica si hay una página anterior
   */
  const hasPreviousPage = computed(() => {
    return currentPage.value > 1
  })

  /**
   * Primer elemento de la página actual (1-indexed)
   */
  const firstItem = computed(() => {
    if (totalCount.value === 0) return 0
    return (currentPage.value - 1) * pageSize.value + 1
  })

  /**
   * Último elemento de la página actual (1-indexed)
   */
  const lastItem = computed(() => {
    const last = currentPage.value * pageSize.value
    return Math.min(last, totalCount.value)
  })

  /**
   * Array de números de página para mostrar en la paginación
   * Muestra hasta 5 páginas alrededor de la página actual
   */
  const pageNumbers = computed(() => {
    const pages: number[] = []
    const maxVisible = 5
    let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
    let end = Math.min(totalPages.value, start + maxVisible - 1)

    // Ajustar inicio si estamos cerca del final
    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1)
    }

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    return pages
  })

  // ===========================================================================
  // MÉTODOS
  // ===========================================================================

  /**
   * Cambia a una página específica
   * @param page - Número de página
   */
  function changePage(page: number) {
    if (page < 1 || page > totalPages.value) return
    currentPage.value = page
  }

  /**
   * Va a la página siguiente
   */
  function nextPage() {
    if (hasNextPage.value) {
      currentPage.value++
    }
  }

  /**
   * Va a la página anterior
   */
  function previousPage() {
    if (hasPreviousPage.value) {
      currentPage.value--
    }
  }

  /**
   * Va a la primera página
   */
  function firstPage() {
    currentPage.value = 1
  }

  /**
   * Va a la última página
   */
  function lastPage() {
    currentPage.value = totalPages.value
  }

  /**
   * Cambia el tamaño de página
   * @param newSize - Nuevo tamaño de página
   */
  function changePageSize(newSize: number) {
    pageSize.value = newSize
    currentPage.value = 1 // Reset a primera página
  }

  /**
   * Actualiza el total de elementos
   * @param newTotal - Nuevo total
   */
  function setTotalCount(newTotal: number) {
    totalCount.value = newTotal
  }

  /**
   * Resetea la paginación a valores iniciales
   */
  function reset() {
    currentPage.value = options.initialPage || 1
    pageSize.value = options.initialPageSize || 10
    totalCount.value = options.totalCount || 0
  }

  // ===========================================================================
  // RETURN
  // ===========================================================================

  return {
    // Estado
    currentPage,
    pageSize,
    totalCount,

    // Computados
    totalPages,
    hasNextPage,
    hasPreviousPage,
    firstItem,
    lastItem,
    pageNumbers,

    // Métodos
    changePage,
    nextPage,
    previousPage,
    firstPage,
    lastPage,
    changePageSize,
    setTotalCount,
    reset
  }
}
