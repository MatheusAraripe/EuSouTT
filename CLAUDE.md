# EuSouTT — Portfólio de Matheus Araripe

Portfólio de uma tela só em React 19 + Vite 8 + Tailwind CSS v4. Conteúdo em pt-BR.
Identidade: papel `#f9f9f9`, preto em opacidades, serifada (Cactus Classical
Serif) + mono (Roboto Mono). Toda a navegação acontece num **menu invocado
pelo clique**: o usuário clica em qualquer ponto e o menu surge ali.

Repositório: https://github.com/MatheusAraripe/EuSouTT (branch `main`). O
produto é o site pessoal de Matheus Araripe — designer que programa. "alia",
nome antigo da pasta, sobrevive só no `name` do `package.json`.

## Comandos

```bash
npm run dev       # servidor Vite em http://localhost:5173
npm run build     # build de produção em dist/
npm run preview   # serve o build
npm run lint      # ESLint flat config (ignora dist/)
```

Não há testes configurados. Não há TypeScript — JS/JSX puro.
`.claude/launch.json` já define a config de launch (`npm run dev`, porta 5173).

### Deploy

GitHub Pages via Actions (`.github/workflows/deploy.yml`): cada push na `main`
roda `npm run build` e publica `dist/`. Em Settings → Pages, Source precisa
ser **GitHub Actions** — servir a raiz do repositório entrega o `index.html`
de desenvolvimento (`/src/main.jsx`) e a tela fica branca. `base: "./"` no
`vite.config.js` porque o site mora em `/EuSouTT/`, não na raiz do domínio.

### Git

- Fora do repositório (`.gitignore`): `Figma/` — o `.fig` traz material de
  cliente (proposta com valores) e não deve ser publicado —, os originais
  pesados das mídias (`src/assets/motion/`, ~15MB; o site só usa
  `src/assets/media/`), `dist/`,
  `node_modules/` e os arquivos locais do graphify (`cache/`,
  `.graphify_python`, cópias datadas `20*/`). O grafo em si é versionado.
- `.claude/settings.json` é versionado, mas os hooks do graphify apontam para
  caminhos absolutos desta máquina.
- `src/assets/` tem o CV, a foto e as mídias leves — são públicos no
  repositório.

## Arquitetura

```
index.html              shell + SEO/OG + Google Fonts (Cactus Classical Serif, Roboto Mono 300/500)
src/main.jsx            createRoot + StrictMode
src/App.jsx             a tela: vitrine no centro, invocação do menu, bolinha (desktop), aviso (toque/teclado)
src/components/Showcase.jsx   vitrine do centro: retrato + h1, moodboard ou motion, catálogo (nome, setas)
src/components/AnchorDot.jsx  bolinha em canvas que segue o mouse e vira a âncora
src/components/Menu.jsx o menu: geometria, navegação por níveis, FLIP, foco
src/components/icons.jsx       Spark (marca do clique) e ArrowBack
src/index.css           tokens (@theme) + escala tipográfica, barra de rolagem do menu, reduced-motion
src/data/content.js     FONTE ÚNICA DE CONTEÚDO — a árvore `menu` (e as mídias dos nós)
src/data/slides.js      lista da vitrine derivada do `menu` (retrato + nós com `media`) e `slideOf`
public/                 favicon.svg (a bolinha, cor pelo tema do navegador) + apple-touch-icon.png
src/assets/             CV (PDF, só fonte de texto); `image/` (foto) e `motion/` (originais, fora do git); `media/`: as versões leves usadas no site
Figma/                  protótipo (.fig) + prints das regras do menu (local, fora do git)
```

Não há roteador, estado global, backend nem fetch. Tudo é estático e client-side.

### O menu (regras do protótipo em `Figma/`)

- **Invocação**: `App` escuta `click` na janela. Menu fechado → abre no ponto.
  Menu aberto e clique fora → fecha. O próximo clique invoca de novo.
- **Sem memória**: cada invocação monta `<Menu key={nova}>`, então sempre nasce
  na raiz. Não "conserte" isso guardando estado.
- **Quadrantes**: o ponto divide a tela em quatro. Lado esquerdo/direito define
  a justificação (L/R); metade de cima cresce para baixo, de baixo para cima.
  Largura/altura são limitadas ao espaço até a borda (`MARGIN`), então o menu
  nunca sai da tela. Ver `place()` em `Menu.jsx`.
- **Caixa estática, âncora fixa**: a caixa (invisível) é calculada uma vez por
  invocação. Navegar troca só o conteúdo; o que não couber rola dentro dela.
  Resize fecha o menu (a caixa valeria para outra tela). A caixa tem 18px no pé
  (`FOOT`) — no setor de baixo é o que afasta o texto da âncora.
- **Rolagem mínima**: só o fio da barra (3px, sem setas nem trilho), e só com
  o cursor sobre o menu ou foco *de teclado* dentro dele (`:focus-visible`; o
  foco que um clique deixa no item não conta). O fio é pintado com
  `currentColor` e o que alterna é a `color` da `nav` — o Chromium não repinta
  o thumb de forma confiável só com `:hover`. Por isso a `nav` tem cor
  transparente e o wrapper interno devolve `text-black`. Não adicione
  `scrollbar-width`/`scrollbar-color` fora do `@supports`: desligam as regras
  webkit e devolvem as setas.
- **Aviso de rolagem**: a borda do menu que ainda tem texto esmaece em 32px
  (`data-more` = `top`/`bottom`, escrito no DOM por um efeito do `Menu`;
  máscara em `index.css`). É o que avisa, no toque, que a tela continua — lá
  o fio da barra nunca aparece. `MAX_H` (576) cabe Sobre inteiro quando há
  espaço; com o clique no meio da tela quem limita é a distância até a borda
  (no celular, ~170px de largura), e aí o aviso é o que resta.
- **A barra é borda do menu** (`tight` em `Menu.jsx`): no lado R, quando a
  tela rola, a caixa passa a terminar na borda do texto — a barra ocupa essa
  linha e o texto recua. A checagem roda no layout effect e também num
  `ResizeObserver`, porque a mono do texto corrido só carrega ao abrir a tela.
- **Bolinha (desktop)**: `AnchorDot` é a âncora antes do clique. Segue o mouse
  por molas (seguimento + deformação na direção da velocidade = ar líquido);
  com o menu aberto pousa na âncora que o `Menu` informa via `onAnchor`, e
  encolhe abaixo da raiz (onde entra a seta). Após 2s sem clique, repete um
  convite mínimo: o disco afunda e os raios da Spark saem dele. Com o menu
  fechado a `main` tem `cursor-pointer` (a tela toda invoca); aberto, volta o
  cursor padrão. No toque não
  existe — lá fica o aviso "Toque em qualquer lugar"; no desktop o aviso é
  `sr-only` até receber foco (entrada do teclado).
- **Âncora**: na raiz mostra a `Spark` (espelhada para os raios apontarem para
  longe do menu); abaixo da raiz vira a seta de voltar, no mesmo ponto,
  apontando para o lado em que o texto está justificado (→ no R, ← no L), com
  a cauda exatamente na borda do menu (texto ou barra), como nas outras telas.
- **Título que viaja**: todo bloco tem `data-flip` com um id estável. Antes de
  navegar, `go()` fotografa os rects; depois, blocos que persistem deslizam
  (FLIP) e os novos surgem em cascata a partir da âncora.
- **Trilha**: as seções da raiz que são só categorias (Trabalhos/
  Projetos/Contato) não viram cabeçalho; os nós abaixo delas empilham no
  topo com o mesmo estilo que tinham na lista. Seção da raiz com `meta` (Sobre, "TT") se
  apresenta como título: entra na trilha e seus filhos descem um nível
  (`depth` em `View`) — viram tópicos h4, como os de um trabalho. Na lista da
  raiz o `meta` não aparece.

### `src/data/content.js` é o ponto de entrada para conteúdo

Um único export, `menu`: árvore de nós `{ id, title, meta?, link?, body?,
lede?, points?, children?, href? }`. Nó com `children`/`body`/`lede`/`points`
abre um nível; com `href` é link; sem nada é só texto (sem risco, sem
foco). **Ao adicionar/editar conteúdo, edite esse arquivo — não os
componentes.** `id` precisa ser único na árvore inteira (é a
chave do FLIP). A tipografia sai do nível (`TITLE` em `Menu.jsx`), não do nó.
Nó com `meta` e `link` ganha o ícone `ArrowOut` ao lado do subtítulo, um link
para o projeto (nova aba).

**Trabalhos e projetos são uma tela só**: `lede` (a frase de abertura do CV,
quando há) + `points` (os resultados). Não têm `children` — quem entra lê,
não navega mais para dentro. Não reintroduza subníveis ali. A leitura desce
em três camadas, separadas por fonte, peso e espaço — **sem traço nem
marcador**: `lede` em serifa (`type-lede`, .85), a manchete de cada tópico em
mono medium (`type-h4`, .85) e o detalhe em mono light (`type-p`, .65). Cada
tópico é `"manchete"` ou `["manchete", "detalhe"]`; a manchete sozinha precisa
fazer sentido (é o que se lê passando o olho). Abertura e tópicos são texto:
bloco justificado na largura toda do menu, como o `body` de Sobre (alinhar
pelo lado da âncora deixava título num canto e texto no outro). Sem itálico:
a Cactus só tem regular.

**A área clicável é só o título.** O `<button>`/`<a>` do item envolve apenas o
`Title`; o `Meta` (subtítulo + ícone) vem depois, como irmão — link dentro de
botão é HTML inválido, e o subtítulo não deve abrir o nó. Título e meta
empilham em coluna alinhada ao lado da âncora (`stack` em `View`), na lista e
na trilha.

## Convenções do projeto

- **Risco no meio da palavra = clicável ou "você está aqui".** No hover/foco
  de teclado de um item do menu, um risco de 1px corre da esquerda para a
  direita pelo meio do título (`STRIKE` em `Menu.jsx`: fundo animado com
  `box-decoration-break: clone`, que risca cada linha de um título que
  quebra). No título de um nó aberto (a trilha) o risco fica — é a marca de
  onde a pessoa está. Meta e textos nunca riscam. O glitch antigo saiu: não
  combinava mais com a estética; não o traga de volta.
- **Clique sintetizado por teclado tem `detail === 0`.** É assim que a janela
  ignora Enter/Espaço, que o aviso abre o menu pelo teclado (no centro) e que o
  menu decide mover o foco (só em navegação por teclado).
- **Dentro/fora por `composedPath()`, não `contains()`.** Quando o listener da
  janela roda, o React pode já ter desmontado o botão clicado. Elementos que
  contam como "dentro" levam `data-menu` (conteúdo e âncora — não a caixa
  inteira, que é invisível). O que trata o próprio clique (setas e link da
  vitrine) leva `data-own`: nem invoca nem dispensa o menu.
- **Animação fora do React.** FLIP e entrada via Web Animations API no
  `useLayoutEffect`; zero estado de animação. `AnchorDot` recebe props só em
  eventos raros (abrir, navegar) e as copia para refs que o loop lê.
- **Bolinha barata por construção.** Canvas 2D de 176×56px (não WebGL, não tela
  cheia) movido por `translate3d` — o compositor move a camada. O rAF hiberna
  quando as molas assentam; o próximo convite acorda por `setTimeout`. DPR
  limitado a 2. Não troque por canvas de tela cheia nem por loop contínuo.
- **Bolinha em inversão cromática.** O canvas desenha branco a .75 com
  `mix-blend-difference`: no papel dá o grafite de sempre, sobre a foto ou
  texto escuro vira claro. Não troque por preto nem tire o blend. A exceção
  é a pílula: sobre um elemento com `data-cursor` (as mídias) o disco se
  estica até virar uma pílula preta a .85 com o texto do atributo ("Ver
  projeto") no papel — ali o blend sai, porque deixaria o texto ilegível
  sobre a foto. Com o menu aberto a bolinha é âncora e não vira pílula.
- **Disco da Spark no desktop é do canvas.** O `<circle>` da `Spark` tem
  `pointer-fine:hidden`; o SVG só contribui com os raios.
- **Acessibilidade não é opcional aqui.** `nav` rotulada, `h1` sr-only, anel de foco em `--color-accent`,
  Esc fecha e devolve o foco ao aviso, voltar devolve o foco ao item de origem.
- **`prefers-reduced-motion` desliga efeitos.** Checado em JS (`Menu`,
  `AnchorDot` — gruda no mouse e mostra os raios parados —, `Showcase` —
  troca seca e o vídeo não toca) e em CSS
  (`index.css`). Todo efeito novo precisa desse guarda.
- **Um único acento de cor.** `--color-accent` (violeta da marca), hoje só no
  foco. Fora dele, preto em opacidades (.85 títulos, .75 raiz, .65 meta/texto).
- **Escala tipográfica de múltiplos de 4** (`Figma/hierarquia de textos *.png`,
  `Tamanho de texto.png`). Só três tamanhos, tokens `--text-title` (20/24),
  `--text-body` (16/20) e `--text-small` (12/16) no `@theme`; abaixo de 640px
  título e corpo descem um degrau (16, 12) trocando as variáveis. O pequeno
  fica em 12 — 8px é ilegível; no celular ele empata com o corpo e se
  distingue pela caixa alta e pelo peso. Nunca crie um tamanho fora da escala
  nem `text-[…px]`.
- **Escala de espaços, também base 4 e com nome** (`--spacing-*` no `@theme`):
  `2xs` 4 (título → subtítulo, manchete → detalhe), `xs` 8 (mídia → nome,
  catálogo → mídia, ícone → texto), `sm` 12 (cabeçalho → abertura, itens da
  raiz), `md` 16 (entre tópicos, parágrafos, itens; cabeçalho → conteúdo),
  `lg` 24 (abertura → tópicos, entre títulos da trilha), `xl` 32. Margens e
  gaps usam só esses (`mt-sm`, `gap-md`); quanto mais perto, mais junto — é o
  vazio que separa grupos. Medidas de peças (foto, vídeo, ícones) e áreas de
  toque não entram nessa escala. Os papéis são utilitários em
  `index.css`: `type-h1` (a frase sob a foto, único h1 — 16, não 20, para não
  competir com o menu) e `type-h2` (raiz e títulos, 20) em serifa regular; `type-h3` (subtítulos/meta) mono light caixa
  alta; `type-h4` (links de navegação abaixo dos títulos) mono medium;
  `type-p` mono light; `type-lede` (abertura de trabalho) serifa 16. Dentro de `<button>`/`<a>` o papel é só visual (heading
  não pode morar ali); na trilha do menu vira a tag de verdade (`h2`/`h4` +
  `h3` no meta). Roboto Mono carrega 300 e 500 (o bold do protótipo pesava).
- **Centro da tela (vitrine)**: uma mídia por vez, com catálogo — uma seta
  em cada canto de cima com a posição entre elas, nome (+ `ArrowOut`) no
  canto inferior esquerdo. Setas e posição ficam apagadas (preto a .25) e só
  acendem no hover/foco, quando a seta "passa" (sai e uma cópia entra) —
  mínimo de ruído em volta da mídia.
  A troca "passa": a peça que sai desliza 24px (`DRIFT`) e some para o lado
  da seta (240ms), e as da nova entram em cascata pelo lado oposto (480ms,
  curva do menu). Vinda do menu, a direção segue a ordem. A que sai fica
  montada com a mesma `key` (o vídeo não reinicia), por cima e fora do layout.
  A primeira é o retrato: foto 144×192 → 192×256 a partir de 640px
  (múltiplos de 4, um degrau como o texto) + h1 em duas linhas; clicar nela
  invoca o menu como qualquer ponto. Depois vêm as `media` dos nós, na ordem
  do menu (`data/slides.js`); as setas giram em volta. Abrir no menu um nó
  com mídia pula para ela (`onOpenNode`); nós sem mídia não mexem na
  vitrine. Toda mídia é link para o `link` do nó (nova aba). Tipos:
  `motion` (vídeo quadrado 304 → 480, limitado pela altura da tela, loop, mudo, `playsInline`) — hoje
  todos os trabalhos e projetos com mídia usam este, para o portfólio ler
  como uma série coesa — e `moodboard` (grade com molde em `.moodboard`,
  `index.css`: quadrado 4×4 de até 560px no desktop, vertical 3×4 de 288px
  no celular, com menos peças), suportado mas sem nó usando. Mídia
  nova: gere a versão leve em `src/assets/media/` (WebP 480px no lado menor;
  vídeo 720×720 sem áudio, `-movflags +faststart`) — nunca importe o
  original. Abaixo da vitrine fica o aviso. Se o texto do menu (conteúdo recortado
  pela caixa, `box` no `onAnchor`) cobre o centro, ele vai a `opacity-10`
  (`data-covered`, escrito no DOM pelo App) — menu preto sobre foto escura é
  ilegível. Longe dela, tudo segue visível.
- **Alinhamento**: títulos, subtítulos e links seguem o lado da âncora
  (L/R); texto (`body`, `lede`, `points`) nunca — são blocos justificados
  na largura toda do menu (`self-stretch text-justify hyphens-auto` — a coluna é estreita e a mono larga; sem hifenizar abrem buracos), com a última linha
  no início, como no protótipo.
- **Zero dependências de UI.** SVG inline; sem lib de animação, ícones ou
  componentes. Só React, React DOM e Tailwind. Fontes via Google Fonts.
- **Comentários em pt-BR** explicando o *porquê*, no topo do bloco. Siga o tom.
- **Tailwind v4** via plugin do Vite (`@tailwindcss/vite`) e `@import "tailwindcss"`
  no CSS. Não existe `tailwind.config.js` — não crie um sem necessidade.

## Pendências conhecidas

- Trabalho e Projeto vêm do CV (`src/assets/CV`, FlowCV de 2026-10), já
  partidos em manchete/detalhe. Exceção: Inexplicável ("Design System &
  Identidade") foi reescrito pelo Matheus — não volte ao texto do CV. Ao
  trocar o CV, refaça `works`/`projects` a partir dele.
- `src/assets/media/inexplicavel/*.webp`: as fotos do moodboard antigo, sem
  uso desde que a Inexplicável virou motion (o tipo `moodboard` segue
  suportado). Apagar se não voltarem.
- `README.md` ainda é o boilerplate do template Vite.

## Mantendo este arquivo vivo

Sempre que a arquitetura mudar — nova seção, nova dependência, mudança de
convenção, pendência resolvida — edite o CLAUDE.md na mesma leva, não depois.
O grafo abaixo cobre a estrutura; este arquivo cobre a intenção.

Outputs do grafo em `graphify-out/`: `graph.html` (interativo, abrir no
navegador), `GRAPH_REPORT.md` (auditoria, comunidades, god nodes),
`graph.json` (dados brutos).

Mudanças em docs ou imagens (`README.md`, `index.html`, `public/`, `src/assets/`)
não entram no `graphify update .` — para essas, rode `/graphify . --update`.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
