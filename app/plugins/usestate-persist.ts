export default defineNuxtPlugin(() => {
  if (process.client) {
    // Restaura matches do localStorage
    const matchesKey = 'nuxt-state-matches:list'
    const skipsKey = 'nuxt-state-skips:list'
    const historyKey = 'nuxt-state-matches:history'

    const savedMatches = localStorage.getItem(matchesKey)
    const savedSkips = localStorage.getItem(skipsKey)
    const savedHistory = localStorage.getItem(historyKey)

    if (savedMatches) {
      try {
        const { matches } = useMatches()
        matches.value = JSON.parse(savedMatches)
      } catch (e) {
        console.error('Erro ao restaurar matches:', e)
      }
    }

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

    // Monitora mudanças e salva no localStorage
    const { matches, skips, history } = useMatches()

    watch(
      matches,
      (newMatches) => {
        localStorage.setItem(matchesKey, JSON.stringify(newMatches))
      },
      { deep: true }
    )

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
