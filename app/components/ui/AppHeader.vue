<template>
  <header class="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-700">
    <div class="max-w-6xl mx-auto px-8 py-4 flex items-center justify-between">
      <!-- Logo -->
      <NuxtLink
        to="/"
        class="text-2xl font-black text-white hover:text-indigo-400 transition-colors"
      >
        SwipeWork
      </NuxtLink>

      <!-- Activity Button -->
      <NuxtLink
        to="/activity"
        class="relative group px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all duration-200 flex items-center gap-2"
      >
        <span class="text-lg">📊</span>
        <span class="text-sm font-medium">Atividade</span>

        <!-- Badge de matches -->
        <span
          v-if="matchCount > 0"
          class="ml-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold rounded-full bg-emerald-500 text-white"
        >
          {{ matchCount > 99 ? '99+' : matchCount }}
        </span>
      </NuxtLink>
    </div>
  </header>
</template>

<script setup lang="ts">
const { matches } = useMatches()

const matchCount = computed(() => matches.value.length)
</script>
