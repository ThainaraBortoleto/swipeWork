import type { Professional } from '~/types'

interface MatchRecord {
  id: string
  professionalId: string
  professional: Professional
  type: 'match' | 'skip'
  timestamp: string
}

export function useMatches() {
  const matches = useState<Professional[]>('matches:list', () => [])
  const skips = useState<Professional[]>('skips:list', () => [])
  const history = useState<MatchRecord[]>('matches:history', () => [])

  function addMatch(professional: Professional) {
    const exists = matches.value.some(p => p.id === professional.id)
    if (!exists) {
      matches.value.push(professional)
      addHistory(professional, 'match')
    }
  }

  function removeMatch(professionalId: string) {
    matches.value = matches.value.filter(p => p.id !== professionalId)
  }

  function addSkip(professional: Professional) {
    const exists = skips.value.some(p => p.id === professional.id)
    if (!exists) {
      skips.value.push(professional)
      addHistory(professional, 'skip')
    }
  }

  function removeSkip(professionalId: string) {
    skips.value = skips.value.filter(p => p.id !== professionalId)
  }

  function getMatches() {
    return matches.value
  }

  function getSkips() {
    return skips.value
  }

  function getHistory() {
    return history.value
  }

  function isMatched(professionalId: string) {
    return matches.value.some(p => p.id === professionalId)
  }

  function isSkipped(professionalId: string) {
    return skips.value.some(p => p.id === professionalId)
  }

  function addHistory(professional: Professional, type: 'match' | 'skip') {
    const record: MatchRecord = {
      id: `${professional.id}-${type}-${Date.now()}`,
      professionalId: professional.id,
      professional,
      type,
      timestamp: new Date().toISOString(),
    }
    history.value.unshift(record)
  }

  function clear() {
    matches.value = []
    skips.value = []
    history.value = []
  }

  return {
    matches,
    skips,
    history,
    addMatch,
    removeMatch,
    addSkip,
    removeSkip,
    getMatches,
    getSkips,
    getHistory,
    isMatched,
    isSkipped,
    addHistory,
    clear,
  }
}
