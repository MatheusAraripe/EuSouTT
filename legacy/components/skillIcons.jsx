// Glifos das habilidades exibidos dentro das bolinhas do diagrama de conjuntos.
// Elementos React estáticos: criados uma vez no módulo, nunca recriados em render.

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2.2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export const skillIcons = {
  code: (
    <g {...stroke}>
      <path d="M9 7 4 12l5 5" />
      <path d="m15 7 5 5-5 5" />
      <path d="M13.6 4.8 10.4 19.2" />
    </g>
  ),
  cursor: (
    <path
      d="M5.2 3.2 18.6 12.6l-6.2.9-2.9 6.1z"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
  ),
  cube: (
    <g {...stroke}>
      <path d="M12 2.8 20 7.4v9.2L12 21.2 4 16.6V7.4z" />
      <path d="M12 21.2V12m0 0 8-4.6M12 12 4 7.4" />
    </g>
  ),
  nib: (
    <g {...stroke}>
      <path d="M12 2.4 18.4 13 12 21.6 5.6 13z" />
      <circle cx="12" cy="12.4" r="1.9" fill="currentColor" stroke="none" />
    </g>
  ),
  layout: (
    <g {...stroke}>
      <rect x="3.4" y="4.4" width="17.2" height="15.2" rx="1.8" />
      <path d="M3.4 9.6h17.2M9.6 9.6v10" />
    </g>
  ),
  eye: (
    <g {...stroke}>
      <path d="M2.4 12C5.4 6.6 18.6 6.6 21.6 12c-3 5.4-16.2 5.4-19.2 0Z" />
      <circle cx="12" cy="12" r="2.5" fill="currentColor" stroke="none" />
    </g>
  ),
};
