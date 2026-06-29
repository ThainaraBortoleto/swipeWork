import { createClient } from '@supabase/supabase-js'

let supabaseClient: ReturnType<typeof createClient> | null = null

export async function useSupabase() {
  // Reutiliza instância no cliente
  if (supabaseClient) {
    return supabaseClient
  }

  const config = useRuntimeConfig()

  // Configura opções do Supabase client
  let options: any = {}

  // Para servidor (Node.js), configurar WebSocket transport
  if (process.server) {
    try {
      // Importa dinamicamente ws para evitar erro de módulo
      const ws = await import('ws')
      options.realtime = {
        transport: 'websocket',
      }
      options.global = {
        WebSocket: ws.default,
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