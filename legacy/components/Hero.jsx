import { hero, works } from "../data/content";
import GlitchText from "./GlitchText";

/**
 * Hero: frase de abertura à esquerda, histórico ano / empresa / cargo à direita.
 *
 * O bloco inteiro é ancorado no rodapé da dobra (`justify-end`) e o ponto de
 * acento é empurrado para o topo com `mb-auto` — é ele que ocupa o vazio de cima
 * em vez de um espaçador fixo, então a composição se adapta a qualquer altura.
 *
 * O título reage ao cursor pelo GlitchText, mas não é clicável: nada de
 * `data-interactive` aqui, só os links de empresa expandem o cursor.
 *
 * No desktop o bloco é ancorado no rodapé da dobra, como na referência. No
 * mobile isso deixaria meia tela vazia no topo, então lá ele flui normalmente
 * logo abaixo do cabeçalho.
 */
export default function Hero() {
  return (
    <section id="sobre" className="scroll-mt-24 px-6 pt-8 pb-20 sm:px-10 sm:pb-28 lg:pt-0">
      <div className="mx-auto flex w-full max-w-7xl flex-col lg:min-h-[78dvh] lg:justify-end">
        <div className="flex flex-col gap-14 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
          {/* Os dois trechos são inline (e reflui com `text-balance`) até `lg`,
              onde viram bloco e a quebra passa a ser a definida no conteúdo. */}
          <h1 className="max-w-xl font-serif text-[2.6rem] leading-[1.06] tracking-[-0.03em] text-balance sm:text-[3.25rem] lg:max-w-none lg:shrink-0 lg:basis-[52%] lg:text-[3.125rem] lg:text-wrap">
            <span className="lg:block">
              <GlitchText>{hero.intro}</GlitchText>
            </span>{" "}
            <span className="lg:block">
              <GlitchText>{hero.outro}</GlitchText>{" "}
              <em>
                <GlitchText>{hero.accent}</GlitchText>
              </em>
              .
            </span>
          </h1>

          <div className="w-full lg:flex-1">
            <h2 className="sr-only">Experiência</h2>

            {/* As colunas vivem na <ol> e cada <li> as herda por subgrid, em
                todos os tamanhos: elas se dimensionam ao texto mais largo da
                lista e ficam alinhadas entre as linhas, sem largura chumbada.
                No mobile são duas (ano | empresa+cargo), no desktop três. */}
            <ol className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-6 gap-y-5 text-sm sm:grid-cols-[auto_auto_minmax(0,1fr)] sm:gap-y-2.5">
              {works.map((work) => (
                <li
                  key={work.id}
                  className="col-span-2 grid grid-cols-subgrid items-baseline gap-y-1 sm:col-span-3 sm:gap-y-0"
                >
                  <span className="tabular-nums text-gray-400">{work.year}</span>

                  <a
                    href={work.link}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="font-medium underline decoration-transparent underline-offset-4 transition-colors duration-200 hover:text-accent hover:decoration-current"
                  >
                    {work.title}
                  </a>

                  {/* No mobile o cargo desce para baixo da empresa, na mesma
                      coluna — o ano fica sozinho na coluna da esquerda. */}
                  <span className="col-start-2 text-gray-400 sm:col-start-3 sm:text-[0.8125rem]">
                    {work.position}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
