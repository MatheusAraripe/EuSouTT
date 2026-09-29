import { useEffect, useLayoutEffect, useRef, useState } from "react";
import GlitchText from "./GlitchText";
import { ArrowBack, Spark } from "./icons";
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
const MAX_W = 240;
const MAX_H = 360;
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
// que deixa o título "viajar" até o topo sem mudar de cara.
const TITLE = {
  1: "font-serif text-base leading-5 text-black/75",
  2: "font-serif text-base leading-5 text-black/85",
  3: "font-mono text-[11px] leading-[1.3] font-semibold text-black/65",
};
const titleClass = (level) => TITLE[Math.min(level, 3)];
const bodySize = (level) => (level >= 3 ? "text-[11px]" : "text-[13px]");

const opens = (node) => Boolean(node.children || node.body);

const FOCUS =
  "rounded-xs focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-accent";

function Label({ node, level, glitch = false }) {
  return (
    <>
      <span className={`block ${titleClass(level)}`}>
        {glitch ? <GlitchText>{node.title}</GlitchText> : node.title}
      </span>
      {node.meta && (
        <span className="mt-1 block font-mono text-[13px] leading-[1.3] font-light whitespace-pre-wrap text-black/65">
          {node.meta.join("  ")}
        </span>
      )}
    </>
  );
}

// Só o que é clicável ganha glitch e entra na ordem de foco.
function Item({ node, level, onOpen }) {
  const cls = `block max-w-full cursor-pointer [text-align:inherit] ${FOCUS}`;

  if (node.href) {
    const external = node.href.startsWith("http");
    return (
      <a
        href={node.href}
        className={cls}
        {...(external && { target: "_blank", rel: "noreferrer" })}
      >
        <Label node={node} level={level} glitch />
      </a>
    );
  }

  if (opens(node)) {
    return (
      <button type="button" className={cls} onClick={(e) => onOpen(node, e)}>
        <Label node={node} level={level} glitch />
      </button>
    );
  }

  return <Label node={node} level={level} />;
}

// Uma tela do menu. `path` é a pilha de nós abertos a partir da raiz. As
// seções da raiz (Sobre, Trabalho…) não viram cabeçalho: só o que está abaixo
// delas forma a trilha no topo.
function View({ path, right, onOpen }) {
  const node = path.at(-1);
  const level = path.length;
  const trail = path.slice(1);
  const items = node ? (node.children ?? []) : menu;
  const body = node?.body ?? [];

  return (
    <>
      {trail.map((n, i) => (
        <div key={n.id} data-flip={n.id} className={i > 0 ? "mt-7" : ""}>
          <Label node={n} level={i + 2} />
        </div>
      ))}

      {body.map((text, i) => (
        <p
          key={i}
          data-flip={`${node.id}/body/${i}`}
          className={`${trail.length || i ? "mt-4" : ""} font-mono ${bodySize(level)} leading-[1.3] font-light text-black/65`}
        >
          {text}
        </p>
      ))}

      {items.length > 0 && (
        <ul
          className={`flex flex-col ${level === 0 ? "gap-3.5" : "gap-4"} ${right ? "items-end" : "items-start"} ${trail.length || body.length ? "mt-4" : ""}`}
        >
          {items.map((n) => (
            <li key={n.id} data-flip={n.id} className="max-w-full">
              <Item node={n} level={level + 1} onOpen={onOpen} />
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

  useLayoutEffect(() => {
    onAnchor?.({ x, y, depth: path.length });
  }, [onAnchor, x, y, path.length]);

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
