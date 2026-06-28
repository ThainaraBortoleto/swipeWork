import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import { config } from 'dotenv'

config() // carrega o .env

const supabase = createClient(
  process.env.NUXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

const data = JSON.parse(
  readFileSync(resolve(process.cwd(), 'scripts/output/professionals.json'), 'utf-8')
)

const BATCH_SIZE = 50
let inserted = 0

for (let i = 0; i < data.length; i += BATCH_SIZE) {
  const batch = data.slice(i, i + BATCH_SIZE)
  const { error } = await supabase.from('professionals').insert(batch)

  if (error) {
    console.error(`Erro no lote ${i}:`, error.message)
  } else {
    inserted += batch.length
    console.log(` ${inserted}/${data.length} inseridos`)
  }
}

console.log('\n Seed concluído!')