// Fonte única de conteúdo do site.
// O site inteiro é o menu: cada nó é uma tela dele. Um nó abre outro nível se
// tiver `children` ou `body`; vira link se tiver `href`; sem nenhum dos três é
// só texto (e por isso não recebe glitch nem foco).
//
//   title     texto principal do item
//   meta      linha mono embaixo do título (empresa, ano…)
//   body      parágrafos exibidos quando o nó está aberto
//   children  subitens listados depois do body
//   href      destino externo
//
// `id` precisa ser único no menu inteiro: é por ele que o título "viaja" da
// lista até o cabeçalho quando o nó é aberto.

// --- TRABALHO -----------------------------------------------------------------
// Textos vindos do Figma (telas do menu e CV "A4 - 3").
const works = [
  {
    id: "maria-eulalia",
    title: "Dev Front-end & UI Designer",
    meta: ["Maria Eulália", "2026"],
    link: "https://www.mariaeulalia.com.br/",
    body: [
      "Criação de ferramentas customizadas que deram autonomia para a equipe da loja e melhoraram a jornada de compra do cliente.",
    ],
    // TODO: os três últimos tópicos ainda não têm texto no Figma — ganham
    // `body` (e viram clicáveis) quando houver.
    children: [
      {
        id: "maria-eulalia-componentes",
        title: "Desenvolvimento de Componentes Dinâmicos (Shopify Liquid)",
        body: [
          "Engenharia de uma “Gaveta de Medidas” (Side Drawer) interativa na página de produto. Implementação de renderização condicional que exibe conteúdos específicos automaticamente com base na categoria da joia, reduzindo o atrito na jornada de compra.",
        ],
      },
      { id: "maria-eulalia-tema", title: "Arquitetura de Tema e Autonomia" },
      { id: "maria-eulalia-ui", title: "UI/UX & Front-end" },
      {
        id: "maria-eulalia-precificacao",
        title: "Lógica de Negócios e Regras de Precificação",
      },
    ],
  },
  {
    id: "inexplicavel",
    title: "Design de Marca",
    meta: ["Inexplicável", "2025-2026"],
    link: "https://www.instagram.com/inexplicavelvinhos",
    body: [
      "Concepção completa de identidade visual, verbal e posicionamento para bar e loja de vinhos. Desenvolvimento de logotipo tipográfico minimalista, design de rótulos limpos com foco em espaço negativo e criação de manuais de marca escaláveis para PDV e digital.",
    ],
  },
  {
    id: "nova-tendencia",
    title: "Estágio & Dev Front-end Jr",
    meta: ["Nova Tendência", "2023-2024"],
    link: "https://ntendencia.com.br/",
    body: [
      "Construção da interface do Portal de Parceiros da Brasilseg, unindo viabilidade técnica e estética limpa. Foco na criação de componentes modulares e na tradução fiel de layouts para telas responsivas.",
    ],
  },
  {
    id: "fiocruz",
    title: "Iniciação Científica",
    meta: ["Fiocruz", "2022"],
    link: "https://fiocruz.br/",
    body: [
      "Desenvolvimento de aplicação web para visualização 3D interativa de moléculas. O sistema foca em UX para automatizar a extração de dados do software ORCA, traduzindo cálculos complexos de química quântica em uma interface de análise intuitiva e acessível.",
    ],
  },
];

// --- PROJETO ------------------------------------------------------------------
const projects = [
  {
    id: "lab-tt",
    title: "LAB_TT",
    meta: ["Experimental"],
    body: [
      "Website experimental para estudos de design e front-end. A ideia é produzir peças visuais e interativas que misturam conceitos diferentes de design, matemática e tecnologia.",
    ],
  },
];

// --- CONTATO ------------------------------------------------------------------
// TODO: trocar "#" pelas URLs reais dos perfis.
const socials = [
  {
    id: "linkedin",
    title: "LinkedIn",
    href: "https://www.linkedin.com/in/matheus-araripe/",
  },
  {
    id: "behance",
    title: "Behance",
    href: "https://www.behance.net/matheusararipe",
  },
  { id: "github", title: "GitHub", href: "https://github.com/MatheusAraripe" },
];

// --- RAIZ ---------------------------------------------------------------------
// O que aparece quando o menu é invocado.
export const menu = [
  {
    id: "sobre",
    title: "Sobre",
    body: [
      "Sou um designer e desenvolvedor multidisciplinar guiado por uma forte visão de produto e pelo comportamento humano. Minha principal vantagem competitiva é a leitura da cultura e um faro apurado para o Zeitgeist. Entendo profundamente como a sociedade pensa e compreendo a dinâmica das tribos, o que me confere uma base estratégica sólida para conceber marcas, produtos e campanhas que realmente ressoam com o público.",
      "Na minha forma de trabalhar, estruturo essa visão através de três arquétipos centrais:",
      "Como Prototipador, utilizo essa sensibilidade social para mapear possibilidades e testar hipóteses. Antes de desenhar, busco o alinhamento cultural, criando conceitos e ecossistemas de marca fortes e funcionais que se conectem de verdade com as pessoas.",
      "Como Construtor, traduzo esse entendimento humano em execução prática. Construo produtos digitais com pragmatismo, transformando a visão estratégica inicial em soluções reais, responsivas e de alto impacto.",
      "Por fim, assumo a postura de Limpador para proteger a essência do produto. Removo ruídos, elimino complexidades e simplifico arquiteturas. Meu objetivo final é entregar soluções enxutas, garantindo que a comunicação da marca seja clara e que a experiência seja impecável, livre de atritos e perfeitamente alinhada à forma como o público consome e interage.",
    ],
  },
  { id: "trabalho", title: "Trabalho", children: works },
  { id: "projeto", title: "Projeto", children: projects },
  { id: "contato", title: "Contato", children: socials },
];
