import { createClient } from '@supabase/supabase-js'

let supabaseClient: ReturnType<typeof createClient> | null = null

export function useSupabase() {
  if (supabaseClient) {
    return supabaseClient
  }

  const config = useRuntimeConfig()

  supabaseClient = createClient(
    config.public.supabaseUrl as string,
    config.public.supabaseKey as string,
  )

  return supabaseClient
}