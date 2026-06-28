# Filtro de Localidade - Melhorias

## 📍 O que foi Implementado

### 1. **Extensão do Sistema de Filtros**
Adicionado filtros de `state` (estado) e `city` (cidade) ao composable `useFilters`.

```typescript
interface Filters {
  search: string
  category: Category | ''
  minRate: number
  maxRate: number
  availableOnly: boolean
  sortBy: SortOption
  state: string    // ✨ NOVO
  city: string     // ✨ NOVO
}
```

**Métodos adicionados:**
- `resetLocation()` — limpa ambos os filtros de localidade

---

### 2. **Atualização do `useProfessionals`**
Adicionada filtragem por estado e cidade no Supabase.

**Novos métodos:**
```typescript
fetchStates()           // Carrega lista de estados únicos
fetchCities(state?)     // Carrega cidades (opcionalmente filtradas por estado)
```

**Novos estados:**
```typescript
states: Ref<string[]>   // Lista de estados disponíveis
cities: Ref<string[]>   // Lista de cidades disponíveis
```

**Filtragem no Supabase:**
```typescript
if (filters?.state) query = query.eq('state', filters.state)
if (filters?.city) query = query.eq('city', filters.city)
```

---

### 3. **Novo Componente: `ProfessionalLocationFilter`**
UI para seleção de estado e cidade com dependência (estado → cidades).

**Funcionalidades:**
- Dropdown de estados carregados dinamicamente
- Dropdown de cidades (desabilitado até selecionar estado)
- Carregamento de cidades ao selecionar estado
- Botão "Limpar" quando houver filtro ativo
- Info visual mostrando filtro ativo
- Mensagem de ajuda "(selecione estado)"

**Layout:**
```
┌─────────────────────────┐
│ Localização      Limpar │
├─────────────────────────┤
│ Estado                  │
│ [Todos os estados ▼]   │
│                         │
│ Cidade                  │
│ [Todas as cidades ▼]   │
│                         │
│ 📍 Mostrando profissionais
│    em São Paulo         │
└─────────────────────────┘
```

---

### 4. **Integração na Página Home**
Layout aprimorado do modo "lista" com sidebar de filtros.

**Novo layout:**
```
┌─────────────────────────────────────────┐
│ [Buscar...]                             │
├────────────────┬────────────────────────┤
│  SIDEBAR       │  GRID DE CARDS         │
│ ┌────────────┐ │ ┌──────┐ ┌──────┐    │
│ │ Location   │ │ │Card1 │ │Card2 │    │
│ │ Filter     │ │ └──────┘ └──────┘    │
│ │            │ │ ┌──────┐ ┌──────┐    │
│ │ Status     │ │ │Card3 │ │Card4 │    │
│ │ (Info)     │ │ └──────┘ └──────┘    │
│ └────────────┘ │                       │
│                │ Scroll para mais...    │
└────────────────┴────────────────────────┘
```

**Breakpoints:**
- Mobile (< lg): Stack vertical (filtro embaixo)
- Desktop (lg+): Sidebar à esquerda (sticky)

---

## 🎯 Fluxo de Uso

### Passo 1: Selecionar Categoria
```
Home → Clique em categoria
```

### Passo 2: Escolher Visualização
```
Por padrão: Modo Swipe
Botão toggle: "Ver em lista"
```

### Passo 3: Usar Filtro de Localidade
```
Sidebar → Estado: São Paulo
       → Cidade: São Paulo
       → Clica em Limpar para resetar
```

### Passo 4: Resultados
```
Grid mostra apenas profissionais
de São Paulo, São Paulo
```

---

## 🔍 Exemplo Prático

**Cenário:** Procurar desenvolvedores em Minas Gerais, Belo Horizonte

1. Clique em "Desenvolvimento" (CatalogPicker)
2. Clique "Ver em lista"
3. Sidebar → Estado: "Minas Gerais"
4. Sidebar → Cidade: "Belo Horizonte"
5. Grid mostra apenas devs de BH

**Se mudar de ideia:**
- Clique "Limpar" na sidebar
- Filtro reseta, volta a mostrar todos de "Desenvolvimento"

---

## 📊 Dados do Banco

O componente carrega dinamicamente os estados e cidades que existem nos dados:

```sql
SELECT DISTINCT state FROM professionals ORDER BY state
SELECT DISTINCT city FROM professionals WHERE state = ? ORDER BY city
```

Isso significa:
- ✅ Sempre mostra apenas estados que têm profissionais
- ✅ Cidades mudam conforme o estado selecionado
- ✅ Sem opções vazias

---

## 🔄 Reatividade

**Watcher adicionado:**
```typescript
watch(() => [filters.value.state, filters.value.city], () => {
  if (viewMode.value === 'list') {
    debouncedFetch()  // Recarrega ao mudar filtro
  }
})
```

Isso garante que:
- Quando você seleciona um estado, cidades recarregam automaticamente
- Quando você seleciona uma cidade, profissionais recarregam automaticamente
- Tudo é debounced (300ms) para não sobrecarregar o Supabase

---

## 🎨 Visual

### Sidebar (Desktop)
```
┌─ Localização ──────────────────┐
│                                 │
│ Estado                          │
│ ┌─────────────────────────────┐ │
│ │ São Paulo         [▼]       │ │
│ └─────────────────────────────┘ │
│                                 │
│ Cidade                          │
│ ┌─────────────────────────────┐ │
│ │ São Paulo         [▼]       │ │
│ └─────────────────────────────┘ │
│                                 │
│ 📍 Mostrando em São Paulo      │
│                                 │
└─ Info ─────────────────────────┘
  509 profissionais encontrados
  Categoria: Desenvolvimento
```

### Mobile
```
[Buscar...]

[Localização Filter]

[Info Card]

[Card 1]
[Card 2]
[Card 3]
...
```

---

## 🚀 Próximas Ideias

1. **Distância** — Filtrar por km (se houver coordenadas)
2. **Múltiplas seleções** — Selecionar vários estados/cidades
3. **Busca rápida** — Tipo ahead de cidades
4. **Favoritos** — Salvar filtros preferidos
5. **Mapa** — Visualizar profissionais em mapa

---

## ✅ Checklist de Teste

- [ ] Sidebar de filtro aparece no modo lista
- [ ] Dropdown de estado funciona
- [ ] Ao selecionar estado, cidades carregam
- [ ] Dropdown de cidade só funciona após selecionar estado
- [ ] Profissionais filtram ao selecionar cidade
- [ ] Botão "Limpar" reseta os filtros
- [ ] Info card mostra filtro ativo
- [ ] Sticky funciona ao fazer scroll
- [ ] No mobile, filtro é responsivo
- [ ] Modo swipe não mostra filtro (apenas lista)
- [ ] Voltar para categoria picker reseta filtros
- [ ] Badge de total atualiza conforme filtros

---

## 🔗 Arquivos Modificados

| Arquivo | Mudança |
|---------|---------|
| `composables/professionals/useFilters.ts` | Adicionado state, city e resetLocation() |
| `composables/professionals/useProfessionals.ts` | Adicionado filtros de localidade e métodos fetchStates/fetchCities |
| `components/professional/LocationFilter.vue` | ✨ Novo componente |
| `pages/index.vue` | Integrado LocationFilter no layout da lista |

---

**Pronto para testar!** 🎯
