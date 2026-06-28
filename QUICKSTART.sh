#!/bin/bash

# SwipeWork Quick Start Script
# Execute este script para configurar e rodar o projeto rapidamente

set -e

echo "🚀 SwipeWork — Quick Start"
echo "=========================="
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Step 1: Verificar se Docker está instalado
echo -e "${YELLOW}[1/4]${NC} Verificando Docker..."
if ! command -v docker &> /dev/null; then
  echo -e "${RED}✗ Docker não encontrado${NC}"
  echo "  Instale em https://docker.com"
  exit 1
fi
echo -e "${GREEN}✓ Docker encontrado${NC}"

# Step 2: Configurar .env.local
echo ""
echo -e "${YELLOW}[2/4]${NC} Configurando variáveis de ambiente..."
if [ ! -f .env.local ]; then
  cp .env.docker.example .env.local
  echo -e "${YELLOW}⚠️  .env.local criado${NC}"
  echo -e "${YELLOW}   Edite .env.local com suas credenciais Supabase:${NC}"
  echo ""
  echo "   NUXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co"
  echo "   NUXT_PUBLIC_SUPABASE_KEY=sua-anon-key"
  echo "   SUPABASE_SERVICE_KEY=sua-service-key"
  echo ""
  read -p "   Pressione ENTER após configurar .env.local..."
fi
echo -e "${GREEN}✓ Variáveis configuradas${NC}"

# Step 3: Build da imagem
echo ""
echo -e "${YELLOW}[3/4]${NC} Building imagem Docker..."
docker-compose build
echo -e "${GREEN}✓ Build concluído${NC}"

# Step 4: Subir containers
echo ""
echo -e "${YELLOW}[4/4]${NC} Iniciando containers..."
docker-compose up -d

echo ""
echo -e "${GREEN}✨ Sucesso!${NC}"
echo ""
echo "   Aplicativo iniciando em http://localhost:3000"
echo ""
echo "   Aguarde ~30 segundos para o seed completar..."
echo ""
echo "   Comandos úteis:"
echo "   - docker-compose logs -f app        # Ver logs em tempo real"
echo "   - docker-compose down               # Parar containers"
echo "   - docker-compose exec app npm run seed  # Re-rodar seed"
echo ""
