import type { Professional } from '~/types'

export function useSwipeDeck(list: Ref<Professional[]>) {
  const stack = ref<Professional[]>([])
  const isAnimating = ref(false)
  const dragX = ref(0)
  const isDragging = ref(false)

  watch(list, (newList) => {
    stack.value = [...newList]
  }, { immediate: true })

  const current = computed(() => stack.value[stack.value.length - 1])
  const remaining = computed(() => stack.value.length)
  const isEmpty = computed(() => stack.value.length === 0)
  const visibleCards = computed(() => stack.value.slice(-3).reverse())

  async function swipeLeft() {
    if (isAnimating.value || !current.value) return
    isAnimating.value = true
    await new Promise(resolve => setTimeout(resolve, 350))
    stack.value.pop()
    isAnimating.value = false
    dragX.value = 0
  }

  async function swipeRight() {
    if (isAnimating.value || !current.value) return
    isAnimating.value = true
    await new Promise(resolve => setTimeout(resolve, 350))
    stack.value.pop()
    isAnimating.value = false
    dragX.value = 0
  }

  function reset() {
    stack.value = [...list.value]
    dragX.value = 0
    isAnimating.value = false
  }

  return {
    stack,
    current,
    remaining,
    isEmpty,
    visibleCards,
    isAnimating,
    dragX,
    isDragging,
    swipeLeft,
    swipeRight,
    reset,
  }
}