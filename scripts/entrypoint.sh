#!/bin/bash
set -e

echo "🚀 SwipeWork - Docker Entrypoint"
echo "================================="

# Valida se credenciais do Supabase estão configuradas
if [ -z "$NUXT_PUBLIC_SUPABASE_URL" ] || [ -z "$NUXT_PUBLIC_SUPABASE_KEY" ]; then
  echo ""
  echo "❌ ERRO: Credenciais Supabase não configuradas!"
  echo ""
  echo "Edite .env.local com suas credenciais:"
  echo "  NUXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co"
  echo "  NUXT_PUBLIC_SUPABASE_KEY=sua-anon-key"
  echo "  SUPABASE_SERVICE_KEY=sua-service-role-key"
  echo ""
  echo "Obtenha em: https://app.supabase.com → Settings → API"
  echo ""
  exit 1
fi

echo "✅ Credenciais Supabase configuradas"

# Aguarda o Supabase estar pronto (opcional)
if [ -n "$SUPABASE_URL" ]; then
  echo "⏳ Aguardando Supabase estar disponível..."
  RETRIES=0
  MAX_RETRIES=10
  until curl -s "$SUPABASE_URL/health" > /dev/null 2>&1 || [ $RETRIES -eq $MAX_RETRIES ]; do
    echo "⏳ Tentativa $((RETRIES+1))/$MAX_RETRIES..."
    RETRIES=$((RETRIES+1))
    sleep 2
  done
  if [ $RETRIES -eq $MAX_RETRIES ]; then
    echo "⚠️  Supabase não respondeu em tempo, continuando mesmo assim..."
  else
    echo "✅ Supabase disponível"
  fi
fi

# Verifica se npm_config_update_notifier está definido
export npm_config_update_notifier=false

# Instala/atualiza dependências
if [ ! -d "node_modules" ] || [ ! -f "node_modules/.package-lock.json" ]; then
  echo "📦 Instalando dependências..."
  if [ -f "package-lock.json" ]; then
    npm ci --legacy-peer-deps || npm install --legacy-peer-deps
  else
    npm install --legacy-peer-deps
  fi

  if [ ! -d "node_modules" ]; then
    echo "❌ Erro ao instalar dependências"
    exit 1
  fi

  echo "✅ Dependências instaladas"
fi

# Executa seed se NUXT_PUBLIC_SUPABASE_URL está definido
if [ -n "$NUXT_PUBLIC_SUPABASE_URL" ] && [ -n "$SUPABASE_SERVICE_KEY" ]; then
  echo "🌱 Executando seed do banco de dados..."
  npx tsx scripts/seed.ts || echo "⚠️  Seed falhou ou já foi executado"
  echo "✅ Seed completo"
fi

# Inicia o servidor dev
echo "🎬 Iniciando servidor Nuxt..."
npm run dev -- --host
