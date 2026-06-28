<template>
  <div class="min-h-screen bg-slate-900">
    <!-- Loading state -->
    <div
      v-if="professionals.length === 0"
      class="min-h-screen flex items-center justify-center"
    >
      <div class="flex flex-col items-center gap-4">
        <div class="w-12 h-12 border-4 border-slate-600 border-t-indigo-500 rounded-full animate-spin"></div>
        <p class="text-slate-400 text-sm">Carregando profissionais...</p>
      </div>
    </div>

    <!-- Catalog Picker -->
    <template v-else-if="!selectedCategory">
      <CatalogPicker
        :counts="categoryCounts"
        @select="selectCategory"
        @view-all="selectedCategory = null"
        @apply-filters="handleApplyFilters"
      />
    </template>

    <!-- Swipe/List View -->
    <div v-else class="min-h-screen">
      <!-- Toggle swipe / lista -->
      <div class="flex items-center justify-between px-8 py-3">
        <button
          class="text-slate-400 hover:text-white text-sm transition-colors"
          @click="selectedCategory = null"
        >
          Voltar
        </button>
        <button
          class="text-slate-400 hover:text-white text-sm border border-slate-700 px-4 py-2 rounded-xl transition-colors"
          @click="viewMode = viewMode === 'swipe' ? 'list' : 'swipe'"
        >
          {{ viewMode === 'swipe' ? 'Ver em lista' : 'Modo swipe' }}
        </button>
      </div>

      <!-- Swipe -->
      <div v-if="viewMode === 'swipe'" class="flex items-center justify-center flex-1 px-4 py-4">
        <ProfessionalSwipeDeck
          :professionals="professionals"
          :loading="loading"
          @match="onMatch"
          @skip="onSkip"
          @back="selectedCategory = null"
        />
      </div>

      <!-- Lista -->
      <div v-else class="p-8">
        <!-- Search -->
        <div class="mb-8">
          <input
            type="text"
            placeholder="Buscar por nome ou profissão..."
            class="w-full bg-slate-800 text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
            @input="handleSearchInput"
          />
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <!-- Sidebar com filtros -->
          <div class="lg:col-span-1">
            <div class="sticky top-24 space-y-6">
              <!-- Location Filter Component -->
              <ProfessionalLocationFilter v-if="viewMode === 'list'" />

              <!-- Info -->
              <div class="bg-slate-800 rounded-2xl p-4 border border-slate-700">
                <p class="text-white font-bold text-sm mb-2">{{ total }} profissional{{ total !== 1 ? 'is' : '' }} encontrado{{ total !== 1 ? 's' : '' }}</p>
                <p class="text-slate-500 text-xs">Categoria: <span class="text-slate-300 font-medium">{{ selectedCategory }}</span></p>
              </div>
            </div>
          </div>

          <!-- Cards Grid -->
          <div class="lg:col-span-3">
            <div v-if="professionals.length === 0" class="py-16 text-center">
              <p class="text-white text-lg font-bold mb-2">Nenhum profissional encontrado</p>
              <p class="text-slate-400 text-sm">Tente ajustar os filtros</p>
            </div>
            <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <ProfessionalCard
                v-for="professional in professionals"
                :key="professional.id"
                :professional="professional"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Category, Professional } from '~/types'
import { useFilterStore } from '~/stores/filter'

definePageMeta({
  ssr: false,
})

const { professionals, total, fetchAll, loading } = useProfessionals()
const filterStore = useFilterStore()

const selectedCategory = ref<Category | null>(null)
const viewMode = ref<'swipe' | 'list'>('swipe')
const isInitialized = ref(false)
const categoryCounts = ref<Record<string, number>>({})

function getStoreFilters() {
  return {
    search: filterStore.search,
    category: filterStore.category,
    minRate: filterStore.minRate,
    maxRate: filterStore.maxRate,
    availableOnly: filterStore.availableOnly,
    sortBy: filterStore.sortBy,
    state: filterStore.state,
    city: filterStore.city,
  }
}

function handleSearchInput(e: Event) {
  const value = (e.target as HTMLInputElement).value
  filterStore.setSearch(value)
  debouncedFetch()
}

const debouncedFetch = useDebounce(() => {
  fetchAll(getStoreFilters())
})

function recalculateCategoryCounts() {
  const counts: Record<string, number> = {}
  console.log('🔢 Calculando contadores para', professionals.value.length, 'profissionais')

  for (const p of professionals.value) {
    counts[p.category] = (counts[p.category] ?? 0) + 1
  }

  categoryCounts.value = counts
  console.log('✅ Contadores finais:', counts)
  console.log('📊 Total geral:', Object.values(counts).reduce((a, b) => a + b, 0), 'profissionais')
}

async function handleApplyFilters() {
  console.log('🔍 Iniciando aplicação de filtros')
  const filters = getStoreFilters()
  console.log('📋 Filtros a aplicar:', {
    state: filters.state,
    city: filters.city,
    category: filters.category,
    search: filters.search,
  })

  // Fetch com filtros do store
  await fetchAll(filters)
  console.log('✅ Fetch completado. Total de profissionais:', professionals.value.length)

  // Aguarda um tick de reatividade do Vue para garantir que professionals.value foi atualizado
  await nextTick()

  // Recalcula os contadores
  recalculateCategoryCounts()

  console.log('✅ Filtros aplicados com sucesso!')
  console.log('📊 Profissionais agora:', professionals.value.length)
  console.log('📊 Contadores finais:', categoryCounts.value)
}

// Watcher que recalcula contadores quando profissionais mudam
watch(
  professionals,
  () => {
    if (!selectedCategory.value && isInitialized.value) {
      console.log('⚡ Profissionais mudaram, atualizando contadores...')
      recalculateCategoryCounts()
    }
  },
  { deep: true }
)

// Reage imediatamente a mudanças de filtro de localização
watchEffect(async () => {
  // Ignora mudanças durante a inicialização
  if (!isInitialized.value) {
    return
  }

  // Acessa os valores reativos do store
  const state = filterStore.state
  const city = filterStore.city

  console.log('👀 [Store] Filtros mudaram:', { state, city })

  // Se não está em uma categoria (está no CatalogPicker)
  if (!selectedCategory.value) {
    console.log('✅ Recarregando profissionais com filtros:', { state, city })
    await fetchAll(getStoreFilters())
    console.log('📦 Total de profissionais após fetch:', professionals.value.length)
    await nextTick()
    recalculateCategoryCounts()
    console.log('📊 Contadores após limpeza:', categoryCounts.value)
  }
})

async function selectCategory(category: Category) {
  selectedCategory.value = category
  viewMode.value = 'swipe'
  filterStore.setCategory(category)

  // Fetch com todos os filtros (categoria + localidade)
  await fetchAll(getStoreFilters())
}

// Reseta categoria e recarrega dados quando volta para CatalogPicker
watch(
  () => selectedCategory.value,
  async (newCategory) => {
    if (newCategory === null) {
      console.log('🔄 Voltando para CatalogPicker, resetando e recarregando dados')
      filterStore.setCategory('')

      // Recarrega profissionais SEM filtro de categoria
      await fetchAll(getStoreFilters())
      await nextTick()
      recalculateCategoryCounts()
    }
  }
)

function onMatch(professional: Professional) {
  console.log('match:', professional.name)
}

function onSkip(professional: Professional) {
  console.log('skip:', professional.name)
}

onMounted(async () => {
  console.log('🚀 onMounted iniciado')
  console.log('📦 professionals.value.length antes:', professionals.value.length)

  // Fetch inicial SEM filtros para mostrar total de profissionais
  console.log('📥 Carregando profissionais iniciais...')
  await fetchAll()
  console.log('✅ Profissionais carregados:', professionals.value.length)

  // Aguarda que a reatividade se propague antes de recalcular
  await nextTick()
  console.log('⏳ Após nextTick, profissionais:', professionals.value.length)

  // Atualiza contadores no store com o total
  recalculateCategoryCounts()
  console.log('✅ Contadores calculados:', categoryCounts.value)

  // Marca inicialização como completa (permite watchers reagirem)
  isInitialized.value = true
  console.log('✅ Inicialização completa')
})
</script>