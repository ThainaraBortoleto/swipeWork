# ⚡ Quick Start - SwipeWork

## 🚀 Acesse Agora
```
http://localhost:3000
```

---

## 📋 O que Fazer (5 minutos)

### 1️⃣ Filtro de Localidade
```
Home → Seleciona Estado → Clica "✓ Aplicar Filtros"
✅ Contadores atualizam INSTANTANEAMENTE
✅ Categorias com 0 ficam DESABILITADAS (opacas)
```

### 2️⃣ Modo Swipe
```
Categoria → Cards MAIORES → Setas nos lados
← VERMELHA (arrastar esquerda)
→ VERDE (arrastar direita)

Teclado:
- Seta direita (→) = Toast VERDE "♥ Adicionado!"
- Seta esquerda (←) = Toast VERMELHO "✕ Rejeitado!"
```

### 3️⃣ Página de Detalhes
```
Clique no card → 3 botões:
[✕ Passar]  [♥ Favoritar]  [💬 Entrar em contato]

+ Calculadora de orçamento
```

### 4️⃣ Activity (Header)
```
Clique "📊 Atividade" → 3 tabs:
- Matches (seus favoritos)
- Rejeitados (suas rejeições)
- Histórico (timeline)
```

---

## 🎨 Visual Rápida

```
HOME (Filtros)
├─ Estado: [São Paulo ▼]
├─ Cidade: [São Paulo ▼]
├─ [✓ Aplicar Filtros] [Limpar]
│
├─ Desenvolvimento: 12 (era 45) ✓
├─ Design: 8 (era 38) ✓
└─ Marketing: 15 (era 42) ✓

SWIPE DECK
├─ ← Rejeitar    Favoritar →
├─ [CARD GRANDE 75% MAIOR]
├─ [✕ Passar]  [♥ Favoritar]
└─ Toast visual ao usar teclado

ACTIVITY
├─ Matches (5)  Rejeitados (2)  Histórico
└─ [Cards com seus dados]
```

---

## ✅ Checklist de 30 segundos

- [ ] Contadores atualizam ao clicar "Aplicar Filtros"
- [ ] Categorias com 0 ficam opacas
- [ ] Cards no swipe são maiores
- [ ] Setas coloridas aparecem ao arrastar
- [ ] Toast verde ao usar seta direita
- [ ] Toast vermelho ao usar seta esquerda
- [ ] Botões ♥ ✕ na página de detalhes funcionam
- [ ] Activity mostra matches

---

## 🎯 Testes Específicos

**Filtro em tempo real:**
```
1. Seleciona São Paulo
2. Clica "Aplicar Filtros"
3. Aguarda ~1 segundo
4. Contadores DIMINUEM (✓)
```

**Toast no teclado:**
```
1. No SwipeDeck
2. Pressiona seta → do teclado
3. Toast VERDE aparece no topo (✓)
4. Desaparece após 2 segundos
```

**Sincronização:**
```
1. Favorita 3 profissionais
2. Abre Activity
3. Vê os 3 em "Matches" (✓)
4. Badge do header mostra "3" (✓)
```

---

## 🚦 Status Cores

🟢 **VERDE** = Sucesso (toast, info ativa, botões)
🟡 **AMARELO** = Pendente (filtro selecionado, não aplicado)
🔴 **VERMELHO** = Rejeição (toast rejeitado, seta esquerda)
⚫ **OPACO** = Desabilitado (categoria com 0 profissionais)

---

**Pronto! Comece agora:** http://localhost:3000 🎉
