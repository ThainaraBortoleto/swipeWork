export default defineNuxtPlugin(() => {
  if (process.client) {
    // Restaura skips e history do localStorage (matches não persistem)
    const skipsKey = 'nuxt-state-skips:list'
    const historyKey = 'nuxt-state-matches:history'

    const savedSkips = localStorage.getItem(skipsKey)
    const savedHistory = localStorage.getItem(historyKey)

    if (savedSkips) {
      try {
        const { skips } = useMatches()
        skips.value = JSON.parse(savedSkips)
      } catch (e) {
        console.error('Erro ao restaurar skips:', e)
      }
    }

    if (savedHistory) {
      try {
        const { history } = useMatches()
        history.value = JSON.parse(savedHistory)
      } catch (e) {
        console.error('Erro ao restaurar history:', e)
      }
    }

    // Monitora mudanças e salva no localStorage (apenas skips e history)
    const { skips, history } = useMatches()

    watch(
      skips,
      (newSkips) => {
        localStorage.setItem(skipsKey, JSON.stringify(newSkips))
      },
      { deep: true }
    )

    watch(
      history,
      (newHistory) => {
        localStorage.setItem(historyKey, JSON.stringify(newHistory))
      },
      { deep: true }
    )
  }
})
