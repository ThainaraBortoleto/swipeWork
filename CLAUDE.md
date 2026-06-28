# SwipeWork — Catálogo de Profissionais Freelancers

Um catálogo interativo de profissionais com mecânica de swipe estilo Tinder. Desafio técnico frontend para Atlas Technol.

## Stack

- **Framework**: Nuxt 3 (compatibilityVersion: 4)
- **Linguagem**: TypeScript (strict mode)
- **UI**: Tailwind CSS (paleta dark: slate-900, slate-800, indigo-500)
- **Banco de dados**: Supabase
- **Utils**: VueUse

## Estrutura de Pastas

```
app/
├── components/
│   ├── catalog/
│   │   └── picker.vue              (CatalogPicker)
│   ├── professional/
│   │   ├── card.vue                (ProfessionalCard)
│   │   └── SwipeDeck.vue           (ProfessionalSwipeDeck)
│   └── ui/                          (genéricos, reutilizáveis)
├── composables/
│   ├── deck/
│   │   └── useSwipeDeck.ts         (stack, animações, eventos)
│   ├── matches/
│   │   └── useMatches.ts           (gerenciar matches do usuário)
│   ├── professionals/
│   │   ├── useProfessionals.ts     (busca, filtros, ordenação)
│   │   └── useFilters.ts           (estado dos filtros)
│   └── ui/
│       ├── useToast.ts            (notificações)
│       └── useDebounce.ts         (delay de busca)
├── pages/
│   ├── index.vue                   (home: CategoryPicker + SwipeDeck + ListaView)
│   └── professionals/
│       └── [id].vue                (detalhe do profissional)
├── types/
│   └── index.ts                    (Category, Professional, etc)
├── utils/
│   └── supabase.ts                 (useSupabase composable)
└── app.vue                         (root layout)
```

## Regras de Desenvolvimento

### Nomenclatura
- Rotas, arquivos, variáveis em **inglês**
- Sem emojis no código ou comentários
- Componentes em subpastas usam prefixo da pasta no template:
  - `catalog/picker.vue` → `<CatalogPicker />`
  - `professional/card.vue` → `<ProfessionalCard />`
  - `professional/SwipeDeck.vue` → `<ProfessionalSwipeDeck />`

### Estado
- **Global**: `useState` do Nuxt (não usar Pinia para estados simples)
- **Stores**: Pinia para estado complexo e filtros (stores/filter.ts)
- **Composables**: modulares por domínio, em subpastas
- **Props/Events**: componentes recebem dados via props, emitem via `defineEmits`
- **Data fetching**: `useAsyncData` nas páginas
- **Persistência**: Apenas skips e history persistem. Matches são resetados ao refresh.

### Código
- TypeScript strict em tudo, sem `any`
- Sem lógica de negócio em componentes → usar composables
- Sem hardcode de credenciais → usar `.env`
- Supabase client via `useSupabase()` (composable)
- Tailwind para estilo

### Comentários
- Apenas quando o WHY é não-óbvio (constraints, workarounds)
- Nunca explicar WHAT (nomes já fazem isso)
- Máximo 1 linha

## O Que Já Está Pronto ✅

- [x] **CatalogPicker** — seleção de categorias com contadores
- [x] **ProfessionalCard** — card individual com link para detalhe
- [x] **ProfessionalSwipeDeck** — stack de cards com drag mouse + teclado
- [x] **Página `/`** — home com CategoryPicker, SwipeDeck, ListView
- [x] **Página `/professionals/[id]`** — detalhe completo do profissional
- [x] **useProfessionals** — busca, filtros, ordenação via Supabase
- [x] **useFilters** — estado centralizado dos filtros
- [x] **useSwipeDeck** — stack de cards, animações, eventos
- [x] **useDebounce** — debounce para busca com delay
- [x] **useToast** — sistema de notificações
- [x] **Data** — 509 profissionais + 12 categorias no Supabase

## Próximos Passos 🔄

### Phase 1: Matches (Crítico)
1. **useMatches** — gerenciar lista de matches do usuário
   - `addMatch(professional)` → salvar no Supabase
   - `removeMatch(id)` → remover
   - `getMatches()` → listar salvos
   - Persistir em `user_matches` table
   - State: `matches: Ref<Professional[]>`

2. **ScheduleModal** — modal após dar match
   - Formulário de contato com campos: nome, email, mensagem, data/hora
   - Integração com useMatches
   - Fechar ao submeter ou cancel
   - Validação básica

3. **MatchList** — sidebar/página de matches salvos
   - Listar matches com opção de remover
   - Link para detalhe do profissional
   - Integração com ScheduleModal

### Phase 2: Mobile & UX (Importante)
- Touch swipe para mobile (VueUse `useSwipe`)
- Loading state no SwipeDeck
- Empty state quando acabar os cards
- Animação suave entre cards

### Phase 3: Polish (Nice-to-have)
- Infinite scroll na ListView
- Filtros avançados (preço, rating, etc)
- Histórico de skips
- Share profissional

## Dados & Tipos

### Professional (tipos/index.ts)
```ts
interface Professional {
  id: string
  name: string
  avatar: string
  profession: string
  category: Category
  description: string
  hourlyRate: number
  rating: number
  reviewCount: number
  location: { city: string; state: string; distanceKm: number }
  tags: string[]
  services: string[]
  available: boolean
  responseTimeHours: number
  joinedAt: string
}

type Category = 'desenvolvimento' | 'design' | 'marketing' | 'fotografia' 
  | 'video' | 'redacao' | 'saude' | 'educacao' | 'reforma' 
  | 'domestico' | 'consultoria' | 'traducao'
```

## Supabase

### Tables
- `professionals` — dados dos profissionais (509 registros, 12 categorias)
- `user_matches` — matches salvos pelo usuário (a implementar)
- `schedules` — agendamentos (a implementar)

### Client
Usar sempre via composable `useSupabase()` em `utils/supabase.ts`:
```ts
const supabase = useSupabase()
const { data, error } = await supabase.from('professionals').select('*')
```

## Env Variables

Adicionar ao `.env.local`:
```
NUXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NUXT_PUBLIC_SUPABASE_KEY=xxxxx
```

## Scripts

- `npm run dev` — dev server com hot reload
- `npm run build` — build para produção
- `npm run generate` — static generation
- `npm run preview` — preview da build
- `npm run seed` — popular dados no Supabase
- `npm run generate:data` — gerar dados fixtures

## Performance & Observações

- Composables auto-importados (ver `nuxt.config.ts` imports.dirs)
- VueUse é auto-importado também (`@vueuse/nuxt` module)
- Tailwind dark mode integrado
- TypeScript paths em `~` para `app/`

## Links

- [Projeto no Linear](link-para-linear) (se houver)
- [Supabase Console](https://app.supabase.com)
- [Figma/Design](link-para-design) (se houver)
