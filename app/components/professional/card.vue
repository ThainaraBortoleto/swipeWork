<template>
  <NuxtLink
    :to="`/professionals/${professional.id}`"
    class="block bg-slate-800 rounded-1xl overflow-hidden border border-slate-700 hover:border-indigo-500 transition-all duration-200"
  >
    <!-- Avatar -->
    <div class="relative">
      <img
        :src="professional.avatar"
        :alt="professional.name"
        class="w-full h-48 object-cover bg-slate-700"
      />
      <span
        class="absolute top-3 right-3 text-xs font-medium px-2.5 py-1 rounded-full"
        :class="professional.available
          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'"
      >
        {{ professional.available ? 'Disponivel' : 'Ocupado' }}
      </span>
    </div>

    <!-- Info -->
    <div class="p-4 flex flex-col gap-2">
      <div>
        <h3 class="text-white font-bold text-lg leading-tight">{{ professional.name }}</h3>
        <p class="text-indigo-400 text-sm font-medium">{{ professional.profession }}</p>
        <p class="text-slate-500 text-xs mt-0.5">{{ professional.city }}, {{ professional.state }}</p>
      </div>

      <div class="flex items-center gap-1.5">
        <div class="flex">
          <span
            v-for="i in 5"
            :key="i"
            class="text-sm"
            :class="i <= Math.round(professional.rating) ? 'text-amber-400' : 'text-slate-600'"
          >
            &#9733;
          </span>
        </div>
        <span class="text-amber-400 text-sm font-medium">{{ professional.rating }}</span>
        <span class="text-slate-500 text-xs">({{ professional.review_count }})</span>
      </div>

      <p class="text-white font-bold text-xl">
        R$ {{ professional.hourly_rate }}<span class="text-slate-400 text-sm font-normal">/h</span>
      </p>

      <div class="flex flex-wrap gap-1.5 mt-1">
        <span
          v-for="tag in professional.tags.slice(0, 3)"
          :key="tag"
          class="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full"
        >
          {{ tag }}
        </span>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Professional } from '~/types'

defineProps<{
  professional: Professional
}>()
</script>