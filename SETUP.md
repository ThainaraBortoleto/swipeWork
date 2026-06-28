# 🚀 SwipeWork — Guia de Configuração

Este arquivo guia você através da configuração inicial do SwipeWork.

## Passo 1: Clonar o repositório

```bash
git clone <seu-repo>
cd swipework
```

## Passo 2: Configurar Supabase

### 2.1 Criar conta em Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Crie uma nova conta ou faça login
3. Crie um novo projeto

### 2.2 Obter credenciais

Na dashboard do Supabase:

1. Vá para **Settings → API**
2. Copie:
   - **Project URL** → `NUXT_PUBLIC_SUPABASE_URL`
   - **Anon Key** → `NUXT_PUBLIC_SUPABASE_KEY`
   - **Service Role Key** → `SUPABASE_SERVICE_KEY` (guarde em segurança!)

### 2.3 Criar tabela `professionals`

Na dashboard, abra o **SQL Editor** e execute:

```sql
CREATE TABLE professionals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  avatar TEXT,
  profession TEXT,
  category TEXT,
  description TEXT,
  hourly_rate NUMERIC,
  rating NUMERIC,
  review_count INTEGER DEFAULT 0,
  city TEXT,
  state TEXT,
  distance_km NUMERIC,
  tags TEXT[],
  services TEXT[],
  available BOOLEAN DEFAULT true,
  response_time_hours INTEGER,
  joined_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_professionals_category ON professionals(category);
CREATE INDEX idx_professionals_state ON professionals(state);
CREATE INDEX idx_professionals_available ON professionals(available);
```

Ou use o painel **SQL** do Supabase para copiar e colar (mais fácil).

## Passo 3: Configurar ambiente local

### 3.1 Sem Docker (Node.js local)

```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite .env com suas credenciais
nano .env
# ou
vim .env
```

Adicione:
```env
NUXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NUXT_PUBLIC_SUPABASE_KEY=sua-anon-key
SUPABASE_SERVICE_KEY=sua-service-key
```

### 3.2 Com Docker

```bash
# Copie o arquivo de exemplo do Docker
cp .env.docker.example .env.local

# Edite .env.local com suas credenciais
nano .env.local
# ou
vim .env.local
```

Adicione as mesmas credenciais acima.

## Passo 4: Executar o projeto

### Opção A: Node.js local

```bash
# Instale dependências
npm install

# Execute o seed (populate banco)
npm run seed

# Inicie o dev server
npm run dev
```

Acesse `http://localhost:3000`

### Opção B: Docker Compose

```bash
# Suba o container (seed executará automaticamente)
docker-compose up
```

Acesse `http://localhost:3000`

**Nota:** Aguarde ~30 segundos para o seed completar.

## Passo 5: Verificar setup

No navegador, você deve ver:

1. **Página inicial** — picker de categorias com contadores
2. **Modo swipe** — cards deslizáveis
3. **Modo lista** — grid de cards
4. **Detalhes** — ao clicar em um card

Se alguma coisa não aparecer:

```bash
# Verifique os logs
docker-compose logs app

# Ou execute o teste
bash scripts/test-docker.sh
```

## Scripts Úteis

```bash
# Desenvolvimento
npm run dev              # Dev server com hot reload
npm run build            # Build de produção
npm run preview          # Preview da build

# Dados
npm run seed             # Popular Supabase
npm run generate:data    # Gerar dados fixtures

# Docker
docker-compose up        # Suba os containers
docker-compose down      # Pare os containers
docker-compose logs -f   # Veja os logs em tempo real
docker-compose exec app npm run seed  # Rode seed dentro do container
```

## Troubleshooting

### "Cannot read properties of undefined"

**Causa:** Banco de dados vazio
**Solução:** Execute o seed:
```bash
npm run seed
# ou
docker-compose exec app npm run seed
```

### Porta 3000 já está em uso

**Solução:** Mude em `docker-compose.yml`:
```yaml
ports:
  - "3001:3000"
```

Acesse `http://localhost:3001`

### Docker não conecta ao Supabase

**Solução:** Verifique `.env.local`:
- `NUXT_PUBLIC_SUPABASE_URL` está correto?
- `NUXT_PUBLIC_SUPABASE_KEY` está correto?

### Seed executou mas banco está vazio

**Causa:** Credenciais inválidas ou tabela não existe
**Solução:**
1. Verifique `SUPABASE_SERVICE_KEY` em `.env.local`
2. Crie a tabela SQL acima
3. Re-execute o seed:
```bash
docker-compose down
docker-compose up --build
```

## Próximos Passos

Depois de configurado:

1. **Explore** — Use a interface de swipe e lista
2. **Customize** — Edite cores, textos, layout em `app/components/`
3. **Estenda** — Adicione funcionalidades (matches, agendamento, etc)

Para mais detalhes técnicos, veja:
- [README.md](./README.md) — Visão geral e stack
- [README.DOCKER.md](./README.DOCKER.md) — Guia Docker aprofundado

---
