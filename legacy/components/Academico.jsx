import { education } from "../data/content";
import GlitchText from "./GlitchText";

export default function Academico() {
  return (
    <section id="academico" className="scroll-mt-24 py-20 sm:py-28">
      <h2 className="text-center text-2xl font-bold tracking-tight sm:text-4xl">
        <GlitchText>Acadêmico</GlitchText>
      </h2>

      <ol className="relative mx-auto mt-12 max-w-2xl pb-24 sm:mt-16">
        {/* Linha central da timeline */}
        <span
          aria-hidden="true"
          className="absolute top-2 bottom-0 left-1/2 w-px -translate-x-1/2 bg-black"
        />

        {education.map((item, i) => {
          const contentLeft = i % 2 === 1; // itens pares (índice ímpar) invertem os lados
          const meta = (
            <span className="block text-sm text-gray-400 sm:text-base">{item.period}</span>
          );
          const content = (
            <div>
              <h3 className="text-base font-bold sm:text-lg">
                <GlitchText>{item.title}</GlitchText>
              </h3>
              <p className="mt-1 text-sm leading-snug text-gray-400 sm:text-base">
                {item.institution}
              </p>
            </div>
          );

          return (
            <li
              key={item.id}
              className="relative mb-20 grid grid-cols-2 gap-x-6 last:mb-0 sm:mb-24 sm:gap-x-10"
            >
              <span
                aria-hidden="true"
                className="absolute top-1.5 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-black sm:top-2"
              />
              <div className="text-right">{contentLeft ? content : meta}</div>
              <div className="text-left">{contentLeft ? meta : content}</div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
