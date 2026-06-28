# 🔑 Como Obter Credenciais Supabase

## Passo 1: Abra o Supabase Dashboard

1. Acesse [https://app.supabase.com](https://app.supabase.com)
2. Faça login com sua conta
3. Se não tem conta, crie uma (gratuita)

## Passo 2: Crie um novo projeto (se ainda não tem)

1. Clique em **New project**
2. Digite um nome para seu projeto
3. Defina uma password segura (você vai precisar depois)
4. Selecione a região mais próxima
5. Clique **Create new project**

⏳ Aguarde ~2 minutos pelo setup do projeto.

## Passo 3: Obtenha as credenciais

1. No menu lateral esquerdo, vá para **Settings** → **API**
2. Você verá uma página com várias chaves

### Copie estes valores:

| Campo | Variável | Onde Usar |
|-------|----------|-----------|
| **Project URL** | `NUXT_PUBLIC_SUPABASE_URL` | URL do projeto |
| **Anon Key** | `NUXT_PUBLIC_SUPABASE_KEY` | Chave pública |
| **Service Role Secret** | `SUPABASE_SERVICE_KEY` | Seed (PRIVADO!) |

### Exemplo de valores:
```
NUXT_PUBLIC_SUPABASE_URL=https://xyzabc123def456.supabase.co
NUXT_PUBLIC_SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Passo 4: Preencha o `.env.local`

1. Abra `C:\Users\thain\Documents\projetos\swipework\.env.local`
2. Substitua os valores:
   - `YOUR_PROJECT_URL` → Cole o Project URL
   - `YOUR_ANON_KEY` → Cole o Anon Key
   - `YOUR_SERVICE_KEY` → Cole o Service Role Secret

### Arquivo preenchido corretamente:
```env
NUXT_PUBLIC_SUPABASE_URL=https://xyzabc123def456.supabase.co
NUXT_PUBLIC_SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwic3ViIjoiYWY2YmQ1NjctNzU3My00NmNkLTg5YTktZDI1MGVhNTQ1MDlhIiwiaWF0IjoxNzE4MzI4MDAwLCJleHAiOjE3MzAwMzIwMDB9uDQrx_9KxW5p2LQ2...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwic3ViIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNzE4MzI4MDAwLCJleHAiOjk5OTk5OTk5OTl9BxcEkjNr...
```

## Passo 5: Crie a tabela `professionals`

Ainda no Supabase Dashboard:

1. Vá para **SQL Editor** (menu esquerdo)
2. Clique em **New Query**
3. Cole o SQL abaixo:

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

4. Clique **Run** (ou Ctrl+Enter)
5. Aguarde a execução (~10 segundos)

✅ Tabela criada!

## Passo 6: Suba o Docker

```bash
docker-compose up
```

Pronto! O Docker vai:
1. ✅ Verificar credenciais
2. ✅ Instalar dependências
3. ✅ Rodar o seed (popular 504 profissionais)
4. ✅ Iniciar o dev server

Acesse: **http://localhost:3000**

---

## ⚠️ Segurança

- ❌ **Nunca** commit do `.env.local` (já está no `.gitignore`)
- ❌ **Nunca** compartilhe `SUPABASE_SERVICE_KEY` publicamente
- ✅ A chave fica apenas no seu `.env.local` (local)

---

## Troubleshooting

### "Cannot read properties of undefined"
→ Credenciais inválidas. Verifique e copie novamente.

### "Failed to connect to Supabase"
→ URL ou chaves erradas. Confira em app.supabase.com

### "Table does not exist"
→ Execute o SQL do Passo 5 acima.

---

**Pronto?** Volte para a terminal e execute:
```bash
docker-compose up
```
