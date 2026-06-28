import { defineStore } from 'pinia'
import type { Filters } from '~/composables/professionals/useFilters'
import type { Professional } from '~/types'

interface CatalogState {
  filters: {
    state: string
    city: string
  }
  categoryCounts: Record<string, number>
  isLoading: boolean
  filteredProfessionals: Professional[]
}

export const useCatalogStore = defineStore('catalog', {
  state: (): CatalogState => ({
    filters: {
      state: '',
      city: '',
    },
    categoryCounts: {},
    isLoading: false,
    filteredProfessionals: [],
  }),

  getters: {
    isFilterActive(): boolean {
      return Boolean(this.filters.state || this.filters.city)
    },

    filterDisplay(): string {
      if (this.filters.city) return this.filters.city
      if (this.filters.state) return this.filters.state
      return ''
    },
  },

  actions: {
    setStateFilter(state: string) {
      console.log('🔄 [Pinia] Estado mudou para:', state)
      this.filters.state = state
      if (state) {
        this.filters.city = '' // Reset city when state changes
      }
    },

    setCityFilter(city: string) {
      console.log('🔄 [Pinia] Cidade mudou para:', city)
      this.filters.city = city
    },

    clearFilters() {
      console.log('🔄 [Pinia] Limpando filtros')
      this.filters.state = ''
      this.filters.city = ''
      this.categoryCounts = {}
    },

    updateCategoryCounts(professionals: Professional[]) {
      console.log('📊 [Pinia] Atualizando contadores')
      const counts: Record<string, number> = {}

      for (const p of professionals) {
        counts[p.category] = (counts[p.category] ?? 0) + 1
      }

      this.categoryCounts = counts
      console.log('✅ [Pinia] Contadores atualizados:', counts)
    },

    setFilteredProfessionals(professionals: Professional[]) {
      this.filteredProfessionals = professionals
      this.updateCategoryCounts(professionals)
    },

    setLoading(loading: boolean) {
      this.isLoading = loading
    },

    getCountForCategory(category: string): number {
      return this.categoryCounts[category] ?? 0
    },
  },
})
