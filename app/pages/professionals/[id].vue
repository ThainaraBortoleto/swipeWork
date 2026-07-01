<template>
  <div class="min-h-screen bg-slate-900">
    <!-- Header -->
    <div class="px-8 pt-8 pb-4">
      <button
        class="text-slate-400 hover:text-white text-sm transition-colors"
        @click="$router.back()"
      >
        Voltar
      </button>
    </div>

    <!-- Conteudo -->
    <div v-if="professional" class="max-w-2xl mx-auto px-8 pb-16">
      <!-- Avatar e info principal -->
      <div class="flex items-start gap-6 mb-8">
        <img
          :src="professional.avatar"
          :alt="professional.name"
          class="w-24 h-24 rounded-2xl bg-slate-700 object-cover"
        />
        <div class="flex-1">
          <h1 class="text-3xl font-black text-white">{{ professional.name }}</h1>
          <p class="text-indigo-400 font-semibold text-lg">{{ professional.profession }}</p>
          <p class="text-slate-500 text-sm mt-1">{{ professional.location.city }}, {{ professional.location.state }}</p>
        </div>
      </div>

      <!-- Disponibilidade e valor -->
      <div class="flex items-center justify-between bg-slate-800 rounded-2xl p-6 mb-6 border border-slate-700">
        <div>
          <p class="text-slate-400 text-sm mb-1">Valor por hora</p>
          <p class="text-white text-3xl font-black">R$ {{ professional.hourlyRate }}<span class="text-slate-400 text-base font-normal">/h</span></p>
        </div>
        <span
          class="text-sm font-medium px-4 py-2 rounded-full border"
          :class="professional.available
            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
            : 'bg-amber-500/10 text-amber-400 border-amber-500/30'"
        >
          {{ professional.available ? 'Disponivel agora' : 'Ocupado' }}
        </span>
      </div>

      <!-- Calculadora de orçamento -->
      <ProfessionalBudgetCalculator
        :hourly-rate="professional.hourlyRate"
        class="mb-6"
      />

      <!-- Rating -->
      <div class="bg-slate-800 rounded-2xl p-6 mb-6 border border-slate-700">
        <p class="text-slate-400 text-sm mb-3">Avaliacao</p>
        <div class="flex items-center gap-3">
          <span class="text-4xl font-black text-white">{{ professional.rating }}</span>
          <div class="flex flex-col gap-1">
            <div class="flex">
              <span
                v-for="i in 5"
                :key="i"
                class="text-xl"
                :class="i <= Math.round(professional.rating) ? 'text-amber-400' : 'text-slate-600'"
              >
                &#9733;
              </span>
            </div>
            <span class="text-slate-500 text-sm">{{ professional.reviewCount }} avaliacoes</span>
          </div>
        </div>
      </div>

      <!-- Descricao -->
      <div class="bg-slate-800 rounded-2xl p-6 mb-6 border border-slate-700">
        <p class="text-slate-400 text-sm mb-3">Sobre</p>
        <p class="text-white leading-relaxed">{{ professional.description }}</p>
      </div>

      <!-- Servicos -->
      <div class="bg-slate-800 rounded-2xl p-6 mb-6 border border-slate-700">
        <p class="text-slate-400 text-sm mb-4">Servicos</p>
        <ul class="flex flex-col gap-2">
          <li
            v-for="service in professional.services"
            :key="service"
            class="flex items-center gap-2 text-white"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0"></span>
            {{ service }}
          </li>
        </ul>
      </div>

      <!-- Tags -->
      <div class="bg-slate-800 rounded-2xl p-6 mb-8 border border-slate-700">
        <p class="text-slate-400 text-sm mb-4">Especialidades</p>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="tag in professional.tags"
            :key="tag"
            class="text-sm bg-slate-700 text-slate-300 px-3 py-1 rounded-full"
          >
            {{ tag }}
          </span>
        </div>
      </div>

      <!-- CTAs -->
      <div class="flex gap-3">
        <!-- Skip Button -->
        <button
          class="flex-1 py-4 bg-slate-700 hover:bg-red-500/20 text-red-400 hover:text-red-300 font-bold text-lg rounded-2xl transition-colors border-2 border-red-500/30 hover:border-red-500"
          @click="handleSkip"
        >
          ✕ Passar
        </button>

        <!-- Match Button -->
        <button
          :class="[
            'flex-1 py-4 font-bold text-lg rounded-2xl transition-all',
            isMatchedComputed
              ? 'bg-emerald-500/20 text-emerald-300 border-2 border-emerald-500'
              : 'bg-emerald-500 hover:bg-emerald-600 text-white border-2 border-emerald-500'
          ]"
          @click="handleMatch"
        >
          {{ isMatchedComputed ? '♥ Adicionado' : '♥ Favoritar' }}
        </button>
      </div>

      <!-- Contact Button -->
      <button
        class="w-full mt-3 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-base rounded-2xl transition-colors"
        @click="handleContact"
      >
        💬 Entrar em contato
      </button>
    </div>

    <!-- Not found -->
    <div v-else class="flex flex-col items-center justify-center min-h-screen gap-4">
      <p class="text-white text-xl font-bold">Profissional nao encontrado</p>
      <button
        class="text-indigo-400 hover:text-indigo-300 transition-colors"
        @click="$router.back()"
      >
        Voltar
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  ssr: false,
})

const route = useRoute()
const router = useRouter()
const { getById, load, professionals } = useProfessionals()
const { addMatch, removeMatch, addSkip, isMatched } = useMatches()
const { success: showSuccess } = useToast()

await useAsyncData('professional-detail', async () => {
  await load()
  return true
})

const professional = computed(() => getById(route.params.id as string))
const isMatchedComputed = computed(() => professional.value ? isMatched(professional.value.id) : false)

function handleMatch() {
  if (professional.value) {
    if (isMatchedComputed.value) {
      removeMatch(professional.value.id)
    } else {
      addMatch(professional.value)
    }
  }
}

function handleSkip() {
  if (professional.value) {
    addSkip(professional.value)
    router.back()
  }
}

async function handleContact() {
  if (professional.value) {
    // Simular delay de envio (500ms)
    await new Promise(resolve => setTimeout(resolve, 500))

    // Mostrar notificação elegante de sucesso
    showSuccess(`Mensagem enviada para ${professional.value.name}!`, 4000)
  }
}

useSeoMeta({
  title: () => professional.value ? `${professional.value.name} - ${professional.value.profession} | SwipeWork` : 'SwipeWork',
  description: () => professional.value
    ? `${professional.value.name} - ${professional.value.profession}. Avaliação: ${professional.value.rating}/5. R$ ${professional.value.hourlyRate}/h.`
    : 'Encontre profissionais freelancers qualificados no SwipeWork',
  ogTitle: () => professional.value ? `${professional.value.name} - ${professional.value.profession}` : 'SwipeWork',
  ogDescription: () => professional.value ? professional.value.description : 'Catálogo interativo de profissionais freelancers',
  ogImage: () => professional.value ? professional.value.avatar : undefined,
  ogType: 'profile',
  twitterCard: 'summary_large_image',
})
</script>