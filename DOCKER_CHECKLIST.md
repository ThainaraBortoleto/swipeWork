# ✅ Docker Configuration Checklist

Valide se tudo foi configurado corretamente.

## Files Created / Updated

- [x] `scripts/seed.ts` — Seed idempotente (verifica antes de inserir)
- [x] `scripts/entrypoint.sh` — Script de inicialização para Docker
- [x] `Dockerfile` — Imagem com Node 18 Alpine, entrypoint e seed
- [x] `docker-compose.yml` — Orquestração com volumes e health check
- [x] `.dockerignore` — Ignora arquivos desnecessários no build
- [x] `.env.docker.example` — Template de variáveis de ambiente
- [x] `README.md` — Atualizado com instruções Docker
- [x] `README.DOCKER.md` — Guia aprofundado de Docker
- [x] `SETUP.md` — Guia passo-a-passo de configuração
- [x] `scripts/test-docker.sh` — Script para validar configuração

## Configuration Overview

### Seed Strategy (Idempotente)

```
┌─────────────────────────────────────┐
│ Container inicia (entrypoint.sh)    │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│ Verifica se dados já existem        │
│ SELECT COUNT(*) FROM professionals  │
└──────────────┬──────────────────────┘
               ├─ SIM: Pula seed ──→ Inicia dev server
               │
               └─ NÃO: Insere dados ──→ Inicia dev server
```

**Resultado:** Seed pode rodar múltiplas vezes com segurança.

### Environment Variables

| Variable | Source | Purpose |
|---|---|---|
| `NUXT_PUBLIC_SUPABASE_URL` | `.env.local` | Supabase API endpoint |
| `NUXT_PUBLIC_SUPABASE_KEY` | `.env.local` | Supabase anon key |
| `SUPABASE_SERVICE_KEY` | `.env.local` | Supabase service key (seed) |
| `NODE_ENV` | `docker-compose.yml` | Environment mode |
| `HOST` | `docker-compose.yml` | Server host (0.0.0.0 = accessible) |
| `PORT` | `docker-compose.yml` | Server port (3000) |

### Volumes

| Host Path | Container Path | Purpose |
|---|---|---|
| `.` (projeto) | `/app` | Código-fonte (live reload) |
| (anônimo) | `/app/node_modules` | Cache de dependências |
| (anônimo) | `/app/.nuxt` | Cache de build Nuxt |
| (anônimo) | `/app/.output` | Output de produção |

### Health Check

O container possui health check que:
- Testa `curl http://localhost:3000/` a cada 30 segundos
- Aguarda 40 segundos antes do primeiro teste (start_period)
- Marca como unhealthy após 3 falhas consecutivas

Use para monitoramento:
```bash
docker-compose ps  # Vê status HEALTHY/UNHEALTHY
```

## Testing Checklist

### Before Building

- [ ] `.env.local` existe e está preenchido
- [ ] `scripts/output/professionals.json` existe (509 profissionais)
- [ ] `scripts/seed.ts` é idempotente
- [ ] `scripts/entrypoint.sh` é executável

### Building

```bash
# Teste 1: Build básico
docker build -t swipework .

# Expected: Sem erros, imagem ~600MB
```

### Running with Compose

```bash
# Teste 2: Inicie com Docker Compose
docker-compose up

# Expected: 
# - Instala dependências (~2 min)
# - Executa seed (~30 seg)
# - Inicia dev server
# - Acessível em http://localhost:3000
```

### Data Validation

```bash
# Teste 3: Verifique se seed funcionou
docker-compose exec app npm run seed

# Expected: 
# ✅ Banco de dados já contém 509 profissionais
# Pulando seed (já foi executado antes)
```

### UI Verification

1. Abra `http://localhost:3000`
2. Deve exibir:
   - [ ] Página inicial com CatalogPicker
   - [ ] Contadores de categorias (ex: "desenvolvimento: 50")
   - [ ] Modo swipe com cards animados
   - [ ] Modo lista com grid de profissionais
   - [ ] Página de detalhes ao clicar em um card

### Cleanup

```bash
# Teste 4: Parar e remover
docker-compose down

# Teste 5: Re-iniciar (fresh start)
docker-compose up

# Expected: Funciona novamente sem erros
```

## Common Issues & Fixes

| Issue | Cause | Fix |
|---|---|---|
| "Cannot stringify arbitrary non-POJOs" | Supabase client sendo serializado | ✅ Já corrigido em `utils/supabase.ts` |
| Categorias não atualizam | Pinia store não sincronizado | ✅ Já usando `useFilterStore` |
| Contadores zerados após refresh | Estado não persistido | ✅ Já usando `localStorage` plugin |
| Docker não conecta BD | Credenciais inválidas | ✅ Verificar `.env.local` |
| Seed não executa | Service key ausente | ✅ Verificar `SUPABASE_SERVICE_KEY` |

## Performance Notes

- **Image size:** ~600MB (Node 18 Alpine + dependencies)
- **Startup time:** ~2-3 minutos (incluindo npm install + seed)
- **Dev reload:** <1 segundo (hot reload via volumes)
- **Seed duration:** ~30 segundos (509 profissionais em batches de 50)

## Security Notes

⚠️ **IMPORTANTE:**

- ❌ Nunca commit `.env.local` para git
- ❌ Nunca exponha `SUPABASE_SERVICE_KEY` publicamente
- ✅ Use `.gitignore` para proteger `.env*`
- ✅ Padrão já configurado em `.gitignore`

## What's Next?

Após validar tudo:

1. ✅ Commit das mudanças Docker
2. ✅ Deploy em staging (ex: Render, Railway, Fly.io)
3. ✅ Testes end-to-end
4. ✅ Deploy em produção

---

**Status:** ✅ Docker configuration complete!

Para iniciar desenvolvimento:
```bash
cp .env.docker.example .env.local
# Edite .env.local com credenciais
docker-compose up
```

Acesse `http://localhost:3000`
