import { useCallback, useRef, useState } from "react";
import { works } from "../data/content";
import GlitchText from "./GlitchText";
import ForceFieldText from "./ForceFieldText";
import { ArrowIcon } from "./icons";

const SWIPE_THRESHOLD = 45; // px

export default function Trabalhos() {
  const [index, setIndex] = useState(0);
  const touchStartX = useRef(0);

  const go = useCallback((step) => {
    setIndex((current) => (current + step + works.length) % works.length);
  }, []);

  const onKeyDown = useCallback(
    (event) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        go(-1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        go(1);
      }
    },
    [go],
  );

  const onTouchStart = useCallback((event) => {
    touchStartX.current = event.changedTouches[0].clientX;
  }, []);

  const onTouchEnd = useCallback(
    (event) => {
      const delta = event.changedTouches[0].clientX - touchStartX.current;
      if (Math.abs(delta) > SWIPE_THRESHOLD) go(delta < 0 ? 1 : -1);
    },
    [go],
  );

  return (
    <section id="trabalhos" className="scroll-mt-24 py-20 sm:py-28">
      <h2
        className="text-center text-2xl font-bold tracking-tight sm:text-4xl"
        data-interactive
      >
        <GlitchText>Trabalhos</GlitchText>
      </h2>

      <div
        className="mt-10 flex items-center gap-3 sm:mt-14 sm:gap-8"
        role="group"
        aria-roledescription="carrossel"
        aria-label="Trabalhos"
        tabIndex={0}
        onKeyDown={onKeyDown}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Trabalho anterior"
          className="carousel-arrow"
        >
          <ArrowIcon direction="left" className="w-7 sm:w-10" />
        </button>

        {/* Todos os slides ocupam a MESMA célula do grid: a altura do bloco é
            sempre a do slide mais alto, então trocar de slide nunca desloca
            as setas nem o restante da página — sem min-height mágico. */}
        <div className="grid flex-1">
          {works.map((work, i) => {
            const isActive = i === index;
            return (
              <article
                key={work.id}
                inert={!isActive}
                aria-hidden={!isActive}
                className={`col-start-1 row-start-1 transition duration-300 ease-out ${
                  isActive
                    ? "translate-y-0 opacity-100"
                    : "invisible translate-y-2 opacity-0"
                }`}
              >
                <h3 className="text-lg font-bold sm:text-xl" data-interactive>
                  <GlitchText>{work.title}</GlitchText>
                </h3>
                <p className="mt-1 mb-5 text-xs font-light tracking-wide text-gray-400 sm:text-sm">
                  {work.stack.join("  /  ")}
                </p>
                <ForceFieldText className="text-justify text-[15px] leading-relaxed font-medium sm:text-[17px]">
                  {work.description}
                </ForceFieldText>
              </article>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Próximo trabalho"
          className="carousel-arrow"
        >
          <ArrowIcon direction="right" className="w-7 sm:w-10" />
        </button>
      </div>

      <p className="sr-only" aria-live="polite">
        Trabalho {index + 1} de {works.length}: {works[index].title}
      </p>
    </section>
  );
}
