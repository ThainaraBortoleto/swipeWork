# 🧪 Guia de Teste Completo - SwipeWork

## 🎯 5 Minutos de Teste

### **Passo 1: Abra a Home** (30 segundos)
```
1. Acesse http://localhost:3000
2. Você verá a tela de categorias com o filtro de localidade
3. Veja o header com logo "SwipeWork" e botão "📊 Atividade"
```

### **Passo 2: Teste os Filtros** (1 minuto)
```
1. Selecione um Estado (ex: "São Paulo")
2. ⚠️ Info AMARELA aparece: "Clique 'Aplicar Filtros'"
3. Contadores NÃO mudam ainda
4. Clique "✓ Aplicar Filtros"
5. ✅ Aguarde ~1 segundo
6. ✅ Contadores DIMINUEM instantaneamente
7. ✅ Info fica VERDE: "✓ Filtro ativo: São Paulo"
8. ✅ Categorias com 0 profissionais ficam OPACAS e desabilitadas
```

### **Passo 3: Teste o SwipeDeck** (1.5 minutos)
```
1. Clique em uma categoria (ex: "Desenvolvimento")
2. Você vê o modo "Modo swipe" ativo
3. Veja os CARDS MAIORES que antes
4. 👀 Observe as SETAS nos lados:
   ← Rejeitar (esquerda)
   Favoritar → (direita)
5. Teste teclado:
   - Pressione SETA DIREITA (→)
   - 🟢 Toast VERDE aparece: "♥ Adicionado!"
   - Card sai da tela
6. Próximo card:
   - Pressione SETA ESQUERDA (←)
   - 🔴 Toast VERMELHO aparece: "✕ Rejeitado!"
7. Teste mouse:
   - Clique em um card e ARRASTE para direita
   - Setas ficam VERDES
   - Overlay mostra "♥ SIM"
```

### **Passo 4: Teste Página de Detalhes** (1 minuto)
```
1. Volte para lista ("Ver em lista")
2. Clique em um card para abrir detalhes
3. 🎯 Você verá:
   - Foto e info do profissional
   - Calculadora de orçamento
   - DOIS botões no final:
     [✕ Passar]  [♥ Favoritar]
   - Botão de contato
4. Teste os botões:
   - Clique [♥ Favoritar]
   - Botão muda: "♥ Adicionado" (verde)
   - Clique novamente
   - Volta: "♥ Favoritar" (verde claro)
   - Clique [✕ Passar]
   - VOLTA à página anterior
```

### **Passo 5: Teste Activity** (1 minuto)
```
1. Favorita 2-3 profissionais no SwipeDeck
2. Clique em "📊 Atividade" (header)
3. Você vê 3 TABS:
   - Matches (com badge do total)
   - Rejeitados (com badge do total)
   - Histórico (com timestamps)
4. 👀 Observe:
   ✅ Seus matches aparecem lá
   ✅ Cards mostram info correta
   ✅ Botões "Ver detalhes" e "✕ Remover"
   ✅ Links funcionam
```

---

## ✅ Checklist Detalhado

### Filtros de Localidade
- [ ] Dropdown Estado carrega com dados
- [ ] Ao selecionar, Cidades aparecem
- [ ] Info AMARELA mostra antes de aplicar
- [ ] Botão "✓ Aplicar Filtros" fica AZUL (ativado)
- [ ] Ao clicar, contadores DIMINUEM instantaneamente
- [ ] Info muda para VERDE
- [ ] Categorias com 0 ficam desabilitadas (opacas)
- [ ] Botão "Limpar" reseta tudo
- [ ] Contadores voltam ao normal

### SwipeDeck Visual
- [ ] Cards aparecem MUITO maiores
- [ ] Setas aparecem nos lados (← →)
- [ ] Ao arrastar esquerda, seta esquerda fica VERMELHA
- [ ] Ao arrastar direita, seta direita fica VERDE
- [ ] Overlay mostra "✕ NAO" (vermelho) ou "♥ SIM" (verde)
- [ ] Após soltar, card sai da tela

### Keyboard Feedback
- [ ] Seta → do teclado mostra toast VERDE
- [ ] Toast mostra "♥ Adicionado!"
- [ ] Seta ← do teclado mostra toast VERMELHO
- [ ] Toast mostra "✕ Rejeitado!"
- [ ] Toast desaparece após 2 segundos
- [ ] Tem animação (scale + opacity)

### Botões de Ação
- [ ] [♥ Favoritar] aparece na página de detalhes
- [ ] [✕ Passar] aparece na página de detalhes
- [ ] [💬 Entrar em contato] aparece abaixo
- [ ] ♥ muda de estado (Adicionado ↔ Favoritar)
- [ ] ✕ volta para página anterior

### Sincronização
- [ ] Header badge mostra contagem de matches
- [ ] Badge atualiza ao favoritar
- [ ] Activity mostra profissionais favoritados
- [ ] Página de detalhes reflete estado (♥ Adicionado)
- [ ] Histórico mostra timeline com timestamps

### Calculadora
- [ ] Aparece na página de detalhes
- [ ] Input para número de horas funciona
- [ ] Botões quick (1h, 2h, 4h, 8h) funcionam
- [ ] Total calcula automaticamente
- [ ] Breakdown mostra valor/h, horas, total
- [ ] Disclaimer aparece

---

## 🐛 Se Algo Não Funcionar

**1. Contadores não atualizam ao clicar "Aplicar":**
- Abra Console (F12)
- Procure por: "✅ Filtros aplicados com sucesso!"
- Se não aparecer, recarregue a página (Ctrl+F5)

**2. Toast não aparece ao usar teclado:**
- Console deve mostrar logs dos toasts
- Tente recarregar a página
- Verifique se está no SwipeDeck (modo swipe)

**3. Categorias não ficam desabilitadas:**
- Reload a página
- Aplique filtro novamente
- Contadores devem atualizar primeiro

**4. Geral não funciona:**
- Abra Console (F12)
- Procure por erros vermelhos
- Se houver, anote e reinicie o servidor
- Recarregue a página (Ctrl+F5 = hard refresh)

---

## 📊 Observações Importantes

✅ **Real-time**
- Contadores atualizam instantaneamente ao clicar "Aplicar"
- Matches sincronizam em tempo real
- Badge do header atualiza ao favoritar

✅ **Responsivo**
- Testa em diferentes tamanhos de tela
- Mobile: filtro e categorias stackados
- Desktop: layout lado a lado (se aplicável)

✅ **Estados Visuais**
- ⚠️ AMARELO = filtro selecionado, não aplicado
- ✅ VERDE = filtro ativo, aplicado
- ❌ OPACO = categoria sem profissionais (desabilitada)
- 🟢 VERDE = ação bem-sucedida (botão, toast)
- 🔴 VERMELHO = rejeição/ação negativa

✅ **Feedback Visual**
- Setas coloridas ao arrastar
- Toast ao usar teclado
- Info visual mostrando estado do filtro
- Badge no header com contagem

---

## 🎯 Teste de Satisfação (Opcional)

Após seguir os passos, responda:
- ✅ Os contadores atualizam corretamente?
- ✅ O feedback visual é claro?
- ✅ É intuitivo usar o app?
- ✅ Todas as ações funcionam?
- ✅ Performance é boa?

---

**Acesse:** http://localhost:3000

**Divirta-se testando! 🚀**
