<template>
  <div
    :class="[
      'bg-slate-800 rounded-2xl overflow-hidden border transition-all duration-200 flex flex-col',
      isDeck
        ? 'border-indigo-500 shadow-lg shadow-indigo-500/20 h-full'
        : 'border-slate-700 hover:border-indigo-500'
    ]"
  >
    <!-- Link to details -->
    <NuxtLink
      :to="`/professionals/${professional.id}`"
      :class="['flex flex-col flex-1', isDeck ? 'overflow-y-auto' : '']"
    >
      <!-- Avatar -->
      <div class="relative" :class="isDeck ? '' : ''">
        <img
          :src="professional.avatar"
          :alt="professional.name"
          :class="['w-full object-cover bg-slate-700', isDeck ? 'h-48' : 'h-48']"
        />
        <span
          :class="[
            'absolute top-3 right-3 font-medium px-2.5 py-1 rounded-full text-xs',
            professional.available
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
          ]"
        >
          {{ professional.available ? 'Disponivel' : 'Ocupado' }}
        </span>
      </div>

      <!-- Info (scrollable in deck) -->
      <div class="flex flex-col gap-3" :class="[isDeck ? 'flex-1 overflow-y-auto p-5' : 'p-4']">
        <!-- Name, Profession, Location -->
        <div>
          <h3 class="text-white font-bold text-lg leading-tight">{{ professional.name }}</h3>
          <p class="text-indigo-400 text-sm font-medium">{{ professional.profession }}</p>
          <p class="text-slate-500 text-xs mt-0.5">{{ professional.city }}, {{ professional.state }}</p>
        </div>

        <!-- Rating (Enhanced in deck) -->
        <div v-if="isDeck" class="bg-slate-700/50 rounded-lg p-3 border border-slate-600">
          <div class="flex items-center gap-3">
            <div class="flex">
              <span
                v-for="i in 5"
                :key="i"
                class="text-lg"
                :class="i <= Math.round(professional.rating) ? 'text-amber-400' : 'text-slate-600'"
              >
                &#9733;
              </span>
            </div>
            <div>
              <span class="text-amber-400 text-lg font-bold">{{ professional.rating }}</span>
              <span class="text-slate-500 text-xs ml-1">({{ professional.review_count }} avaliações)</span>
            </div>
          </div>
        </div>
        <div v-else class="flex items-center gap-1.5">
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

        <!-- Hourly Rate -->
        <p class="text-white font-bold text-xl">
          R$ {{ professional.hourlyRate }}<span class="text-slate-400 text-sm font-normal">/h</span>
        </p>

        <!-- Description (only in deck) -->
        <div v-if="isDeck" class="border-t border-slate-700 pt-3">
          <p class="text-slate-400 text-xs font-medium mb-2">Sobre</p>
          <p class="text-slate-300 text-sm leading-relaxed">{{ professional.description }}</p>
        </div>

        <!-- Services (in deck and list) -->
        <div v-if="professional.services && professional.services.length > 0" :class="[isDeck ? 'bg-slate-700/50 rounded-lg p-3 border border-slate-600' : 'border-t border-slate-700 pt-3 mt-2']">
          <p class="text-slate-400 text-xs font-medium mb-2">Serviços</p>
          <ul class="flex flex-col gap-2">
            <li v-for="service in professional.services" :key="service" class="flex items-center gap-2 text-slate-300 text-sm">
              <span class="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0"></span>
              {{ service }}
            </li>
          </ul>
        </div>

        <!-- Response Time (only in deck) -->
        <div v-if="isDeck && professional.response_time_hours" class="border-t border-slate-700 pt-3">
          <p class="text-slate-400 text-xs font-medium mb-1">Tempo de resposta</p>
          <p class="text-slate-300 text-sm">{{ professional.response_time_hours }}h</p>
        </div>

        <!-- Especialidades/Tags -->
        <div v-if="professional.tags && professional.tags.length > 0" :class="[isDeck ? 'bg-slate-700/50 rounded-lg p-3 border border-slate-600' : 'border-t border-slate-700 pt-3 mt-1']">
          <p v-if="isDeck" class="text-slate-400 text-xs font-medium mb-2">Especialidades</p>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="tag in professional.tags.slice(0, isDeck ? professional.tags.length : 3)"
              :key="tag"
              :class="['text-xs px-2.5 py-1 rounded-full', isDeck ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'bg-slate-700 text-slate-300']"
            >
              {{ tag }}
            </span>
          </div>
        </div>
      </div>
    </NuxtLink>

    <!-- Action button (only in list or desktop deck) -->
    <div v-if="!isDeck || (isDeck && !isMobile)" class="p-4 border-t border-slate-700 shrink-0">
      <button
        :class="[
          'w-full py-2 font-semibold text-sm rounded-lg transition-all border',
          isMatchedComputed
            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500'
            : 'bg-slate-700 hover:bg-emerald-500/20 text-emerald-400 hover:text-emerald-300 border-emerald-500/30 hover:border-emerald-500'
        ]"
        @click="handleMatch"
      >
        {{ isMatchedComputed ? '♥ Favoritado' : '♥ Favoritar' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Professional } from '~/types'

const props = defineProps<{
  professional: Professional
  isDeck?: boolean
}>()

const { width } = useWindowSize()
const isMobile = computed(() => width.value < 768)

const { addMatch, removeMatch, isMatched } = useMatches()

const isMatchedComputed = computed(() => isMatched(props.professional.id))

function handleMatch() {
  if (isMatchedComputed.value) {
    removeMatch(props.professional.id)
  } else {
    addMatch(props.professional)
  }
}
</script>