import { defineStore } from 'pinia'
import type { Category } from '~/types'

export type SortOption = 'rating' | 'price_asc' | 'price_desc' | 'distance'

interface FilterState {
  search: string
  category: Category | ''
  minRate: number
  maxRate: number
  availableOnly: boolean
  sortBy: SortOption
  state: string
  city: string
}

export const useFilterStore = defineStore('filter', {
  state: (): FilterState => ({
    search: '',
    category: '',
    minRate: 0,
    maxRate: 500,
    availableOnly: false,
    sortBy: 'rating',
    state: '',
    city: '',
  }),

  getters: {
    isLocationFilterActive(): boolean {
      return Boolean(this.state || this.city)
    },

    locationDisplay(): string {
      if (this.city) return this.city
      if (this.state) return this.state
      return ''
    },
  },

  actions: {
    setSearch(search: string) {
      this.search = search
    },

    setCategory(category: Category | '') {
      this.category = category
    },

    setStateFilter(state: string) {
      this.state = state
      if (state) {
        this.city = '' // Reset city when state changes
      }
    },

    setCityFilter(city: string) {
      this.city = city
    },

    setMinRate(rate: number) {
      this.minRate = rate
    },

    setMaxRate(rate: number) {
      this.maxRate = rate
    },

    setAvailableOnly(available: boolean) {
      this.availableOnly = available
    },

    setSortBy(sortBy: SortOption) {
      this.sortBy = sortBy
    },

    clearLocationFilters() {
      this.state = ''
      this.city = ''
    },

    resetAllFilters() {
      this.search = ''
      this.category = ''
      this.minRate = 0
      this.maxRate = 500
      this.availableOnly = false
      this.sortBy = 'rating'
      this.state = ''
      this.city = ''
    },
  },
})
