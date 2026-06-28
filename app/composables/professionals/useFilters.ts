import type { Category } from '~/types'
import { useFilterStore } from '~/stores/filter'

export type SortOption = 'rating' | 'price_asc' | 'price_desc' | 'distance'

export interface Filters {
  search: string
  category: Category | ''
  minRate: number
  maxRate: number
  availableOnly: boolean
  sortBy: SortOption
  state: string
  city: string
}

export function useFilters() {
  const filterStore = useFilterStore()

  // Wrapper para compatibilidade com código existente
  const filters = computed({
    get: () => ({
      search: filterStore.search,
      category: filterStore.category,
      minRate: filterStore.minRate,
      maxRate: filterStore.maxRate,
      availableOnly: filterStore.availableOnly,
      sortBy: filterStore.sortBy,
      state: filterStore.state,
      city: filterStore.city,
    } as Filters),
    set: (value: Filters) => {
      filterStore.setSearch(value.search)
      filterStore.setCategory(value.category)
      filterStore.setMinRate(value.minRate)
      filterStore.setMaxRate(value.maxRate)
      filterStore.setAvailableOnly(value.availableOnly)
      filterStore.setSortBy(value.sortBy)
      filterStore.setStateFilter(value.state)
      filterStore.setCityFilter(value.city)
    },
  })

  function reset() {
    filterStore.resetAllFilters()
  }

  function resetLocation() {
    filterStore.clearLocationFilters()
  }

  return {
    filters,
    reset,
    resetLocation,
  }
}