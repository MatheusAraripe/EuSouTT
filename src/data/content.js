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
  { id: "github", title: "GitHub", href: "#" },
  { id: "linkedin", title: "LinkedIn", href: "#" },
  { id: "behance", title: "Behance", href: "#" },
];

// --- RAIZ ---------------------------------------------------------------------
// O que aparece quando o menu é invocado.
export const menu = [
  {
    id: "sobre",
    title: "Sobre",
    body: [
      "Sou um designer e desenvolvedor multidisciplinar focado em criar ecossistemas de marca fortes e funcionais. Minha atuação transita de forma fluida entre o design gráfico tradicional, a arquitetura de interfaces (UI/UX) e o desenvolvimento web.",
      "Acredito que uma marca premium se constrói na intersecção entre uma identidade visual marcante e uma experiência digital impecável. Do conceito estratégico e design de embalagens à linha de código final, transformo visões criativas em produtos digitais sofisticados, responsivos e de alto impacto.",
    ],
  },
  { id: "trabalho", title: "Trabalho", children: works },
  { id: "projeto", title: "Projeto", children: projects },
  { id: "contato", title: "Contato", children: socials },
];
