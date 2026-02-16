

import { ref, computed, watch } from 'vue'

interface PaginationOptions {
  
  initialPage?: number
  
  initialPageSize?: number
  
  totalCount?: number
}

export function usePagination(options: PaginationOptions = {}) {
  
  
  

  const currentPage = ref(options.initialPage || 1)
  const pageSize = ref(options.initialPageSize || 10)
  const totalCount = ref(options.totalCount || 0)

  
  
  

  
  const totalPages = computed(() => {
    if (totalCount.value === 0) return 0
    return Math.ceil(totalCount.value / pageSize.value)
  })

  
  const hasNextPage = computed(() => {
    return currentPage.value < totalPages.value
  })

  
  const hasPreviousPage = computed(() => {
    return currentPage.value > 1
  })

  
  const firstItem = computed(() => {
    if (totalCount.value === 0) return 0
    return (currentPage.value - 1) * pageSize.value + 1
  })

  
  const lastItem = computed(() => {
    const last = currentPage.value * pageSize.value
    return Math.min(last, totalCount.value)
  })

  
  const pageNumbers = computed(() => {
    const pages: number[] = []
    const maxVisible = 5
    let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
    let end = Math.min(totalPages.value, start + maxVisible - 1)

    
    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1)
    }

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    return pages
  })

  
  
  

  
  function changePage(page: number) {
    if (page < 1 || page > totalPages.value) return
    currentPage.value = page
  }

  
  function nextPage() {
    if (hasNextPage.value) {
      currentPage.value++
    }
  }

  
  function previousPage() {
    if (hasPreviousPage.value) {
      currentPage.value--
    }
  }

  
  function firstPage() {
    currentPage.value = 1
  }

  
  function lastPage() {
    currentPage.value = totalPages.value
  }

  
  function changePageSize(newSize: number) {
    pageSize.value = newSize
    currentPage.value = 1 
  }

  
  function setTotalCount(newTotal: number) {
    totalCount.value = newTotal
  }

  
  function reset() {
    currentPage.value = options.initialPage || 1
    pageSize.value = options.initialPageSize || 10
    totalCount.value = options.totalCount || 0
  }

  
  
  

  return {
    
    currentPage,
    pageSize,
    totalCount,

    
    totalPages,
    hasNextPage,
    hasPreviousPage,
    firstItem,
    lastItem,
    pageNumbers,

    
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
