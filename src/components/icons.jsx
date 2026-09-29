// SVGs inline do menu. Herdam a cor via currentColor.

// Marca do clique: disco na âncora com três raios saindo pela diagonal
// superior esquerda (geometria tirada do Figma, origem no centro do disco).
// Quem usa espelha com scale(±1, ±1) para os raios sempre apontarem para
// longe do menu. No desktop o disco é desenhado pela AnchorDot (canvas) e
// aqui ficam só os raios.
export function Spark(props) {
  return (
    <svg
      viewBox="-14 -14 28 28"
      width="28"
      height="28"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      aria-hidden="true"
      {...props}
    >
      <circle
        cx="0"
        cy="0"
        r="5.5"
        fill="currentColor"
        stroke="none"
        className="pointer-fine:hidden"
      />
      <path d="M-10.5 -6.5 L-5.7 -5.1 M-6.5 -11.5 L-4.3 -7 M-0.8 -12.5 L-1.5 -7.5" />
    </svg>
  );
}

export function ArrowBack(props) {
  return (
    <svg
      viewBox="0 0 20 10"
      width="20"
      height="10"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M19 5H1M5 1 1 5l4 4" />
    </svg>
  );
}

// Link para fora (projeto publicado). Mede 1em para seguir o tamanho do texto
// da linha — e com ele a escala de 4 em telas estreitas.
export function ArrowOut(props) {
  return (
    <svg
      viewBox="0 0 12 12"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M3 9 9 3M4 3h5v5" />
    </svg>
  );
}
