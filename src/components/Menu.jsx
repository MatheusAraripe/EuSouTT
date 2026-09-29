import { useEffect, useLayoutEffect, useRef, useState } from "react";
import GlitchText from "./GlitchText";
import { ArrowBack, ArrowOut, Spark } from "./icons";
import { menu } from "../data/content";

// --- Geometria ----------------------------------------------------------------
// A tela é dividida em quatro setores pelo ponto do clique. O menu é
// justificado para o lado da âncora (L/R) e cresce para a metade que tem mais
// espaço (para baixo no setor de cima, para cima no de baixo). Assim ele
// nunca é invocado para fora da tela.
const MARGIN = 16; // distância mínima entre o menu e a borda da tela
const GAP = 6; // da âncora até o texto: a borda do disco da marca
const PAD = 4; // respiro interno para o anel de foco não ser cortado
// Folga para o rótulo "Δx=…px" do GlitchText, que pendura 16px abaixo e 12px
// à direita da letra. Fica dentro da caixa: fora dela o rótulo é cortado e
// ainda estica a área de rolagem (barra aparecendo com 4 itens). No setor de
// baixo é ela que afasta o texto da âncora.
const GLITCH_X = 14;
const GLITCH_Y = 18;
const ARROW = 20; // largura da seta de voltar (icons.jsx)
const MAX_W = 304; // ~300px do protótipo: a mono de 16px pede mais linha que a de 13
// Cabe Sobre inteiro (intro + arquétipos) quando há espaço; em telas baixas
// ou com o clique no meio, quem limita é a distância até a borda.
const MAX_H = 576;
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

const reducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function place(clientX, clientY) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const x = clamp(clientX, MARGIN, vw - MARGIN);
  const y = clamp(clientY, MARGIN, vh - MARGIN);
  const right = x > vw / 2;
  const up = y > vh / 2;
  const width = Math.min(
    MAX_W,
    (right ? x : vw - x - GLITCH_X) - GAP - MARGIN,
  );
  const height = Math.min(MAX_H, (up ? y : vh - y) - GAP - MARGIN);

  return { x, y, right, up, width, height };
}

// A caixa é fixa durante toda a vida do menu: navegar troca o conteúdo, nunca
// a âncora. O que não couber rola dentro dela.
//
// A barra de rolagem conta como borda do menu. No lado R ela ficaria depois da
// folga do glitch, longe do texto, e a seta de voltar esbarraria nela; por
// isso, quando a tela rola (`tight`), a caixa termina na borda do texto — a
// barra ocupa exatamente a linha onde o texto terminaria e o texto recua.
function boxStyle({ x, y, right, up, width, height }, tight) {
  const top = (up ? y - GAP - height : y + GAP) - PAD;
  const bottom = PAD + GLITCH_Y;

  if (right && tight) {
    return {
      left: x - GAP - width - PAD,
      top,
      width: width + PAD,
      height: height + PAD * 2,
      padding: `${PAD}px ${GLITCH_X}px ${bottom}px ${PAD}px`,
    };
  }

  return {
    left: (right ? x - GAP - width : x + GAP) - PAD,
    top,
    width: width + GLITCH_X + PAD * 2,
    height: height + PAD * 2,
    padding: `${PAD}px ${PAD + GLITCH_X}px ${bottom}px ${PAD}px`,
  };
}

// --- Tipografia por nível -----------------------------------------------------
// Um nó aberto vira cabeçalho com o mesmo estilo que tinha na lista — é isso
// que deixa o título "viajar" até o topo sem mudar de cara. Os papéis (h2,
// h3, h4, p) são os da escala em index.css: a raiz e os títulos são h2; os
// links de navegação abaixo deles, h4.
const TITLE = {
  1: { tag: "h2", cls: "type-h2 text-black/75" },
  2: { tag: "h2", cls: "type-h2 text-black/85" },
  3: { tag: "h4", cls: "type-h4 text-black/65" },
};
const title = (level) => TITLE[Math.min(level, 3)];

const opens = (node) => Boolean(node.children || node.body);

const FOCUS =
  "rounded-xs focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-accent";

// Mesma curva das animações do menu (EASE), em CSS.
const ARROW_MOTION =
  "transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]";

// Na lista o título mora dentro do <button>/<a>, que não aceita heading: lá
// ele leva só o papel visual. Na trilha (`heading`) vira a tag de verdade.
function Title({ node, level, glitch = false, heading = false }) {
  const { tag, cls } = title(level);
  const Tag = heading ? tag : "span";

  return (
    <Tag className={`block ${cls}`}>
      {glitch ? <GlitchText>{node.title}</GlitchText> : node.title}
    </Tag>
  );
}

// Linha do subtítulo (empresa, ano…). Fica fora do botão do título — é ela
// que carrega o link para o projeto, e um link não pode morar dentro de um
// botão. O ícone acompanha o tamanho da linha (1em) e, por isso, a escala.
function Meta({ node, heading = false }) {
  if (!node.meta) return null;
  const Tag = heading ? "h3" : "span";

  return (
    <span className="mt-1 flex items-center gap-2 text-black/65">
      <Tag className="type-h3 whitespace-pre-wrap">{node.meta.join("  ")}</Tag>
      {node.link && (
        <a
          href={node.link}
          target="_blank"
          rel="noreferrer"
          aria-label={`Ver o projeto ${node.title} (abre em nova aba)`}
          // A área de toque cresce além do ícone sem mexer no layout.
          className={`group type-h3 relative grid cursor-pointer place-items-center transition-colors after:absolute after:-inset-2 hover:text-black/85 ${FOCUS}`}
        >
          {/* No hover a seta "sai" pela diagonal e uma cópia entra pelo canto
              oposto — o gesto de ir para fora, recortado no quadrado do
              ícone. Só CSS; o reduced-motion global zera a transição. */}
          <span className="relative block size-[1em] overflow-hidden">
            <ArrowOut
              className={`absolute inset-0 ${ARROW_MOTION} group-hover:translate-x-full group-hover:-translate-y-full group-focus-visible:translate-x-full group-focus-visible:-translate-y-full`}
            />
            <ArrowOut
              className={`absolute inset-0 -translate-x-full translate-y-full ${ARROW_MOTION} group-hover:translate-0 group-focus-visible:translate-0`}
            />
          </span>
        </a>
      )}
    </span>
  );
}

function Label({ node, level, heading = false }) {
  return (
    <>
      <Title node={node} level={level} heading={heading} />
      <Meta node={node} heading={heading} />
    </>
  );
}

// Só o que é clicável ganha glitch e entra na ordem de foco. A área clicável
// é só a do título: o subtítulo vem depois, fora do botão.
function Item({ node, level, onOpen }) {
  const cls = `max-w-full cursor-pointer [text-align:inherit] ${FOCUS}`;
  // A raiz é só a lista de seções: o subtítulo de uma seção (o "TT" de Sobre)
  // aparece quando ela vira cabeçalho, não no primeiro menu.
  const meta = level > 1 && <Meta node={node} />;

  if (node.href) {
    const external = node.href.startsWith("http");
    return (
      <>
        <a
          href={node.href}
          className={cls}
          {...(external && { target: "_blank", rel: "noreferrer" })}
        >
          <Title node={node} level={level} glitch />
        </a>
        {meta}
      </>
    );
  }

  if (opens(node)) {
    return (
      <>
        <button type="button" className={cls} onClick={(e) => onOpen(node, e)}>
          <Title node={node} level={level} glitch />
        </button>
        {meta}
      </>
    );
  }

  return <Label node={node} level={level} />;
}

// Uma tela do menu. `path` é a pilha de nós abertos a partir da raiz. As
// seções da raiz (Sobre, Trabalho…) não viram cabeçalho: só o que está abaixo
// delas forma a trilha no topo.
function View({ path, right, onOpen }) {
  const node = path.at(-1);
  // Uma seção da raiz com `meta` (Sobre) se apresenta como título: entra na
  // trilha e o que está abaixo dela desce um nível — seus tópicos são links de
  // navegação (h4), como os de um trabalho. As demais (Trabalho, Projeto…)
  // são só categorias e somem do topo.
  const titled = Boolean(path[0]?.meta);
  const depth = (i) => (i === 0 ? 1 : i + 1 + (titled ? 1 : 0));
  const trail = path
    .map((n, i) => ({ n, level: depth(i) }))
    .filter((_, i) => i > 0 || titled);
  const items = node ? (node.children ?? []) : menu;
  const body = node?.body ?? [];
  // Título e subtítulo empilhados e encostados no lado da âncora — na trilha
  // e na lista. A linha do subtítulo é flex e, sem isso, esticaria.
  const stack = `flex max-w-full flex-col ${right ? "items-end" : "items-start"}`;

  return (
    <>
      {trail.map(({ n, level }, i) => (
        <div
          key={n.id}
          data-flip={n.id}
          className={`${stack} ${i > 0 ? "mt-7" : ""}`}
        >
          <Label node={n} level={level} heading />
        </div>
      ))}

      {/* Parágrafos são blocos justificados na largura toda, dos dois lados
          da tela — só títulos, subtítulos e links seguem o lado da âncora. */}
      {body.map((text, i) => (
        <p
          key={i}
          data-flip={`${node.id}/body/${i}`}
          className={`${trail.length || i ? "mt-4" : ""} type-p self-stretch text-justify text-black/65`}
        >
          {text}
        </p>
      ))}

      {items.length > 0 && (
        <ul
          className={`flex flex-col ${path.length ? "gap-4" : "gap-3"} ${right ? "items-end" : "items-start"} ${trail.length || body.length ? "mt-4" : ""}`}
        >
          {items.map((n) => (
            <li
              key={n.id}
              data-flip={n.id}
              className={stack}
            >
              <Item node={n} level={depth(path.length)} onOpen={onOpen} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

// Uma invocação do menu. Quem monta passa `key` nova a cada clique na tela:
// o menu nasce sempre na raiz e não guarda memória da vez anterior.
// `onAnchor` informa onde a âncora ficou (já contida na tela) e a
// profundidade, para a bolinha do desktop pousar ali e sumir sob a seta.
export default function Menu({
  x: clickX,
  y: clickY,
  autoFocus = false,
  onAnchor,
}) {
  const [geometry] = useState(() => place(clickX, clickY));
  const { x, y, right, up } = geometry;
  const [path, setPath] = useState([]);
  // Tela (identidade do `path`) que transbordou a caixa larga no lado R.
  // Trocar de tela zera sozinho: o novo `path` nunca é o guardado.
  const [scrolling, setScrolling] = useState(null);
  const tight = right && scrolling === path;

  const scroller = useRef(null);
  const content = useRef(null);
  const backButton = useRef(null);
  const before = useRef(new Map());
  // O que focar depois da próxima troca de tela: null (nada), "first" ou o
  // id do item de onde se voltou. Só acontece em navegação por teclado.
  const focusTarget = useRef(autoFocus ? "first" : null);

  const go = (next, viaKeyboard, target = "first") => {
    // Fotografa onde cada bloco está antes da troca, para o FLIP depois dela.
    const rects = new Map();
    content.current.querySelectorAll("[data-flip]").forEach((el) => {
      rects.set(el.dataset.flip, el.getBoundingClientRect());
    });
    before.current = rects;
    focusTarget.current = viaKeyboard ? target : null;
    setPath(next);
  };

  // `detail === 0` é o clique que o navegador sintetiza a partir de Enter/Espaço.
  const open = (node, e) => go([...path, node], e.detail === 0);
  const back = (e) => go(path.slice(0, -1), e.detail === 0, path.at(-1).id);

  // `box` é onde há texto nesta tela (o conteúdo recortado pela caixa, que
  // é invisível e maior). O App usa para saber se o menu cobre a foto.
  useLayoutEffect(() => {
    const frame = scroller.current.getBoundingClientRect();
    const text = content.current.getBoundingClientRect();
    onAnchor?.({
      x,
      y,
      depth: path.length,
      box: {
        left: Math.max(frame.left, text.left),
        top: Math.max(frame.top, text.top),
        right: Math.min(frame.right, text.right),
        bottom: Math.min(frame.bottom, text.bottom),
      },
    });
  }, [onAnchor, x, y, path]);

  useLayoutEffect(() => {
    const el = scroller.current;
    el.scrollTop = 0;

    // Transbordou no lado R: refaz a caixa antes de pintar e só então anima
    // (o efeito roda de novo com `tight`; a fotografia do FLIP é preservada).
    // Não oscila — a caixa estreita só deixa o conteúdo mais alto.
    if (right && !tight && el.scrollHeight > el.clientHeight) {
      setScrolling(path);
      return;
    }

    const root = content.current;
    const prev = before.current;
    before.current = new Map();

    const target = focusTarget.current;
    if (target) {
      focusTarget.current = null;
      const scope =
        target === "first"
          ? root
          : (root.querySelector(`[data-flip="${target}"]`) ?? root);
      (scope.querySelector("a, button") ?? backButton.current)?.focus({
        preventScroll: true,
      });
    }

    if (reducedMotion()) return;

    // Blocos que existiam antes deslizam da posição antiga para a nova (o
    // título clicado sobe até o cabeçalho); os novos surgem a partir da
    // âncora, um a um, na direção em que o menu cresce.
    const fresh = [];
    root.querySelectorAll("[data-flip]").forEach((el) => {
      const from = prev.get(el.dataset.flip);
      if (!from) {
        fresh.push(el);
        return;
      }
      const to = el.getBoundingClientRect();
      const dx = right ? from.right - to.right : from.left - to.left;
      const dy = from.top - to.top;
      if (dx || dy) {
        el.animate(
          [{ transform: `translate(${dx}px, ${dy}px)` }, { transform: "none" }],
          { duration: 480, easing: EASE },
        );
      }
    });

    if (up) fresh.reverse();
    const wait = prev.size ? 180 : 0;
    fresh.forEach((el, i) => {
      el.animate(
        [
          { opacity: 0, transform: `translateY(${up ? 8 : -8}px)` },
          { opacity: 1, transform: "none" },
        ],
        { duration: 360, delay: wait + i * 45, easing: EASE, fill: "backwards" },
      );
    });
  }, [path, right, up, tight]);

  // O transbordo também pode surgir depois da primeira pintura: a mono do
  // texto corrido só carrega quando a tela é aberta (display=swap) e o
  // fallback ocupa menos altura.
  useEffect(() => {
    if (!right || tight) return;
    const el = scroller.current;
    const observer = new ResizeObserver(() => {
      if (el.scrollHeight > el.clientHeight) setScrolling(path);
    });
    observer.observe(content.current);
    return () => observer.disconnect();
  }, [path, right, tight]);

  // Borda com mais texto esmaece (data-more → máscara em index.css). No toque
  // não há hover, então o fio da barra nunca aparece: sem isso nada diria que
  // a tela continua. Escrito direto no DOM, fora do React, como as animações.
  useEffect(() => {
    const el = scroller.current;
    const update = () => {
      const rest = el.scrollHeight - el.clientHeight - el.scrollTop;
      el.dataset.more = [el.scrollTop > 1 && "top", rest > 1 && "bottom"]
        .filter(Boolean)
        .join(" ");
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(content.current);
    return () => {
      el.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, [path, tight]);

  return (
    <>
      {/* Âncora: a marca do clique na raiz, a seta de voltar nos níveis abaixo.
          Fica sempre nas mesmas coordenadas. */}
      <div data-menu className="fixed z-10 text-black/75" style={{ left: x, top: y }}>
        {path.length ? (
          <button
            ref={backButton}
            type="button"
            aria-label="Voltar"
            onClick={back}
            className={`menu-pop absolute grid size-9 -translate-x-1/2 -translate-y-1/2 cursor-pointer place-items-center ${FOCUS}`}
          >
            {/* Aponta para o lado da justificação, com a cauda exatamente na
                borda do menu (texto ou barra de rolagem). */}
            <ArrowBack
              style={{
                translate: `${(right ? 1 : -1) * (ARROW / 2 - GAP)}px 0`,
                scale: right ? "-1 1" : undefined,
              }}
            />
          </button>
        ) : (
          <Spark
            className="menu-pop absolute -translate-x-1/2 -translate-y-1/2"
            style={{ scale: `${right ? -1 : 1} ${up ? -1 : 1}` }}
          />
        )}
      </div>

      <nav
        ref={scroller}
        aria-label="Menu"
        className="menu-scroll fixed overflow-x-hidden overflow-y-auto overscroll-contain"
        style={boxStyle(geometry, tight)}
      >
        {/* No setor de baixo o conteúdo encosta na âncora (embaixo); se passar
            da altura, rola normalmente a partir do topo. */}
        <div className={`flex min-h-full flex-col ${up ? "justify-end" : ""}`}>
          <div
            ref={content}
            data-menu
            className={`flex flex-col text-black ${right ? "items-end text-right" : "items-start text-left"}`}
          >
            <View path={path} right={right} onOpen={open} />
          </div>
        </div>
      </nav>
    </>
  );
}
