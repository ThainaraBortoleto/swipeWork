import type { Professional } from '~/types'
import type { Filters } from './useFilters'

export function useProfessionals() {
  const supabase = useSupabase()
  const professionals = useState<Professional[]>('professionals', () => [])
  const displayedProfessionals = useState<Professional[]>('professionals:displayed', () => [])
  const loading = useState<boolean>('professionals:loading', () => false)
  const error = useState<string | null>('professionals:error', () => null)
  const total = useState<number>('professionals:total', () => 0)
  const states = useState<string[]>('professionals:states', () => [])
  const cities = useState<string[]>('professionals:cities', () => [])

  // Lazy loading
  const pageSize = ref(20)
  const displayedCount = ref(0)
  const lastFilters = ref<Filters>()
  const loadingMore = ref(false)

  async function load() {
    if (professionals.value.length === 0) {
      await fetchAll()
    }
  }

  async function fetchAll(filters?: Filters) {
    loading.value = true
    error.value = null
    displayedCount.value = 0
    lastFilters.value = filters

    let query = supabase.from('professionals').select('*', { count: 'exact' })

    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,profession.ilike.%${filters.search}%`)
    }
    if (filters?.category) {
      query = query.eq('category', filters.category)
    }
    if (filters?.availableOnly) {
      query = query.eq('available', true)
    }
    if (filters?.minRate) {
      query = query.gte('hourly_rate', filters.minRate)
    }
    if (filters?.maxRate) {
      query = query.lte('hourly_rate', filters.maxRate)
    }
    if (filters?.state) {
      query = query.eq('state', filters.state)
    }
    if (filters?.city) {
      query = query.eq('city', filters.city)
    }

    switch (filters?.sortBy) {
      case 'price_asc':
        query = query.order('hourly_rate', { ascending: true })
        break
      case 'price_desc':
        query = query.order('hourly_rate', { ascending: false })
        break
      case 'distance':
        query = query.order('distance_km', { ascending: true })
        break
      default:
        query = query.order('rating', { ascending: false })
    }

    const { data, error: err, count } = await query

    if (err) {
      error.value = err.message
    } else {
      professionals.value = data as Professional[]
      total.value = count ?? 0
      loadMore()
    }

    loading.value = false
  }

  async function loadMore() {
    if (loadingMore.value || !hasMore()) return

    loadingMore.value = true
    // Simulate slight delay for UX
    await new Promise(resolve => setTimeout(resolve, 300))

    const nextCount = displayedCount.value + pageSize.value
    displayedProfessionals.value = professionals.value.slice(0, nextCount)
    displayedCount.value = nextCount

    loadingMore.value = false
  }

  function hasMore() {
    return displayedCount.value < professionals.value.length
  }

  function getById(id: string) {
    return professionals.value.find(p => p.id === id)
  }

  async function fetchStates() {
    const { data, error: err } = await supabase
      .from('professionals')
      .select('state')
      .order('state', { ascending: true })

    if (!err && data) {
      const uniqueStates = [...new Set(data.map(p => p.state))].filter(Boolean)
      states.value = uniqueStates as string[]
    }
  }

  async function fetchCities(state?: string) {
    let query = supabase.from('professionals').select('city')

    if (state) {
      query = query.eq('state', state)
    }

    const { data, error: err } = await query.order('city', { ascending: true })

    if (!err && data) {
      const uniqueCities = [...new Set(data.map(p => p.city))].filter(Boolean)
      cities.value = uniqueCities as string[]
    }
  }

  return {
    professionals,
    displayedProfessionals,
    loading,
    loadingMore,
    error,
    total,
    states,
    cities,
    pageSize,
    displayedCount,
    fetchAll,
    load,
    loadMore,
    hasMore,
    getById,
    fetchStates,
    fetchCities,
  }
}