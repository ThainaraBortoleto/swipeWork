<template>
  <div class="flex flex-col items-center gap-8 w-full">
    <!-- Contador -->
    <div class="flex items-center justify-between w-full max-w-2xl px-4">
      <button
        class="text-slate-400 hover:text-white text-sm transition-colors"
        @click="$emit('back')"
      >
        ← Voltar
      </button>
      <span class="text-slate-500 text-sm">
        {{ remaining }} de {{ total }} restantes
      </span>
    </div>

    <!-- Deck Container -->
    <div class="relative w-full max-w-2xl mx-auto">
      <!-- Arrow Hints -->
      <div class="absolute top-1/2 left-0 right-0 -translate-y-1/2 z-20 px-4 flex justify-between pointer-events-none">
        <!-- Left Arrow (Reject) -->
        <div
          class="flex items-center gap-2 text-red-400/40 transition-all duration-300"
          :class="isDragging && dragX < -30 ? 'opacity-100 -translate-x-4' : 'opacity-40'"
        >
          <span class="text-4xl font-black">←</span>
          <span class="text-sm font-bold hidden sm:block">Rejeitar</span>
        </div>

        <!-- Right Arrow (Accept) -->
        <div
          class="flex items-center gap-2 text-emerald-400/40 transition-all duration-300"
          :class="isDragging && dragX > 30 ? 'opacity-100 translate-x-4' : 'opacity-40'"
        >
          <span class="text-sm font-bold hidden sm:block">Favoritar</span>
          <span class="text-4xl font-black">→</span>
        </div>
      </div>

      <!-- Deck -->
      <div class="relative w-full" style="height: 640px">
        <!-- Empty state -->
        <div
          v-if="isEmpty"
          class="absolute inset-0 bg-slate-800 rounded-2xl border border-slate-700 flex flex-col items-center justify-center gap-4"
        >
          <p class="text-white font-bold text-xl">Acabou por aqui!</p>
          <p class="text-slate-400 text-sm">Voce viu todos os profissionais desta categoria.</p>
          <button
            class="mt-2 px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-xl transition-colors"
            @click="deck.reset()"
          >
            Recomecar
          </button>
        </div>

        <!-- Cards -->
        <div
          v-for="(prof, index) in visibleCards"
          :key="prof.id"
          class="absolute inset-0 cursor-grab active:cursor-grabbing"
          :style="cardStyle(index)"
          v-bind="index === 0 ? dragBindings : {}"
        >
          <!-- Overlay de swipe -->
          <div
            v-if="index === 0 && dragOverlay"
            class="absolute inset-0 z-10 rounded-2xl flex items-center justify-center pointer-events-none"
            :class="dragOverlay === 'right' ? 'bg-emerald-500/20' : 'bg-red-500/20'"
          >
            <span
              class="text-6xl font-black border-4 rounded-xl px-4 py-2 rotate-[-15deg]"
              :class="dragOverlay === 'right' ? 'text-emerald-400 border-emerald-400' : 'text-red-400 border-red-400'"
            >
              {{ dragOverlay === 'right' ? '♥ SIM' : '✕ NAO' }}
            </span>
          </div>

          <ProfessionalCard :professional="prof" class="h-full" />
        </div>
      </div>
    </div>

    <!-- Stats -->
    <div class="flex gap-8 max-w-sm w-full text-center text-sm">
      <div class="flex-1">
        <p class="text-red-400 font-bold">{{ skipCount }}</p>
        <p class="text-slate-500 text-xs">Rejeitados</p>
      </div>
      <div class="flex-1">
        <p class="text-emerald-400 font-bold">{{ matchCount }}</p>
        <p class="text-slate-500 text-xs">Matches</p>
      </div>
    </div>

    <!-- Botoes -->
    <div class="flex items-center gap-8">
      <button
        class="w-16 h-16 rounded-full bg-slate-800 border-2 border-red-500/40 text-red-400
               flex items-center justify-center hover:bg-red-500/10 hover:border-red-500
               transition-all duration-200 active:scale-95 disabled:opacity-40 text-2xl font-bold"
        :disabled="isEmpty || deck.isAnimating.value"
        @click="handleSkip"
        title="Seta esquerda ou X"
      >
        ✕
      </button>

      <button
        class="w-16 h-16 rounded-full bg-slate-800 border-2 border-emerald-500/40 text-emerald-400
               flex items-center justify-center hover:bg-emerald-500/10 hover:border-emerald-500
               transition-all duration-200 active:scale-95 disabled:opacity-40 text-2xl"
        :disabled="isEmpty || deck.isAnimating.value"
        @click="handleMatch"
        title="Seta direita ou Enter"
      >
        ♥
      </button>
    </div>

    <!-- Dica teclado -->
    <p class="hidden md:block text-slate-600 text-xs">
      Use as setas do teclado para navegar
    </p>

    <!-- Feedback visual de keyboard action -->
    <Transition
      enter-active-class="transition-all duration-300"
      leave-active-class="transition-all duration-300"
      enter-from-class="opacity-0 scale-90"
      leave-to-class="opacity-0 scale-90"
    >
      <div
        v-if="showKeyboardFeedback"
        class="fixed top-8 left-1/2 -translate-x-1/2 z-50"
      >
        <div
          class="px-6 py-3 rounded-2xl font-bold text-white text-lg shadow-lg flex items-center gap-2"
          :class="keyboardFeedbackType === 'match'
            ? 'bg-emerald-500'
            : 'bg-red-500'"
        >
          <span v-if="keyboardFeedbackType === 'match'" class="text-2xl">♥</span>
          <span v-else class="text-2xl">✕</span>
          <span>{{ keyboardFeedbackType === 'match' ? 'Adicionado!' : 'Rejeitado!' }}</span>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import type { Professional } from '~/types'

const props = defineProps<{
  professionals: Professional[]
}>()

const emit = defineEmits<{
  match: [professional: Professional]
  skip: [professional: Professional]
  back: []
}>()

const listRef = computed(() => props.professionals)
const deck = useSwipeDeck(listRef)
const { current, remaining, isEmpty, visibleCards } = deck
const { addMatch, addSkip } = useMatches()

const total = computed(() => props.professionals.length)
const matchCount = computed(() => {
  const { matches } = useMatches()
  return matches.value.length
})
const skipCount = computed(() => {
  const { skips } = useMatches()
  return skips.value.length
})

// Drag com mouse
const dragX = ref(0)
const isDragging = ref(false)

const dragOverlay = computed(() => {
  if (!isDragging.value) return null
  if (dragX.value > 60) return 'right'
  if (dragX.value < -60) return 'left'
  return null
})

function onMouseDown(e: MouseEvent) {
  const startX = e.clientX
  isDragging.value = true

  function onMove(e: MouseEvent) {
    dragX.value = e.clientX - startX
  }

  async function onUp() {
    isDragging.value = false
    if (Math.abs(dragX.value) > 100) {
      if (dragX.value < 0) await handleSkip()
      else await handleMatch()
    }
    dragX.value = 0
    window.removeEventListener('mousemove', onMove)
    window.removeEventListener('mouseup', onUp)
  }

  window.addEventListener('mousemove', onMove)
  window.addEventListener('mouseup', onUp)
}

const dragBindings = { onMousedown: onMouseDown }

function cardStyle(index: number) {
  const isTop = index === 0
  const rotate = isTop && isDragging.value ? dragX.value * 0.08 : 0
  const translateX = isTop && isDragging.value ? dragX.value : 0
  const scale = 1 - index * 0.04
  const translateY = index * 12

  return {
    transform: `translateX(${translateX}px) rotate(${rotate}deg) scale(${scale}) translateY(${translateY}px)`,
    transition: isDragging.value && isTop ? 'none' : 'transform 0.3s ease',
    zIndex: 10 - index,
  }
}

async function handleSkip() {
  if (!current.value || deck.isAnimating.value) return
  const prof = current.value
  addSkip(prof)
  await deck.swipeLeft()
  emit('skip', prof)
}

async function handleMatch() {
  if (!current.value || deck.isAnimating.value) return
  const prof = current.value
  addMatch(prof)
  await deck.swipeRight()
  emit('match', prof)
}

// Keyboard feedback
const showKeyboardFeedback = ref(false)
const keyboardFeedbackType = ref<'match' | 'skip'>('match')

function showFeedback(type: 'match' | 'skip') {
  keyboardFeedbackType.value = type
  showKeyboardFeedback.value = true
  setTimeout(() => {
    showKeyboardFeedback.value = false
  }, 2000)
}

// Teclado
onMounted(() => window.addEventListener('keydown', onKeyDown))
onUnmounted(() => window.removeEventListener('keydown', onKeyDown))

async function onKeyDown(e: KeyboardEvent) {
  if (e.key === 'ArrowLeft') {
    showFeedback('skip')
    await handleSkip()
  }
  if (e.key === 'ArrowRight') {
    showFeedback('match')
    await handleMatch()
  }
}
</script>