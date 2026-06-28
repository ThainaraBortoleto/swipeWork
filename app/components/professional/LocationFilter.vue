<template>
  <div class="bg-slate-800 rounded-2xl p-6 border border-slate-700">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-white font-bold text-lg">📍 Localização</h3>
      <button
        v-if="hasFilter"
        class="text-xs text-slate-400 hover:text-white transition-colors"
        @click="clearFilter"
      >
        Limpar
      </button>
    </div>

    <!-- State selector -->
    <div class="mb-4">
      <label class="block text-slate-400 text-sm font-medium mb-2">Estado</label>
      <select
        :value="filters.state"
        class="w-full bg-slate-700 text-white px-4 py-2.5 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer font-medium"
        @change="onStateChange"
      >
        <option value="">Todos os estados</option>
        <option v-for="state in states" :key="state" :value="state">
          {{ state }}
        </option>
      </select>
    </div>

    <!-- City selector -->
    <div>
      <label class="block text-slate-400 text-sm font-medium mb-2">
        Cidade
        <span v-if="!filters.state" class="text-slate-600 text-xs">(selecione estado)</span>
      </label>
      <select
        :value="filters.city"
        :disabled="!filters.state"
        class="w-full bg-slate-700 text-white px-4 py-2.5 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        @change="onCityChange"
      >
        <option value="">Todas as cidades</option>
        <option v-for="city in cities" :key="city" :value="city">
          {{ city }}
        </option>
      </select>
    </div>

    <!-- Info -->
    <div v-if="hasFilter" class="mt-4 p-3 bg-indigo-500/10 rounded-lg border border-indigo-500/30">
      <p class="text-indigo-400 text-xs font-medium">
        📍 {{ filters.city || filters.state }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
const { filters, resetLocation } = useFilters()
const { states, cities, fetchStates, fetchCities } = useProfessionals()

const hasFilter = computed(() => Boolean(filters.value.state || filters.value.city))

async function onStateChange(e: Event) {
  const state = (e.target as HTMLSelectElement).value
  filters.value.state = state
  filters.value.city = ''

  if (state) {
    await fetchCities(state)
  } else {
    cities.value = []
  }
}

function onCityChange(e: Event) {
  filters.value.city = (e.target as HTMLSelectElement).value
}

function clearFilter() {
  resetLocation()
  cities.value = []
}

onMounted(async () => {
  try {
    await fetchStates()
    console.log('Estados carregados:', states.value)
  } catch (err) {
    console.error('Erro ao carregar estados:', err)
  }
})
</script>
