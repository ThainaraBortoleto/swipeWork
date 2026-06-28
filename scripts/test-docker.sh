#!/bin/bash

# Script para testar a configuração do Docker

echo "🐳 SwipeWork — Docker Configuration Tester"
echo "==========================================="
echo ""

# Verificações
ERRORS=0

# 1. Verifica se Docker está instalado
echo "✓ Verificando Docker..."
if ! command -v docker &> /dev/null; then
  echo "  ❌ Docker não encontrado. Instale em https://docker.com"
  ERRORS=$((ERRORS + 1))
else
  echo "  ✅ Docker $(docker --version | cut -d' ' -f3)"
fi

# 2. Verifica se Docker Compose está instalado
echo ""
echo "✓ Verificando Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
  echo "  ❌ Docker Compose não encontrado"
  ERRORS=$((ERRORS + 1))
else
  echo "  ✅ Docker Compose $(docker-compose --version | cut -d' ' -f3)"
fi

# 3. Verifica se .env.local existe
echo ""
echo "✓ Verificando arquivo .env.local..."
if [ ! -f .env.local ]; then
  echo "  ⚠️  .env.local não encontrado"
  echo "  Executando: cp .env.docker.example .env.local"
  cp .env.docker.example .env.local
  echo "  ⚠️  Edite .env.local com suas credenciais Supabase"
else
  echo "  ✅ .env.local encontrado"
fi

# 4. Verifica se dockerfile existe
echo ""
echo "✓ Verificando Dockerfile..."
if [ ! -f Dockerfile ]; then
  echo "  ❌ Dockerfile não encontrado"
  ERRORS=$((ERRORS + 1))
else
  echo "  ✅ Dockerfile encontrado"
fi

# 5. Verifica se docker-compose.yml existe
echo ""
echo "✓ Verificando docker-compose.yml..."
if [ ! -f docker-compose.yml ]; then
  echo "  ❌ docker-compose.yml não encontrado"
  ERRORS=$((ERRORS + 1))
else
  echo "  ✅ docker-compose.yml encontrado"
fi

# 6. Verifica se entrypoint.sh existe
echo ""
echo "✓ Verificando scripts/entrypoint.sh..."
if [ ! -f scripts/entrypoint.sh ]; then
  echo "  ❌ scripts/entrypoint.sh não encontrado"
  ERRORS=$((ERRORS + 1))
else
  echo "  ✅ scripts/entrypoint.sh encontrado"
fi

# 7. Verifica se dados de seed existem
echo ""
echo "✓ Verificando dados de seed..."
if [ ! -f scripts/output/professionals.json ]; then
  echo "  ❌ scripts/output/professionals.json não encontrado"
  ERRORS=$((ERRORS + 1))
else
  COUNT=$(grep -o '"id"' scripts/output/professionals.json | wc -l)
  echo "  ✅ $((COUNT)) profissionais encontrados"
fi

# 8. Verifica package.json
echo ""
echo "✓ Verificando scripts em package.json..."
if grep -q '"seed":' package.json; then
  echo "  ✅ Script 'seed' encontrado"
else
  echo "  ❌ Script 'seed' não encontrado em package.json"
  ERRORS=$((ERRORS + 1))
fi

# Resultado final
echo ""
echo "==========================================="
if [ $ERRORS -eq 0 ]; then
  echo "✅ Tudo pronto! Execute: docker-compose up"
else
  echo "❌ $ERRORS erro(s) encontrado(s)"
  exit 1
fi
