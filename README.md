# Robô em Recuperação 🤖⚙️ — Trabalho Escolar

> Um jogo web arcade 2D onde o jogador ajuda um pequeno robô triste e sem energia a recuperar suas forças coletando engrenagens e desviando de perigos ao longo de 5 cenários temáticos.

---

## 🎮 Como Jogar e Apresentar na Escola

### Execução Rápida (100% Offline)
- Não precisa instalar nada, nem Node, nem Python!
- Basta dar um **duplo clique no arquivo `index.html`** para abrir no Google Chrome, Microsoft Edge ou Firefox.
- **Para levar para a escola:** Basta copiar a pasta do projeto para um **pendrive** ou enviar o arquivo compactado (.zip) para o Google Drive / E-mail.

### Controles
| Comando | Ação |
|---|---|
| `←` `→` ou `A` `D` | Movimenta o robô para a esquerda e direita |
| **Mouse / Touch** | Arraste o cursor/dedo para guiar o robô suavemente |
| `P` ou `ESC` | Pausa a partida a qualquer momento (ideal para tirar dúvidas do professor) |
| `M` | Liga ou desliga o som imediatamente (Mudo) |
| `Espaço` ou `Enter` | Inicia o jogo ou avança de fase |

---

## 🗺️ Os 5 Cenários e a Evolução do Robô

O robô passa por uma transformação visual visível a cada fase superada:

1. **Nível 1 — Ferro-Velho Abandonado:**
   - *Meta:* 10 engrenagens em 30 segundos.
   - *Robô:* Corcunda, enferrujado, olhos apagados e boca triste.
   - *Perigo:* Sucata enferrujada (-1 engrenagem).
2. **Nível 2 — Oficina Mecânica:**
   - *Meta:* 15 engrenagens em 35 segundos.
   - *Robô:* Postura mais ereta, ferrugem limpa, olhos piscam em amarelo.
   - *Perigo:* Parafuso quebrado e graxa (-1 engrenagem).
3. **Nível 3 — Fábrica a Vapor:**
   - *Meta:* 20 engrenagens em 40 segundos.
   - *Robô:* Postura firme, núcleo do peito começa a pulsar energia e primeiros sorrisos.
   - *Novidade:* Surgem **Engrenagens Azuis Raras (+3 peças)**!
   - *Perigo:* Jatos de vapor quente (-2 engrenagens).
4. **Nível 4 — Usina Elétrica:**
   - *Meta:* 25 engrenagens em 40 segundos.
   - *Robô:* Postura confiante, olhos azuis brilhantes e núcleo em alta voltagem.
   - *Perigo:* Raios elétricos (-2 engrenagens).
5. **Nível 5 — Laboratório Hi-Tech (Fase Final):**
   - *Meta:* 30 engrenagens em 45 segundos.
   - *Robô:* Ritmo acelerado rumo à redenção total!
   - *Perigo:* Orbes de plasma instável (-3 engrenagens).
6. **Vitória Gloriosa!**
   - Chuva de confetes coloridos, fanfarra musical e o robô completo: **armadura cromada reluzente com reflexos, olhos azuis radiantes e um sorriso super feliz!**

---

## 🛠️ Tecnologias Utilizadas (Documentação Técnica)
- **HTML5 Canvas 2D:** Renderização gráfica a 60 FPS com cálculo de `deltaTime` (velocidade idêntica em qualquer monitor de 60Hz a 144Hz).
- **CSS3 Vanilla Moderno:** Design sci-fi, glassmorphism e proporção 16:9 responsiva.
- **JavaScript Puro (ES6+):** Código modular sem dependências ou frameworks pesados.
- **Web Audio API:** Sintetizador procedural em tempo real (bipes, curto-circuitos e fanfarras gerados por código, sem arquivos `.mp3` pesados).

---

## 📋 Documentação do Ciclo de Software (Pasta `docs/`)
O projeto seguiu o processo formal de engenharia de software do **Mini AI-DLC**:
- `docs/PRODUCT_BRIEF.md`: Concepção, público, escopo do MVP e análise de viabilidade.
- `docs/MECANICAS_E_REGRAS.md`: Balanceamento de velocidade, spawn e regras de dano.
- `docs/HISTORIAS_DE_USUARIO.md`: Histórias de usuário e critérios de aceite.
- `docs/TELAS_E_NAVEGACAO.md`: Máquina de estados das telas e HUD.
- `docs/ESTRUTURA_DE_DADOS.md`: Modelo do estado global e entidades.
- `docs/ARQUITETURA_E_STACK.md`: Decisões arquiteturais e convenções de código.
- `STATUS.md`: Diário dinâmico de desenvolvimento do projeto.
