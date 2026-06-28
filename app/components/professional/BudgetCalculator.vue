<template>
  <div class="bg-slate-800 rounded-2xl p-6 border border-slate-700">
    <!-- Header -->
    <div class="mb-6">
      <p class="text-slate-400 text-sm mb-2">Calculadora de orçamento</p>
      <p class="text-xs text-slate-500">*Base de cálculo — conversas finais com o profissional podem gerar ajustes</p>
    </div>

    <!-- Hours input -->
    <div class="mb-6">
      <label class="text-slate-300 text-sm font-medium block mb-3">Quantas horas de trabalho?</label>
      <div class="flex items-center gap-3">
        <button
          class="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="hours <= 0.5"
          @click="incrementHours(-0.5)"
          aria-label="Diminuir horas"
        >
          −
        </button>

        <div class="flex-1 relative">
          <input
            type="number"
            :value="hours"
            step="0.5"
            min="0.5"
            class="w-full bg-slate-700 text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 text-center font-semibold"
            @input="setHours(parseFloat(($event.target as HTMLInputElement).value))"
          />
          <span class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">h</span>
        </div>

        <button
          class="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-colors"
          @click="incrementHours(0.5)"
          aria-label="Aumentar horas"
        >
          +
        </button>
      </div>

      <!-- Quick buttons -->
      <div class="flex gap-2 mt-3">
        <button
          v-for="option in [1, 2, 4, 8]"
          :key="option"
          class="flex-1 px-3 py-2 text-xs rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white transition-colors font-medium"
          @click="setHours(option)"
        >
          {{ option }}h
        </button>
      </div>
    </div>

    <!-- Breakdown -->
    <div class="space-y-3 p-4 bg-slate-700/50 rounded-lg mb-6">
      <div class="flex justify-between text-sm text-slate-300">
        <span>Valor/hora:</span>
        <span class="font-medium">R$ {{ breakdown.hourly.toFixed(2) }}</span>
      </div>
      <div class="flex justify-between text-sm text-slate-300">
        <span>Horas:</span>
        <span class="font-medium">{{ breakdown.hours.toFixed(1) }}</span>
      </div>
      <div class="border-t border-slate-600 pt-3 flex justify-between">
        <span class="text-white font-semibold">Total estimado:</span>
        <span class="text-2xl font-black text-indigo-400">R$ {{ totalBudget.toFixed(2) }}</span>
      </div>
    </div>

    <!-- Disclaimer -->
    <p class="text-xs text-slate-500 text-center italic">
      Este é apenas um cálculo estimado. O valor final será acordado diretamente com o profissional.
    </p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  hourlyRate: number
}>()

const { hours, totalBudget, breakdown, setHours, incrementHours } = useBudgetCalculator(props.hourlyRate)
</script>
