import { defineNuxtPlugin } from '#app'
import { createPinia } from 'pinia'
import type { PiniaPluginContext } from 'pinia'

export default defineNuxtPlugin((nuxtApp) => {
  const pinia = nuxtApp.$pinia

  if (!pinia) return

  pinia.use((context: PiniaPluginContext) => {
    const { store } = context

    // Restaura estado do localStorage ao inicializar
    if (process.client) {
      const savedState = localStorage.getItem(`pinia-${store.$id}`)
      if (savedState) {
        try {
          const parsed = JSON.parse(savedState)
          store.$patch(parsed)
        } catch (e) {
          console.error(`Erro ao restaurar state de ${store.$id}:`, e)
        }
      }
    }

    // Salva estado no localStorage quando muda
    store.$subscribe(
      (mutation, state) => {
        if (process.client) {
          localStorage.setItem(`pinia-${store.$id}`, JSON.stringify(state))
        }
      },
      { detached: true }
    )
  })
})
