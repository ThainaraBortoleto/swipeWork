import { createClient } from '@supabase/supabase-js'
import ws from 'ws'

let supabaseClient: ReturnType<typeof createClient> | null = null

export function useSupabase() {
  if (supabaseClient) {
    return supabaseClient
  }

  const config = useRuntimeConfig()

  supabaseClient = createClient(
    config.public.supabaseUrl as string,
    config.public.supabaseKey as string,
    {
      realtime: {
        transport: ws,
      },
    }
  )

  return supabaseClient
}