# SwipeWork

Catálogo interativo de profissionais freelancers com mecânica de swipe — estilo Tinder.

SwipeWork é um projeto frontend onde usuários podem navegar por profissionais disponíveis através de uma interface de cards deslizáveis, com suporte a modos swipe e lista.

## Funcionalidades

### Fase 1 — Completa
- Seleção de Categoria — picker com contadores por área
- Modo Swipe — drag com mouse, navegação por teclado, animações suaves
- Modo Lista — grid responsivo com busca debounced
- Detalhes do Profissional — página individual com todas as informações
- Filtros — por categoria, disponibilidade e outras características
- Integração com Supabase — dados persistidos e consumidos em tempo real
- Docker — containerização com seed idempotente

### Fase 2 — Em Andamento
- Matches — salvar profissionais favoritos
- Modal de Agendamento — formulário de contato após match
- Lista de Matches — visualizar e gerenciar salvos
- Loading state no SwipeDeck

### Fase 3 — Planejado
- Touch swipe para mobile (PWA)
- Filtros avançados (preço, rating)
- Infinite scroll
- Autenticação com Supabase Auth

---

## Stack

| Tecnologia | Versão | Uso |
|---|---|---|
| Nuxt | 4.4.8 | Framework principal (SSR/SPA) |
| Vue | 3.5.38 | Interface reativa com Composition API |
| TypeScript | strict | Tipagem estática |
| Tailwind CSS | 6.14.0 | Estilização utilitária |
| Supabase | 2.108.2 | Backend as a Service (banco + auth) |
| VueUse | 14.3.0 | Composables utilitários |
| Pinia | 3.0.4 | State management |
| Docker | 20-alpine | Containerização e ambiente padronizado |
| Node.js | 20+ | Runtime para dev server |

---

## Estrutura do Projeto

```
swipework/
├── app/
│   ├── components/      # Componentes Vue (prefixados por subpasta)
│   ├── composables/     # Lógica reutilizável por domínio
│   ├── pages/           # Páginas com rotas automáticas
│   ├── plugins/         # Plugins Nuxt (Pinia persist)
│   ├── stores/          # State management com Pinia
│   ├── types/           # Interfaces e tipos TypeScript
│   └── utils/           # Helpers (Supabase client, etc)
├── scripts/
│   ├── seed.ts          # Script de seed idempotente
│   ├── entrypoint.sh    # Entrypoint do Docker
│   └── output/
│       └── professionals.json  # 504 profissionais de exemplo
├── Dockerfile           # Imagem Docker (Node 20-alpine)
└── docker-compose.yml   # Orquestração Docker
```

---

## Como rodar localmente

### Pré-requisitos

- Node.js 20+ (Nuxt 4 requer Node 20 ou superior)
- npm 10+
- Conta no Supabase (gratuita) com API keys configuradas
- Docker e Docker Compose (opcional, recomendado)

### Instalação

```bash
git clone https://github.com/seu-user/swipework.git
cd swipework
npm install
```

### Configuração de Variáveis de Ambiente

1. Configure o arquivo `.env.local`:
```bash
cp .env.docker.example .env.local
```

2. Preencha com suas credenciais Supabase:
```env
NUXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NUXT_PUBLIC_SUPABASE_KEY=sua-anon-key
SUPABASE_SERVICE_KEY=sua-service-key
```

Para obter essas credenciais, veja [GET_CREDENTIALS.md](./GET_CREDENTIALS.md)

### Rode localmente (sem Docker)

```bash
npm run dev
```

Acesse em http://localhost:3000

### Rode com Docker Compose (recomendado)

```bash
docker-compose up
```

O servidor será executado em http://localhost:3000

O seed (população de dados) é executado automaticamente na primeira inicialização.

### Seed de Dados

O seed popula o banco com 504 profissionais de exemplo.

Para rodar manualmente:
```bash
npm run seed
```

O seed é **idempotente** — pode ser executado múltiplas vezes sem duplicar dados.

---

## Banco de Dados (Supabase)

O projeto utiliza uma tabela `professionals` no Supabase com os seguintes campos:

| Campo | Tipo | Descrição |
|---|---|---|
| id | uuid | Identificador único |
| name | text | Nome do profissional |
| profession | text | Profissão/especialidade |
| category | text | Área de atuação |
| description | text | Descrição do profissional |
| avatar | text | URL da foto de perfil |
| hourly_rate | numeric | Taxa horária |
| rating | numeric | Avaliação (0-5) |
| review_count | integer | Quantidade de avaliações |
| available | boolean | Disponibilidade atual |
| city | text | Cidade |
| state | text | Estado/UF |
| distance_km | numeric | Distância do usuário |
| tags | text[] | Tags/palavras-chave |
| services | text[] | Serviços oferecidos |
| response_time_hours | integer | Tempo de resposta em horas |

Veja [SETUP.md](./SETUP.md) para instruções de criação da tabela.

---

## Decisões Técnicas

- Composition API + Composables — lógica de negócio isolada e reutilizável
- TypeScript strict — tipagem estática sem `any`
- Supabase como BaaS — backend serverless com dados em tempo real
- Pinia para state management — stores centralizadas com plugins de persistência
- Tailwind CSS — utilidades para UI consistente
- Docker com Node 20 Alpine — imagem otimizada e reproduzível
- Seed idempotente — pode rodar múltiplas vezes com segurança

---

## Scripts Disponíveis

```bash
npm run dev            # Dev server com hot reload
npm run build          # Build de produção
npm run preview        # Preview da build
npm run seed           # Popular Supabase com dados (idempotente)
npm run generate:data  # Gerar dados fixtures
```

### Docker

```bash
docker-compose up              # Subir containers
docker-compose down            # Parar containers
docker-compose logs -f app     # Ver logs em tempo real
docker-compose restart app     # Reiniciar aplicação
docker-compose exec app bash   # Acessar container
```

---

## Roadmap

| Fase | Funcionalidades | Status |
|---|---|---|
| 1 | Catálogo + Swipe + Filtros + Docker | Pronto |
| 2 | Matches + Agendamento | Em andamento |
| 3 | Mobile + Filtros avançados | Próximo |

## Documentação

- [SETUP.md](./SETUP.md) — Guia passo-a-passo de configuração
- [README.DOCKER.md](./README.DOCKER.md) — Guia Docker aprofundado
- [GET_CREDENTIALS.md](./GET_CREDENTIALS.md) — Como obter credenciais Supabase
- [DOCKER_CHECKLIST.md](./DOCKER_CHECKLIST.md) — Checklist de validação

## Desenvolvimento

Desenvolvido por Thainara Bortoleto com auxílio de IA (Claude 3.5 Sonnet) documentação e melhorias tecnicas

## Autor

Thainara Bortoleto
