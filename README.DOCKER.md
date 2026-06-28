# 🐳 SwipeWork — Guia Docker

Este guia detalha como rodar o SwipeWork usando Docker e Docker Compose.

## Pré-requisitos

- Docker (versão 20.10+)
- Docker Compose (versão 1.29+ ou 2.0+)
- Conta no [Supabase](https://supabase.com) com uma API key e service key

## 🚀 Quick Start (Docker Compose)

### 1. Configure as variáveis de ambiente

```bash
# Crie o arquivo .env.local baseado no exemplo
cp .env.docker.example .env.local
```

### 2. Edite o .env.local com suas credenciais Supabase

```env
NUXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NUXT_PUBLIC_SUPABASE_KEY=sua-anon-key
SUPABASE_SERVICE_KEY=sua-service-key
SUPABASE_URL=https://seu-projeto.supabase.co
```

### 3. Suba o container

```bash
docker-compose up
```

Pronto! O aplicativo vai:
1. Instalar as dependências
2. Executar o seed automático (popular banco com profissionais)
3. Iniciar o servidor em `http://localhost:3000`

## 🔧 Configuração Avançada

### Variáveis de Ambiente

| Variável | Necessária? | Descrição |
|---|---|---|
| `NUXT_PUBLIC_SUPABASE_URL` | ✅ | URL do seu projeto Supabase |
| `NUXT_PUBLIC_SUPABASE_KEY` | ✅ | Chave anônima do Supabase |
| `SUPABASE_SERVICE_KEY` | ✅ | Service role key (para seed) |
| `SUPABASE_URL` | ⚠️ | Health check opcional do Supabase |
| `NODE_ENV` | ❌ | Padrão: `development` |
| `HOST` | ❌ | Padrão: `0.0.0.0` |
| `PORT` | ❌ | Padrão: `3000` |

### Modo Desenvolvimento com Hot Reload

```bash
# Docker Compose com volumes para live-reload
docker-compose up --build

# Edite os arquivos localmente e eles recarregarão automaticamente
```

### Modo Produção

Para usar em produção, crie um `docker-compose.prod.yml`:

```yaml
version: '3.8'
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile.prod
    environment:
      - NODE_ENV=production
    ports:
      - "80:3000"
```

## 🐛 Troubleshooting

### O seed não foi executado

**Solução:** Verifique se `SUPABASE_SERVICE_KEY` está configurada:

```bash
# Veja os logs do container
docker-compose logs app
```

### "Cannot read properties of undefined" ao acessar localhost:3000

**Solução:** Aguarde o seed completar (~30 segundos) e recarregue a página.

### Porta 3000 já está em uso

**Solução:** Mude a porta no `docker-compose.yml`:

```yaml
ports:
  - "3001:3000"  # Acesse em localhost:3001
```

### Banco de dados vazio após rodar seed

**Solução:** Verifique se as credenciais do Supabase estão corretas e se a tabela `professionals` existe.

## 📊 Seed Idempotente

O script de seed é **idempotente**:

- ✅ Se o banco está vazio: insere todos os 509 profissionais
- ✅ Se o banco já tem dados: pula o seed
- ✅ Pode rodar múltiplas vezes com segurança

Para forçar um re-seed, delete a tabela no Supabase e reinicie o container:

```bash
docker-compose restart app
```

## 🔨 Comandos Úteis

```bash
# Ver logs em tempo real
docker-compose logs -f app

# Acessar o container
docker-compose exec app sh

# Parar os containers
docker-compose down

# Remover volumes (e banco de dados)
docker-compose down -v

# Rebuild da imagem
docker-compose up --build

# Executar seed manualmente dentro do container
docker-compose exec app npm run seed
```

## 📝 Estrutura do Dockerfile

```dockerfile
FROM node:18-alpine
  ↓
  Instala bash e curl
  ↓
COPY package*.json ./
  ↓
  npm install --legacy-peer-deps
  ↓
COPY . .
  ↓
  COPY entrypoint.sh && chmod +x
  ↓
ENTRYPOINT ["./entrypoint.sh"]
  ↓
  Executa seed (se SUPABASE_SERVICE_KEY existe)
  ↓
  npm run dev --host
```

## 🎯 O que o entrypoint.sh faz?

1. **Aguarda Supabase** (opcional) — testa connectivity
2. **Instala dependências** — se `node_modules/` não existe
3. **Executa seed** — popula banco (idempotente)
4. **Inicia servidor** — Nuxt dev server

## 📌 Notas Importantes

- **Service Key não deve ser exposta publicamente** — use `.env` local ou secrets no seu orquestrador (Kubernetes, Docker Swarm, etc)
- **Live reload funciona** porque o volume monta o código-fonte
- **O build é leve** (~400MB com node_modules) — considere usar `.dockerignore`

---

Para mais info, veja [README.md](./README.md) ou [CLAUDE.md](./CLAUDE.md)
