<template>
  <div class="min-h-screen bg-slate-900">
    <!-- Header -->
    <div class="px-8 pt-8 pb-8">
      <div class="max-w-6xl mx-auto">
        <div class="flex items-center justify-between mb-8">
          <h1 class="text-4xl font-black text-white">Atividade</h1>
          <NuxtLink
            to="/"
            class="text-slate-400 hover:text-white text-sm transition-colors"
          >
            Voltar
          </NuxtLink>
        </div>

        <!-- Tabs -->
        <div class="flex gap-2 border-b border-slate-700">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            class="px-6 py-3 font-semibold text-sm transition-all relative"
            :class="activeTab === tab.id
              ? 'text-white'
              : 'text-slate-400 hover:text-white'"
            @click="activeTab = tab.id"
          >
            {{ tab.label }}
            <span
              v-if="tab.id === 'matches'"
              class="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs rounded-full"
              :class="matches.length > 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-500'"
            >
              {{ matches.length }}
            </span>
            <span
              v-else-if="tab.id === 'skips'"
              class="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs rounded-full"
              :class="skips.length > 0 ? 'bg-red-500/20 text-red-400' : 'bg-slate-700 text-slate-500'"
            >
              {{ skips.length }}
            </span>

            <div
              v-if="activeTab === tab.id"
              class="absolute bottom-0 left-0 right-0 h-1 bg-indigo-500 rounded-full"
            ></div>
          </button>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-6xl mx-auto px-8 pb-16">
      <!-- Matches Tab -->
      <div v-if="activeTab === 'matches'">
        <div v-if="matches.length === 0" class="py-16 text-center">
          <p class="text-white text-xl font-bold mb-2">Nenhum match ainda</p>
          <p class="text-slate-400 text-sm mb-6">Comece a explorar profissionais e clique em ♥ para adicionar à lista</p>
          <NuxtLink
            to="/"
            class="inline-block px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-xl transition-colors"
          >
            Explorar profissionais
          </NuxtLink>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="professional in matches"
            :key="professional.id"
            class="group bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 hover:border-emerald-500 transition-all duration-200"
          >
            <!-- Avatar -->
            <NuxtLink
              :to="`/professionals/${professional.id}`"
              class="relative overflow-hidden block aspect-square"
            >
              <img
                :src="professional.avatar"
                :alt="professional.name"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all"></div>
            </NuxtLink>

            <!-- Info -->
            <div class="p-4">
              <NuxtLink
                :to="`/professionals/${professional.id}`"
                class="block hover:text-indigo-400 transition-colors"
              >
                <h3 class="text-white font-bold text-lg leading-tight">{{ professional.name }}</h3>
                <p class="text-indigo-400 text-sm font-medium">{{ professional.profession }}</p>
              </NuxtLink>

              <div class="flex items-center gap-2 mt-2 mb-3">
                <div class="flex">
                  <span
                    v-for="i in 5"
                    :key="i"
                    class="text-xs"
                    :class="i <= Math.round(professional.rating) ? 'text-amber-400' : 'text-slate-600'"
                  >
                    ★
                  </span>
                </div>
                <span class="text-slate-500 text-xs">{{ professional.rating }} ({{ professional.review_count }})</span>
              </div>

              <p class="text-white font-bold text-lg mb-4">
                R$ {{ professional.hourly_rate }}<span class="text-slate-400 text-sm font-normal">/h</span>
              </p>

              <!-- Actions -->
              <div class="flex gap-2">
                <NuxtLink
                  :to="`/professionals/${professional.id}`"
                  class="flex-1 py-2 px-3 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 text-sm font-medium rounded-lg transition-colors text-center"
                >
                  Ver detalhes
                </NuxtLink>
                <button
                  class="py-2 px-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-medium rounded-lg transition-colors"
                  @click="removeMatch(professional.id)"
                  title="Remover match"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Skips Tab -->
      <div v-if="activeTab === 'skips'">
        <div v-if="skips.length === 0" class="py-16 text-center">
          <p class="text-white text-xl font-bold mb-2">Nenhum skip ainda</p>
          <p class="text-slate-400 text-sm">Profissionais que você rejeitou aparecerão aqui</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="professional in skips"
            :key="professional.id"
            class="group bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 hover:border-red-500 transition-all duration-200 opacity-75"
          >
            <!-- Avatar -->
            <div class="relative overflow-hidden block aspect-square">
              <img
                :src="professional.avatar"
                :alt="professional.name"
                class="w-full h-full object-cover"
              />
              <div class="absolute inset-0 bg-black/40"></div>
              <div class="absolute inset-0 flex items-center justify-center">
                <span class="text-4xl font-black text-red-400 opacity-70">✕</span>
              </div>
            </div>

            <!-- Info -->
            <div class="p-4">
              <h3 class="text-white font-bold text-lg leading-tight">{{ professional.name }}</h3>
              <p class="text-slate-400 text-sm">{{ professional.profession }}</p>

              <div class="flex gap-2 mt-4">
                <button
                  class="flex-1 py-2 px-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-sm font-medium rounded-lg transition-colors"
                  @click="undoSkip(professional.id)"
                  title="Desfazer rejeição"
                >
                  Desfazer
                </button>
                <button
                  class="py-2 px-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-medium rounded-lg transition-colors"
                  @click="removeSkip(professional.id)"
                  title="Remover"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- History Tab -->
      <div v-if="activeTab === 'history'">
        <div v-if="history.length === 0" class="py-16 text-center">
          <p class="text-white text-xl font-bold mb-2">Histórico vazio</p>
          <p class="text-slate-400 text-sm">Suas ações aparecerão aqui</p>
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="record in history"
            :key="record.id"
            class="bg-slate-800 rounded-xl p-4 border border-slate-700 flex items-center justify-between"
          >
            <div class="flex items-center gap-4 flex-1">
              <img
                :src="record.professional.avatar"
                :alt="record.professional.name"
                class="w-12 h-12 rounded-lg object-cover"
              />
              <div class="flex-1">
                <NuxtLink
                  :to="`/professionals/${record.professional.id}`"
                  class="text-white font-semibold hover:text-indigo-400 transition-colors"
                >
                  {{ record.professional.name }}
                </NuxtLink>
                <p class="text-slate-500 text-sm">{{ record.professional.profession }}</p>
              </div>
            </div>

            <div class="flex items-center gap-4">
              <div class="text-right">
                <p
                  class="text-sm font-semibold"
                  :class="record.type === 'match' ? 'text-emerald-400' : 'text-red-400'"
                >
                  {{ record.type === 'match' ? '♥ Match' : '✕ Rejeitado' }}
                </p>
                <p class="text-slate-500 text-xs">{{ formatTime(record.timestamp) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Professional } from '~/types'

const { matches, skips, history, removeMatch, removeSkip, addMatch } = useMatches()
const activeTab = ref<'matches' | 'skips' | 'history'>('matches')

const tabs = [
  { id: 'matches' as const, label: 'Matches' },
  { id: 'skips' as const, label: 'Rejeitados' },
  { id: 'history' as const, label: 'Histórico' },
]

function undoSkip(professionalId: string) {
  const professional = skips.value.find(p => p.id === professionalId)
  if (professional) {
    removeSkip(professionalId)
    addMatch(professional)
  }
}

function formatTime(timestamp: string) {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'agora'
  if (minutes < 60) return `${minutes}m atrás`
  if (hours < 24) return `${hours}h atrás`
  if (days < 7) return `${days}d atrás`

  return date.toLocaleDateString('pt-BR')
}

useSeoMeta({
  title: 'Atividade - SwipeWork',
})
</script>
