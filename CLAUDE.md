# EuSouTT — Portfólio de Matheus Araripe

Portfólio de uma tela só em React 19 + Vite 8 + Tailwind CSS v4. Conteúdo em pt-BR.
Identidade: papel `#f9f9f9`, preto em opacidades, serifada (Cactus Classical
Serif) + mono (IBM Plex Mono). Toda a navegação acontece num **menu invocado
pelo clique**: o usuário clica em qualquer ponto e o menu surge ali.

Repositório: https://github.com/MatheusAraripe/EuSouTT (branch `main`). O
produto é o site pessoal de Matheus Araripe — designer que programa. "alia",
nome antigo da pasta, sobrevive só na marca do favicon.

## Comandos

```bash
npm run dev       # servidor Vite em http://localhost:5173
npm run build     # build de produção em dist/
npm run preview   # serve o build
npm run lint      # ESLint flat config (ignora dist/ e legacy/)
```

Não há testes configurados. Não há TypeScript — JS/JSX puro.
`.claude/launch.json` já define a config de launch (`npm run dev`, porta 5173).

### Git

- Fora do repositório (`.gitignore`): `Figma/` — o `.fig` traz material de
  cliente (proposta com valores) e não deve ser publicado —, `dist/`,
  `node_modules/` e os arquivos locais do graphify (`cache/`,
  `.graphify_python`, cópias datadas `20*/`). O grafo em si é versionado.
- `.claude/settings.json` é versionado, mas os hooks do graphify apontam para
  caminhos absolutos desta máquina.
- `src/assets/` tem o CV e a foto — são públicos no repositório.

## Arquitetura

```
index.html              shell + SEO/OG + Google Fonts (Cactus Classical Serif, IBM Plex Mono 300/600)
src/main.jsx            createRoot + StrictMode
src/App.jsx             a tela: invocação do menu, bolinha (desktop), aviso (toque/teclado)
src/components/AnchorDot.jsx  bolinha em canvas que segue o mouse e vira a âncora
src/components/Menu.jsx o menu: geometria, navegação por níveis, FLIP, foco
src/components/GlitchText.jsx  glitch por caractere no hover/touch
src/components/icons.jsx       Spark (marca do clique) e ArrowBack
src/index.css           tokens (@theme), barra de rolagem do menu, reduced-motion
src/data/content.js     FONTE ÚNICA DE CONTEÚDO — a árvore `menu`
src/assets/             CV (PDF) e foto `tt.jpg` — ainda não usados pela tela
Figma/                  protótipo (.fig) + prints das regras do menu (local, fora do git)
legacy/                 interface antiga (cursor, hero, header…), fora do build
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
  Resize fecha o menu (a caixa valeria para outra tela). A caixa embute folga
  para o rótulo `Δx=…px` do glitch (`GLITCH_X`/`GLITCH_Y`): 18px embaixo —
  no setor de baixo é o que afasta o texto da âncora — e 14px à direita. Sem
  ela o rótulo é cortado e estica a área de rolagem.
- **Rolagem mínima**: só o fio da barra (3px, sem setas nem trilho), e só com
  o cursor sobre o menu ou foco *de teclado* dentro dele (`:focus-visible`; o
  foco que um clique deixa no item não conta). O fio é pintado com
  `currentColor` e o que alterna é a `color` da `nav` — o Chromium não repinta
  o thumb de forma confiável só com `:hover`. Por isso a `nav` tem cor
  transparente e o wrapper interno devolve `text-black`. Não adicione
  `scrollbar-width`/`scrollbar-color` fora do `@supports`: desligam as regras
  webkit e devolvem as setas.
- **A barra é borda do menu** (`tight` em `Menu.jsx`): no lado R, quando a
  tela rola, a caixa passa a terminar na borda do texto — a barra ocupa essa
  linha e o texto recua. A checagem roda no layout effect e também num
  `ResizeObserver`, porque a mono do texto corrido só carrega ao abrir a tela.
- **Bolinha (desktop)**: `AnchorDot` é a âncora antes do clique. Segue o mouse
  por molas (seguimento + deformação na direção da velocidade = ar líquido);
  com o menu aberto pousa na âncora que o `Menu` informa via `onAnchor`, e
  encolhe abaixo da raiz (onde entra a seta). Após 2s sem clique, repete um
  convite mínimo: o disco afunda e os raios da Spark saem dele. No toque não
  existe — lá fica o aviso "Toque em qualquer lugar"; no desktop o aviso é
  `sr-only` até receber foco (entrada do teclado).
- **Âncora**: na raiz mostra a `Spark` (espelhada para os raios apontarem para
  longe do menu); abaixo da raiz vira a seta de voltar, no mesmo ponto,
  apontando para o lado em que o texto está justificado (→ no R, ← no L), com
  a cauda exatamente na borda do menu (texto ou barra), como nas outras telas.
- **Título que viaja**: todo bloco tem `data-flip` com um id estável. Antes de
  navegar, `go()` fotografa os rects; depois, blocos que persistem deslizam
  (FLIP) e os novos surgem em cascata a partir da âncora.
- **Trilha**: as seções da raiz (Sobre/Trabalho/…) não viram cabeçalho; os nós
  abaixo delas empilham no topo com o mesmo estilo que tinham na lista.

### `src/data/content.js` é o ponto de entrada para conteúdo

Um único export, `menu`: árvore de nós `{ id, title, meta?, body?, children?,
href? }`. Nó com `children`/`body` abre um nível; com `href` é link; sem nada é
só texto (sem glitch, sem foco). **Ao adicionar/editar conteúdo, edite esse
arquivo — não os componentes.** `id` precisa ser único na árvore inteira (é a
chave do FLIP). A tipografia sai do nível (`TITLE` em `Menu.jsx`), não do nó.

## Convenções do projeto

- **Glitch só no que é clicável.** `GlitchText` envolve o título de botões e
  links do menu; cabeçalhos, meta e textos não glitcham.
- **Clique sintetizado por teclado tem `detail === 0`.** É assim que a janela
  ignora Enter/Espaço, que o aviso abre o menu pelo teclado (no centro) e que o
  menu decide mover o foco (só em navegação por teclado).
- **Dentro/fora por `composedPath()`, não `contains()`.** Quando o listener da
  janela roda, o React pode já ter desmontado o botão clicado. Elementos que
  contam como "dentro" levam `data-menu` (conteúdo e âncora — não a caixa
  inteira, que é invisível).
- **Animação fora do React.** FLIP e entrada via Web Animations API no
  `useLayoutEffect`; zero estado de animação. `AnchorDot` recebe props só em
  eventos raros (abrir, navegar) e as copia para refs que o loop lê.
- **Bolinha barata por construção.** Canvas 2D de 56px (não WebGL, não tela
  cheia) movido por `translate3d` — o compositor move a camada. O rAF hiberna
  quando as molas assentam; o próximo convite acorda por `setTimeout`. DPR
  limitado a 2. Não troque por canvas de tela cheia nem por loop contínuo.
- **Disco da Spark no desktop é do canvas.** O `<circle>` da `Spark` tem
  `pointer-fine:hidden`; o SVG só contribui com os raios.
- **Acessibilidade não é opcional aqui.** `nav` rotulada, `sr-only` com o texto
  limpo dentro do `GlitchText`, `h1` sr-only, anel de foco em `--color-accent`,
  Esc fecha e devolve o foco ao aviso, voltar devolve o foco ao item de origem.
- **`prefers-reduced-motion` desliga efeitos.** Checado em JS (`Menu`,
  `GlitchText`, `AnchorDot` — gruda no mouse e mostra os raios parados) e em CSS (`index.css`). Todo efeito novo precisa desse guarda.
- **Um único acento de cor.** `--color-accent` (violeta da marca), hoje só no
  foco. Fora dele, preto em opacidades (.85 títulos, .75 raiz, .65 meta/texto).
- **Zero dependências de UI.** SVG inline; sem lib de animação, ícones ou
  componentes. Só React, React DOM e Tailwind. Fontes via Google Fonts.
- **Comentários em pt-BR** explicando o *porquê*, no topo do bloco. Siga o tom.
- **Tailwind v4** via plugin do Vite (`@tailwindcss/vite`) e `@import "tailwindcss"`
  no CSS. Não existe `tailwind.config.js` — não crie um sem necessidade.

## Pendências conhecidas

- **Foto e título centrais** (Desktop-2 do Figma: foto + "Matheus Araripe, um
  designer que programa") ainda não entraram — hoje o centro está vazio no
  desktop e só tem o aviso no toque.
- Três tópicos de Maria Eulália ("Arquitetura de Tema e Autonomia", "UI/UX &
  Front-end", "Lógica de Negócios…") não têm texto no Figma; aparecem como
  texto não clicável até ganharem `body`.
- Textos de Nova Tendência (Brasilseg) e Fiocruz (ORCA) foram casados com os
  itens a partir do CV do Figma (`A4 - 3`) — confirmar. `meta` de LAB_TT
  ("Experimental") também é chute.
- `link` dos trabalhos está nos dados mas nenhuma tela o exibe ainda.
- `socials` (Contato) ainda aponta para `"#"`.
- `legacy/` guarda a interface antiga, versionada no primeiro commit; pode
  ser apagada — o histórico do git a preserva.
- A pasta local ainda se chama `alia`; renomear para `EuSouTT` com o Claude
  Code e o VS Code fechados (o Windows trava a pasta em uso).
- `README.md` ainda é o boilerplate do template Vite.
- `public/favicon.svg` carrega peso morto do export do Figma.

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
