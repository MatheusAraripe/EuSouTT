import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { slides } from "../data/slides";
import { ArrowBack, ArrowOut } from "./icons";
import photo from "../assets/image/tt.webp";

// --- Vitrine -----------------------------------------------------------------
// O centro da tela: uma mídia por vez (a lista e a ordem estão em
// data/slides.js), com o catálogo em volta — setas nos cantos de cima, nome
// no de baixo.

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
// Quanto a troca de mídia desliza: curto, como o resto do site.
const DRIFT = 24;

const FOCUS =
  "rounded-xs focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-accent";

const H1 = (
  <>
    Matheus Araripe,
    <br />
    um designer que programa
  </>
);

const pad = (n) => String(n).padStart(2, "0");

// Moodboard: as peças preenchem as células nomeadas do molde (`.moodboard` em
// index.css). No celular o molde é vertical e algumas células somem.
function Moodboard({ media }) {
  return (
    <div className="moodboard">
      {media.items.map((item) => (
        <img
          key={item.area}
          data-enter
          data-area={item.area}
          src={item.src}
          alt={item.alt}
          decoding="async"
          draggable={false}
          className="size-full object-cover"
          style={{ gridArea: item.area }}
        />
      ))}
    </div>
  );
}

// Vídeo de apresentação: loop, sem som, inline no iOS. 304 no celular, 480
// a partir de 640px (ou menos, se a tela for baixa — sobra espaço para o
// catálogo, o nome e o aviso). Com reduced-motion não toca — fica o
// primeiro quadro.
function Motion({ media }) {
  const video = useRef(null);

  useEffect(() => {
    const el = video.current;
    // `muted` como propriedade antes do play: é o que libera o autoplay.
    el.muted = true;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    el.play().catch(() => {});
  }, []);

  return (
    <video
      ref={video}
      data-enter
      src={media.src}
      poster={media.poster}
      aria-label={media.alt}
      muted
      loop
      playsInline
      preload="auto"
      className="size-76 object-cover sm:size-[min(480px,100dvh-208px)]"
    />
  );
}

// Seta do carrossel. No hover (ou foco de teclado) acende e "passa": sai pelo
// lado para onde aponta enquanto uma cópia entra pelo outro — o mesmo gesto
// do ícone de link do menu, na horizontal. Só CSS; o reduced-motion global
// zera a transição. A seta da direita é a da esquerda espelhada.
const SLIDE =
  "absolute inset-0 transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]";

function Step({ dir, label, onStep }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={() => onStep(dir)}
      // A área de toque cresce além da seta sem mexer no layout.
      className={`group relative grid cursor-pointer place-items-center transition-colors duration-300 after:absolute after:-inset-3 hover:text-black/85 focus-visible:text-black/85 ${FOCUS}`}
    >
      <span
        className={`relative block h-2.5 w-5 overflow-hidden ${dir > 0 ? "-scale-x-100" : ""}`}
      >
        <ArrowBack
          className={`${SLIDE} group-hover:-translate-x-full group-focus-visible:-translate-x-full`}
        />
        <ArrowBack
          className={`${SLIDE} translate-x-full group-hover:translate-x-0 group-focus-visible:translate-x-0`}
        />
      </span>
    </button>
  );
}

// Uma peça da vitrine: o retrato (com o h1 visível) ou a mídia de um nó, que
// é link para o projeto. `gone` é a que está saindo: fica por cima, centrada
// onde estava, fora do layout e fora do alcance do clique, do foco e do leitor.
function Slide({ slide, gone }) {
  const label = slide.media?.label ?? slide.node?.title;
  const ghost = gone && {
    "data-leaving": true,
    "aria-hidden": true,
    inert: true,
  };
  const place = gone
    ? "pointer-events-none absolute top-1/2 left-1/2 -translate-1/2"
    : "";

  if (slide.portrait) {
    return (
      <div {...ghost} className={`flex flex-col ${place}`}>
        <img
          data-enter
          src={photo}
          alt="Retrato de Matheus Araripe"
          width="480"
          height="640"
          decoding="async"
          draggable={false}
          className="h-48 w-36 object-cover sm:h-64 sm:w-48"
        />
        <h1 data-enter className="type-h1 mt-xs text-black/75">
          {H1}
        </h1>
      </div>
    );
  }

  // Toda mídia é link para o projeto. No desktop a bolinha vira o aviso
  // (`data-cursor`) e o cursor do sistema some; no toque, a seta ao lado do
  // nome diz que dá para abrir.
  return (
    <a
      {...ghost}
      href={slide.node.link}
      target="_blank"
      rel="noreferrer"
      data-own
      data-cursor="Ver projeto"
      aria-label={`Ver o projeto ${label} (abre em nova aba)`}
      className={`flex flex-col items-start pointer-fine:cursor-none ${FOCUS} ${place}`}
    >
      {slide.media.kind === "moodboard" ? (
        <Moodboard media={slide.media} />
      ) : (
        <Motion media={slide.media} />
      )}
      <span
        data-enter
        className="type-h1 mt-xs flex items-center gap-xs text-black/75"
      >
        {label}
        <ArrowOut className="text-black/65" />
      </span>
    </a>
  );
}

export default function Showcase({ index, onIndex }) {
  // A peça que sai continua montada durante a saída — e com a mesma `key`,
  // então é o mesmo elemento: o vídeo segue do quadro em que estava.
  // Atualizado no render (o padrão do React para "valor anterior"), não em
  // efeito, para a troca sair numa pintura só.
  const [shown, setShown] = useState(index);
  const [leaving, setLeaving] = useState(null);
  if (index !== shown) {
    setLeaving(shown);
    setShown(index);
  }

  const slide = slides[shown];
  const root = useRef(null);
  // Direção da troca: a da seta clicada; vinda do menu, a da ordem.
  const stepped = useRef(null);
  const before = useRef(index);
  const step = (d) => {
    stepped.current = d;
    onIndex((index + d + slides.length) % slides.length);
  };

  // A troca "passa": a peça que sai desliza e some para o lado de onde a
  // seta aponta, e as da nova entram uma a uma pelo lado oposto — o mesmo
  // movimento curto e a mesma curva do menu. Fora do React, via Web
  // Animations; a primeira pintura não anima. Com reduced-motion a troca é
  // seca.
  useLayoutEffect(() => {
    // Sem troca (a primeira pintura, ou o efeito repetido do StrictMode).
    if (before.current === shown) return;
    const d = stepped.current ?? (Math.sign(shown - before.current) || 1);
    stepped.current = null;
    before.current = shown;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const shift = `${d * DRIFT}px`;

    const ghost = root.current.querySelector("[data-leaving]");
    const out = ghost?.animate(
      [
        { opacity: 1, transform: "none" },
        { opacity: 0, transform: `translateX(calc(-1 * ${shift}))` },
      ],
      {
        duration: still ? 0 : 240,
        easing: "cubic-bezier(0.4, 0, 1, 1)",
        fill: "forwards",
      },
    );
    if (out) out.onfinish = () => setLeaving(null);

    if (!still) {
      root.current
        .querySelectorAll("[data-stage] > :not([data-leaving]) [data-enter]")
        .forEach((el, i) => {
          el.animate(
            [
              { opacity: 0, transform: `translateX(${shift})` },
              { opacity: 1, transform: "none" },
            ],
            {
              duration: 480,
              delay: 120 + i * 60,
              easing: EASE,
              fill: "backwards",
            },
          );
        });
    }
    // Troca em cima de troca: a saída anterior para aqui (sem `finish`, que
    // apagaria a peça que acabou de começar a sair).
    return () => {
      if (out) out.onfinish = null;
    };
  }, [shown]);

  const label = slide.media?.label ?? slide.node?.title;

  return (
    <div ref={root} className="flex flex-col">
      {/* Catálogo: uma seta em cada canto de cima, a posição entre elas,
          nome no canto de baixo. Tudo apagado até o cursor chegar — o mínimo
          de ruído em volta da mídia. `data-own`: o clique é deles, não
          invoca o menu. */}
      <div
        data-own
        className="mb-xs flex items-center justify-between font-mono text-small font-light text-black/25"
      >
        <Step dir={-1} label="Mídia anterior" onStep={step} />
        <span aria-hidden="true">
          {pad(shown + 1)}/{pad(slides.length)}
        </span>
        <Step dir={1} label="Próxima mídia" onStep={step} />
      </div>

      {/* Quem usa leitor de tela ouve a troca. */}
      <p className="sr-only" aria-live="polite">
        {slide.portrait
          ? ""
          : `${label}, mídia ${shown + 1} de ${slides.length}`}
      </p>

      {/* O palco: a peça nova define o tamanho; a que sai flutua por cima
          até sumir. Chaves por posição, nas duas — é o que mantém o
          elemento que sai. */}
      <div data-stage className="relative flex flex-col">
        {leaving !== null && (
          <Slide key={leaving} slide={slides[leaving]} gone />
        )}
        <Slide key={shown} slide={slide} />
      </div>

      {/* Fora do retrato o h1 continua na página para leitores e buscadores. */}
      {!slide.portrait && <h1 className="sr-only">{H1}</h1>}
    </div>
  );
}
