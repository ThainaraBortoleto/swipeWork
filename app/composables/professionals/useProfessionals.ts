import type { Professional } from '~/types'
import type { Filters } from './useFilters'

export function useProfessionals() {
  const supabase = useSupabase()
  const professionals = useState<Professional[]>('professionals', () => [])
  const loading = useState<boolean>('professionals:loading', () => false)
  const error = useState<string | null>('professionals:error', () => null)
  const total = useState<number>('professionals:total', () => 0)
  const states = useState<string[]>('professionals:states', () => [])
  const cities = useState<string[]>('professionals:cities', () => [])

  async function load() {
    if (professionals.value.length === 0) {
      await fetchAll()
    }
  }

  async function fetchAll(filters?: Filters) {
    loading.value = true
    error.value = null

    let query = supabase.from('professionals').select('*', { count: 'exact' })

    if (filters?.search) {
      console.log('🔎 Aplicando filtro de busca:', filters.search)
      query = query.or(`name.ilike.%${filters.search}%,profession.ilike.%${filters.search}%`)
    }
    if (filters?.category) {
      console.log('📁 Aplicando filtro de categoria:', filters.category)
      query = query.eq('category', filters.category)
    }
    if (filters?.availableOnly) {
      console.log('✅ Filtrando apenas profissionais disponíveis')
      query = query.eq('available', true)
    }
    if (filters?.minRate) {
      console.log('💰 Filtro de taxa mínima:', filters.minRate)
      query = query.gte('hourly_rate', filters.minRate)
    }
    if (filters?.maxRate) {
      console.log('💰 Filtro de taxa máxima:', filters.maxRate)
      query = query.lte('hourly_rate', filters.maxRate)
    }
    if (filters?.state) {
      console.log('📍 Aplicando filtro de estado:', filters.state)
      query = query.eq('state', filters.state)
    }
    if (filters?.city) {
      console.log('🏙️ Aplicando filtro de cidade:', filters.city)
      query = query.eq('city', filters.city)
    }

    switch (filters?.sortBy) {
      case 'price_asc':
        console.log('📊 Ordenando por preço (ascendente)')
        query = query.order('hourly_rate', { ascending: true }); break
      case 'price_desc':
        console.log('📊 Ordenando por preço (descendente)')
        query = query.order('hourly_rate', { ascending: false }); break
      case 'distance':
        console.log('📊 Ordenando por distância')
        query = query.order('distance_km', { ascending: true }); break
      default:
        console.log('📊 Ordenando por rating')
        query = query.order('rating', { ascending: false })
    }

    const { data, error: err, count } = await query

    if (err) {
      console.error('❌ Erro ao buscar profissionais:', err.message)
      error.value = err.message
    } else {
      console.log('✅ Profissionais retornados:', count ?? data?.length ?? 0)
      professionals.value = data as Professional[]
      total.value = count ?? 0
    }

    loading.value = false
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
    loading,
    error,
    total,
    states,
    cities,
    fetchAll,
    load,
    getById,
    fetchStates,
    fetchCities,
  }
}