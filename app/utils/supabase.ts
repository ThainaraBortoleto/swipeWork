import { createClient } from '@supabase/supabase-js'

let supabaseClient: ReturnType<typeof createClient> | null = null

export function useSupabase() {
  // Reutiliza instância no cliente
  if (supabaseClient) {
    return supabaseClient
  }

  const config = useRuntimeConfig()

  // Configura opções do Supabase client
  const options: any = {}

  // Para servidor (Node.js), configurar WebSocket transport
  if (typeof process !== 'undefined' && process.versions?.node) {
    try {
      // Tenta importar ws se disponível
      options.realtime = {
        transport: 'websocket',
      }
    } catch (e) {
      // Ignora se ws não estiver disponível
    }
  }

  supabaseClient = createClient(
    config.public.supabaseUrl as string,
    config.public.supabaseKey as string,
    options,
  )

  return supabaseClient
}