import { useCallback, useState } from "react";
import { skills } from "../data/content";
import { skillIcons } from "./skillIcons";

// --- Geometria do diagrama ----------------------------------------------------
// Tudo em unidades de viewBox: o SVG escala sozinho e a proporção nunca quebra.
const VIEW_W = 460;
const VIEW_H = 300;
const R = 124; // raio dos círculos
const CY = VIEW_H / 2;
const CX_DEV = 147;
const CX_DESIGN = VIEW_W - CX_DEV;

// Centro horizontal da área exclusiva de cada conjunto (onde ficam os rótulos).
const LABEL_DEV_X = (CX_DEV - R + (CX_DESIGN - R)) / 2;
const LABEL_DESIGN_X = VIEW_W - LABEL_DEV_X;

const NODE_HIT_R = 26; // alvo de toque generoso (invisível)

const polar = (cx, angleDeg) => {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: cx + R * Math.cos(rad), y: CY - R * Math.sin(rad) };
};

// Posições calculadas uma única vez no módulo, não a cada render.
const nodes = skills.map((skill) => ({
  ...skill,
  ...polar(skill.circle === "dev" ? CX_DEV : CX_DESIGN, skill.angle),
}));

export default function Sobre() {
  const [activeId, setActiveId] = useState(null);

  // Clicar na bolinha ativa fecha o painel — o diagrama volta ao estado inicial.
  const toggle = useCallback((id) => {
    setActiveId((current) => (current === id ? null : id));
  }, []);

  const onKeyDown = useCallback(
    (event, id) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggle(id);
      }
    },
    [toggle],
  );

  return (
    <section id="sobre" className="scroll-mt-24 pt-6 pb-20 sm:pt-10 sm:pb-28">
      <h1 className="sr-only">
        Matheus Araripe — desenvolvedor front-end e designer gráfico
      </h1>

      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className="mx-auto block w-full max-w-[30rem] text-black"
        role="group"
        aria-label="Diagrama de conjuntos entre desenvolvimento e design. Selecione um ponto para ver a habilidade."
      >
        <circle
          cx={CX_DEV}
          cy={CY}
          r={R}
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
        <circle
          cx={CX_DESIGN}
          cy={CY}
          r={R}
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />

        <text
          x={LABEL_DEV_X}
          y={CY}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="20"
          className="fill-black font-medium"
        >
          DEV
        </text>
        <text
          x={LABEL_DESIGN_X}
          y={CY}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="20"
          className="fill-black font-medium"
        >
          Design
        </text>
        <text
          x={VIEW_W / 2}
          y={CY}
          textAnchor="middle"
          fontSize="18"
          className="fill-black font-medium"
        >
          <tspan x={VIEW_W / 2} dy="-0.15em">
            Matheus
          </tspan>
          <tspan x={VIEW_W / 2} dy="1.15em">
            Araripe
          </tspan>
        </text>

        {nodes.map((node) => {
          const isActive = node.id === activeId;
          return (
            <g
              key={node.id}
              transform={`translate(${node.x} ${node.y})`}
              className="venn-node"
              data-active={isActive || undefined}
              role="button"
              tabIndex={0}
              aria-pressed={isActive}
              aria-label={node.title}
              onClick={() => toggle(node.id)}
              onKeyDown={(event) => onKeyDown(event, node.id)}
            >
              <circle r={NODE_HIT_R} fill="transparent" />
              <circle
                r="20"
                className="venn-ring"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />
              <circle r="9" className="venn-dot" fill="currentColor" />
              {isActive && (
                <g
                  className="venn-icon"
                  transform="translate(-11 -11) scale(0.9167)"
                  color="#ffffff"
                >
                  {skillIcons[node.icon]}
                </g>
              )}
            </g>
          );
        })}
      </svg>

      {/* Mesma técnica do carrossel: os seis textos ocupam a mesma célula do
          grid, então o espaço abaixo do diagrama já nasce reservado e abrir uma
          habilidade nunca empurra o resto da página. */}
      <div
        className="mx-auto mt-8 grid w-full max-w-[30rem] sm:mt-10"
        aria-live="polite"
      >
        {nodes.map((node) => {
          const isActive = node.id === activeId;
          return (
            <div
              key={node.id}
              inert={!isActive}
              aria-hidden={!isActive}
              className={`col-start-1 row-start-1 transition duration-300 ease-out ${
                isActive
                  ? "translate-y-0 opacity-100"
                  : "invisible translate-y-2 opacity-0"
              }`}
            >
              <h2 className="text-sm font-bold tracking-tight">{node.title}</h2>
              <p className="mt-2 text-justify text-sm leading-relaxed text-gray-600">
                {node.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
