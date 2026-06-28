<template>
  <div class="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-8">
    <!-- Header -->
    <div class="text-center mb-8">
      <h1 class="text-5xl font-black text-white mb-2">SwipeWork</h1>
      <p class="text-slate-400 text-lg">Escolha uma categoria para comecar</p>
      <p v-if="selectedState || selectedCity" class="text-indigo-400 text-sm mt-2 font-medium">
        📍 Filtrando: {{ selectedCity || selectedState }}
      </p>
    </div>

    <!-- Filtro de Localidade -->
    <div class="w-full max-w-3xl mb-8">
      <div class="bg-slate-800 rounded-2xl p-6 border border-slate-700">
        <h3 class="text-white font-bold text-sm mb-4">📍 Filtrar por Localização</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <!-- Estado -->
          <div>
            <label class="block text-slate-400 text-xs font-medium mb-2">Estado</label>
            <select
              v-model="selectedState"
              class="w-full bg-slate-700 text-white px-4 py-2.5 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 text-sm cursor-pointer"
              @change="onStateChange"
            >
              <option value="">Todos os estados</option>
              <option v-for="state in states" :key="state" :value="state">
                {{ state }}
              </option>
            </select>
          </div>

          <!-- Cidade -->
          <div>
            <label class="block text-slate-400 text-xs font-medium mb-2">
              Cidade
              <span v-if="!selectedState" class="text-slate-600">(selecione estado)</span>
            </label>
            <select
              v-model="selectedCity"
              :disabled="!selectedState"
              class="w-full bg-slate-700 text-white px-4 py-2.5 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              @change="onCityChange"
            >
              <option value="">Todas as cidades</option>
              <option v-for="city in cities" :key="city" :value="city">
                {{ city }}
              </option>
            </select>
          </div>
        </div>

        <!-- Botões de Ação -->
        <div class="flex gap-2 mt-4">
          <button
            v-if="selectedState || selectedCity"
            class="flex-1 py-2.5 px-4 bg-slate-700 hover:bg-slate-600 text-slate-300 font-semibold text-sm rounded-lg transition-colors"
            @click="clearLocation"
          >
            Limpar
          </button>
        </div>

        <!-- Info de Filtro Ativo -->
        <div
          v-if="filterStore.state || filterStore.city"
          class="mt-4 p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/30"
        >
          <p class="text-emerald-400 text-xs font-medium">
            ✓ Filtro ativo: <span class="font-bold">{{ filterStore.city || filterStore.state }}</span>
          </p>
        </div>

      </div>
    </div>

    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 w-full max-w-3xl">
      <button
        v-for="cat in categories"
        :key="cat.value"
        class="flex flex-col items-center gap-3 p-6 rounded-2xl transition-all duration-200 group"
        :class="cat.count > 0
          ? 'bg-slate-800 border border-slate-700 hover:border-indigo-500 hover:bg-slate-700 cursor-pointer'
          : 'bg-slate-800/50 border border-slate-700/50 opacity-50 cursor-not-allowed'"
        :disabled="cat.count === 0"
        @click="cat.count > 0 && $emit('select', cat.value)"
      >
        <span class="text-3xl">{{ cat.emoji }}</span>
        <span class="text-white font-semibold text-sm text-center">{{ cat.label }}</span>
        <span
          class="text-xs"
          :class="cat.count > 0 ? 'text-slate-500' : 'text-slate-600'"
        >
          {{ cat.count }} {{ cat.count === 1 ? 'profissional' : 'profissionais' }}
        </span>
        <span v-if="cat.count === 0" class="text-xs text-slate-500 mt-1">
          (sem profissionais)
        </span>
      </button>
    </div>

    <button
      class="mt-10 text-slate-500 hover:text-slate-300 text-sm underline underline-offset-4 transition-colors"
      @click="$emit('viewAll')"
    >
      Ver todos em lista
    </button>
  </div>
</template>

<script setup lang="ts">
import type { Category } from '~/types'
import { useFilterStore } from '~/stores/filter'

const props = defineProps<{
  counts: Record<string, number>
}>()

const emit = defineEmits<{
  select: [category: Category]
  viewAll: []
  'apply-filters': []
}>()

const filterStore = useFilterStore()
const { states, cities, fetchStates, fetchCities } = useProfessionals()

const selectedState = ref(filterStore.state)
const selectedCity = ref(filterStore.city)

async function onStateChange() {
  console.log('🔄 Estado selecionado:', selectedState.value)
  selectedCity.value = ''

  if (selectedState.value) {
    await fetchCities(selectedState.value)
  } else {
    cities.value = []
  }

  // Atualiza store Pinia IMEDIATAMENTE para reagir em tempo real
  filterStore.setStateFilter(selectedState.value)
}

async function onCityChange() {
  console.log('🔄 Cidade selecionada:', selectedCity.value)
  // Atualiza store Pinia IMEDIATAMENTE para reagir em tempo real
  filterStore.setCityFilter(selectedCity.value)
}

function clearLocation() {
  selectedState.value = ''
  selectedCity.value = ''
  filterStore.clearLocationFilters()
  cities.value = []
  emit('apply-filters')
  console.log('✅ Filtros limpos')
}

// Watchers para sincronizar Pinia com seleção local
watch(
  () => filterStore.state,
  (newState) => {
    if (newState !== selectedState.value) {
      selectedState.value = newState
    }
  }
)

watch(
  () => filterStore.city,
  (newCity) => {
    if (newCity !== selectedCity.value) {
      selectedCity.value = newCity
    }
  }
)

onMounted(async () => {
  await fetchStates()
  // Sincroniza com filtros já aplicados
  selectedState.value = filterStore.state
  selectedCity.value = filterStore.city
  if (filterStore.state) {
    await fetchCities(filterStore.state)
  }
})

const categoryDefinitions = [
  { value: 'desenvolvimento', label: 'Desenvolvimento', emoji: '💻' },
  { value: 'design', label: 'Design', emoji: '🎨' },
  { value: 'marketing', label: 'Marketing', emoji: '📈' },
  { value: 'fotografia', label: 'Fotografia', emoji: '📷' },
  { value: 'video', label: 'Video', emoji: '🎬' },
  { value: 'redacao', label: 'Redacao', emoji: '✍️' },
  { value: 'saude', label: 'Saude', emoji: '💪' },
  { value: 'educacao', label: 'Educacao', emoji: '📚' },
  { value: 'reforma', label: 'Reforma', emoji: '🔧' },
  { value: 'domestico', label: 'Domestico', emoji: '🏠' },
  { value: 'consultoria', label: 'Consultoria', emoji: '💼' },
  { value: 'traducao', label: 'Traducao', emoji: '🌐' },
]

const categories = computed(() =>
  categoryDefinitions.map(cat => ({
    ...cat,
    count: props.counts[cat.value] ?? 0,
  }))
)
</script>