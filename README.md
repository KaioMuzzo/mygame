# Browser Game — Design Document

> Jogo de navegador estilo Goodgame Mafia / Shakes and Fidget com combate por turnos estratégico.

---

## Stack Técnica

| Camada | Tecnologia |
|--------|-----------|
| Frontend | html + tailwindcss |
| Backend | Node.js + Express + TypeScript |
| Banco de dados | MySQL |
| ORM | Prisma 7 |
| Validação | Zod |
| Gerenciador de pacotes | pnpm (workspaces) |

### Estrutura do monorepo

---

## Sistema de Progressão

- **Level cap:** 50
- **Pontos totais:** 200 (4 pontos por level)
- **Sem cap por atributo** — o jogador pode distribuir livremente, incluindo colocar todos os pontos em um único atributo
- **Redistribuição:** o personagem pode resetar os pontos a qualquer momento
- **Múltiplos personagens** por conta

### Fase 2 (planejada)
- Equipamentos com item level (iLvl) que adicionam bônus em cima dos atributos base
- Endgame focado em farm de gear, similar ao WoW

---

## Atributos (9 no total)

### Ofensa
| Atributo | Efeito |
|----------|--------|
| **Força** | Dano base de ataques físicos |
| **Magia** | Dano base de habilidades mágicas |

### Defesa
| Atributo | Efeito |
|----------|--------|
| **Vida** | HP máximo do personagem |
| **Armadura** | Redução de dano físico recebido |
| **Resistência** | Redução de dano mágico recebido |

### Ritmo
| Atributo | Efeito |
|----------|--------|
| **Stamina** | Pool de stamina por turno |
| **Agilidade** | Chance de crítico + chance de esquiva |

### Espírito
| Atributo | Efeito |
|----------|--------|
| **Foco** | Eficácia e duração de buffs |
| **Sorte** | Bônus em todas as chances (crítico, esquiva, drops) |

### Fórmula de redução de dano (Armadura e Resistência)
Inspirada no League of Legends — retornos decrescentes, nunca chega a 100%:

```
Redução = Pontos / (Pontos + 100)
```

Exemplos:
- 50 pontos → 33% de redução
- 100 pontos → 50% de redução
- 200 pontos → 66% de redução

---

## Sistema de Combate

### Estrutura de um turno
1. O jogador escolhe suas ações gastando stamina livremente
2. Quando passa a vez (ou a stamina acaba), o inimigo age
3. O resultado de todas as ações é calculado e exibido no log

### Stamina
- Cada personagem (jogador e inimigo) tem um pool de stamina por turno
- As ações custam stamina — o jogador decide como distribuir
- Investir em Stamina aumenta o pool disponível por turno, permitindo mais ações

### Efeitos e duração
- Efeitos têm duração em turnos (ex: "por 3 turnos")
- Exemplos de mecânicas: buff de dano no próximo turno, reflexo de dano bloqueado, acúmulo de stacks

### Inimigos
- Também têm stamina e usam IA para decidir as ações
- A IA avalia o estado atual (HP baixo, buffs ativos, etc.) para priorizar ações

---

## Sistema de Cartas (Habilidades)

- Habilidades são **cartas compradas** pelo jogador
- O personagem tem uma **coleção** de cartas e monta um **deck ativo**
- A eficácia de cada carta é influenciada pelos atributos do personagem
  - Ex: um Arqueiro com muita Agilidade usa "Disparo Duplo" melhor que um Guerreiro
- A lógica de cada carta é **hardcodada no servidor** (Opção 1)
  - No banco: apenas o identificador (`key`) e metadados da carta
  - No código: arquivo com a lógica de cada carta (ex: `cards.ts`)
  - Nova carta = mexe no código + adiciona linha no banco

---

## Arquétipos de Build (emergem naturalmente dos atributos)

| Arquétipo | Foco principal |
|-----------|---------------|
| Guerreiro | Força + Armadura |
| Mago | Magia + Stamina |
| Tank clássico | Vida + Armadura + Resistência |
| Tank evasivo | Vida + Agilidade *(incomum, build criativa)* |
| Suporte | Foco + Stamina |
| Coringa | Sorte (build experimental) |

---

## Banco de Dados (Prisma)

Tabelas criadas:

- `User` — conta do jogador
- `Character` — personagem com todos os 9 atributos
- `Card` — cartas disponíveis no jogo
- `CharacterCard` — coleção de cartas do personagem
- `DeckCard` — deck ativo montado pelo personagem
- `Equipment` — equipamentos disponíveis no jogo
- `InventoryItem` — inventário do personagem

---

## Pendente / Próximos passos

- [ ] Configurar `tsconfig.json` e estrutura de pastas do backend
- [ ] Criar `server.ts` com Express
- [ ] Rotas de autenticação (registro e login)
- [ ] Definir valor exato de cada ponto por atributo
- [ ] Modelar sistema de combate no backend
- [ ] Definir primeiras cartas do jogo
- [ ] Tela de combate no frontend (layout base já prototipado)