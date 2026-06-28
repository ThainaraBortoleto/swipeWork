import { createClient } from '@supabase/supabase-js'
import { readFileSync, existsSync } from 'fs'
import { resolve } from 'path'
import { config } from 'dotenv'

config() // carrega o .env

const supabase = createClient(
  process.env.NUXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

async function seedDatabase() {
  console.log('🌱 Iniciando seed do banco de dados...\n')

  try {
    // Verifica se o arquivo de dados existe
    const dataPath = resolve(process.cwd(), 'scripts/output/professionals.json')
    if (!existsSync(dataPath)) {
      console.log('⚠️  Arquivo de dados não encontrado:', dataPath)
      console.log('Pulando seed. Banco de dados vazio.')
      return
    }

    // Lê os dados
    const data = JSON.parse(readFileSync(dataPath, 'utf-8'))
    console.log(`📊 Total de profissionais no arquivo: ${data.length}`)

    // Verifica quantos já existem (idempotente)
    const { count: existingCount } = await supabase
      .from('professionals')
      .select('*', { count: 'exact', head: true })

    if (existingCount && existingCount > 0) {
      console.log(`✅ Banco de dados já contém ${existingCount} profissionais`)
      console.log('Pulando seed (já foi executado antes)')
      return
    }

    // Insere dados em lotes
    const BATCH_SIZE = 50
    let inserted = 0

    for (let i = 0; i < data.length; i += BATCH_SIZE) {
      const batch = data.slice(i, i + BATCH_SIZE)
      const { error, data: result } = await supabase
        .from('professionals')
        .insert(batch)
        .select()

      if (error) {
        console.error(`❌ Erro no lote ${Math.floor(i / BATCH_SIZE) + 1}:`, error.message)
        throw error
      }

      inserted += batch.length
      const percentage = Math.round((inserted / data.length) * 100)
      console.log(`✅ ${inserted}/${data.length} (${percentage}%) inseridos`)
    }

    console.log('\n✨ Seed concluído com sucesso!')
    console.log(`📝 Total inserido: ${inserted} profissionais\n`)
  } catch (error) {
    console.error('❌ Erro durante o seed:', error)
    process.exit(1)
  }
}

// Executa o seed
await seedDatabase()